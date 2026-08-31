"use client";

/**
 * Durabel klient-outbox for skema-vedhæftninger (billeder), så en upload kan
 * fortsætte/genoptages uafhængigt af formularsidens lifecycle.
 *
 * Baggrund: /formular navigerer straks videre til kalenderen, og billederne
 * uploades i baggrunden. En detached fetch dør dog, hvis brugeren lukker
 * fanen/browseren midt i. Denne løsning:
 *
 *  1. `enqueueAttachments()` skriver billed-blobs til IndexedDB FØR navigationen
 *     (hurtigt, blokerer ikke). Bookingflowet fortsætter uafhængigt.
 *  2. `drainOutbox()` tømmer køen: pr. billede -> nedskalering -> POST til den
 *     same-origin relay-route `/api/lead/attachments` (som videresender til
 *     FormSubmit, samme leveringskanal som hidtil) -> ved 2xx fjernes billedet
 *     fra IndexedDB. Drainen kaldes både på /formular/book og headless i root
 *     layout, så et nyt besøg på advio.dk genoptager resterne.
 *  3. Job'et udløber efter 24 t. Rammer et POST fejl, bliver billedet i køen og
 *     forsøges igen ved næste sidevisning / når fanen bliver synlig igen.
 *
 * Ingen ændring i Automation, Sheets, Calendar/Meet, Telegram eller de tre
 * proxy-ruter. Leveringskanalen er fortsat KUN FormSubmit.
 */

const DB_NAME = "advio-outbox";
const DB_VERSION = 1;
const STORE = "jobs";
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_IMAGES_PER_JOB = 20;
const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;

const MAX_EDGE = 2000;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESS_UNDER = 900 * 1024;

type OutboxImage = { id: string; name: string; type: string; blob: Blob };
type OutboxJob = {
  leadRef: string;
  firma: string;
  telefon: string;
  createdAt: number;
  totalImages: number;
  images: OutboxImage[]; // kun de endnu-ikke-sendte
};

export type OutboxState = {
  status: "idle" | "draining" | "done" | "partial";
  total: number; // billeder i alt (på tværs af ikke-udløbne jobs)
  done: number; // billeder bekræftet sendt
  resumed: boolean; // true når drainen samlede et allerede eksisterende job op
};

let state: OutboxState = { status: "idle", total: 0, done: 0, resumed: false };
const listeners = new Set<(s: OutboxState) => void>();

function emit(patch: Partial<OutboxState>) {
  state = { ...state, ...patch };
  for (const l of listeners) l(state);
}

export function getOutboxState(): OutboxState {
  return state;
}
export function subscribeOutbox(cb: (s: OutboxState) => void): () => void {
  listeners.add(cb);
  cb(state);
  return () => {
    listeners.delete(cb);
  };
}

/* ---------- IndexedDB helpers (vanilla, ingen deps) ---------- */

function idbAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "leadRef" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function getAllJobs(db: IDBDatabase): Promise<OutboxJob[]> {
  return new Promise((resolve, reject) => {
    const r = tx(db, "readonly").getAll();
    r.onsuccess = () => resolve((r.result as OutboxJob[]) ?? []);
    r.onerror = () => reject(r.error);
  });
}
function putJob(db: IDBDatabase, job: OutboxJob): Promise<void> {
  return new Promise((resolve, reject) => {
    const r = tx(db, "readwrite").put(job);
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}
function deleteJob(db: IDBDatabase, leadRef: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const r = tx(db, "readwrite").delete(leadRef);
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}

/* ---------- billed-nedskalering (best effort) ---------- */

async function downscale(blob: Blob, name: string, type: string): Promise<{ blob: Blob; name: string }> {
  if (!type.startsWith("image/") || type === "image/svg+xml" || type === "image/gif") {
    return { blob, name };
  }
  if (blob.size <= SKIP_COMPRESS_UNDER) return { blob, name };
  try {
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const longEdge = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, MAX_EDGE / longEdge);
    if (scale >= 1 && blob.size <= 1_400_000) {
      bitmap.close();
      return { blob, name };
    }
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { blob, name };
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const out = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", JPEG_QUALITY),
    );
    if (!out || out.size >= blob.size) return { blob, name };
    return { blob: out, name: name.replace(/\.[^.]+$/, "") + ".jpg" };
  } catch {
    return { blob, name };
  }
}

/* ---------- status ---------- */

function liveCounts(jobs: OutboxJob[]) {
  const alive = jobs.filter((j) => Date.now() - j.createdAt <= TTL_MS);
  const total = alive.reduce((n, j) => n + j.totalImages, 0);
  const done = alive.reduce((n, j) => n + (j.totalImages - j.images.length), 0);
  return { total, done, pending: total - done };
}

/* ---------- offentligt API ---------- */

/** Skriver billederne til IndexedDB og starter drainen. Returnerer STRAKS. */
export function enqueueAttachments(input: {
  leadRef: string;
  firma: string;
  telefon: string;
  files: File[];
}): void {
  const images = input.files
    .filter((f) => f.type.startsWith("image/") && f.size <= MAX_ORIGINAL_BYTES)
    .slice(0, MAX_IMAGES_PER_JOB)
    .map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      type: f.type,
      blob: f as Blob,
    }));
  if (images.length === 0) return;

  const job: OutboxJob = {
    leadRef: input.leadRef,
    firma: input.firma,
    telefon: input.telefon,
    createdAt: Date.now(),
    totalImages: images.length,
    images,
  };

  emit({ status: "draining", total: images.length, done: 0, resumed: false });

  void (async () => {
    if (!idbAvailable()) {
      // Ingen IndexedDB (meget sjældent / privat-tilstand): fald tilbage til
      // en enkelt best-effort drain uden persistering.
      await drainJobsInMemory([job]);
      return;
    }
    try {
      const db = await openDb();
      await putJob(db, job);
      db.close();
    } catch {
      await drainJobsInMemory([job]);
      return;
    }
    void drainOutbox({ resumed: false });
  })();
}

let draining = false;
let visibilityHooked = false;

/** Tømmer outboxen. Idempotent — flere samtidige kald er harmløse. */
export async function drainOutbox(opts: { resumed?: boolean } = {}): Promise<void> {
  if (typeof window === "undefined" || !idbAvailable()) return;
  if (!visibilityHooked) {
    visibilityHooked = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void drainOutbox({ resumed: true });
    });
  }
  if (draining) return;
  draining = true;

  try {
    let db: IDBDatabase;
    try {
      db = await openDb();
    } catch {
      return;
    }

    // Ryd udløbne + allerede-tomme jobs.
    for (const j of await getAllJobs(db)) {
      if (Date.now() - j.createdAt > TTL_MS || j.images.length === 0) {
        await deleteJob(db, j.leadRef).catch(() => {});
      }
    }
    const jobs = (await getAllJobs(db)).filter((j) => j.images.length > 0);

    if (jobs.length === 0) {
      // Intet at gøre — lad sidste synlige udfald ("N billeder sendt") stå.
      db.close();
      return;
    }

    // Stabil tæller for HELE denne kørsel, så statuslinjen ikke hopper når
    // færdige jobs slettes undervejs.
    const start = liveCounts(jobs);
    const denom = start.total;
    const base = start.done;
    let sent = 0;
    if (opts.resumed) emit({ resumed: true });
    emit({ status: "draining", total: denom, done: base + sent });

    for (const job of jobs) {
      let current: OutboxJob | undefined = (await getAllJobs(db)).find(
        (j) => j.leadRef === job.leadRef,
      );
      while (current && current.images.length > 0) {
        const img = current.images[0];
        const idx = current.totalImages - current.images.length + 1;

        let ok = false;
        try {
          const small = await downscale(img.blob, img.name, img.type);
          const fd = new FormData();
          fd.append("file", small.blob, small.name);
          fd.append("leadRef", current.leadRef);
          fd.append("firma", current.firma);
          fd.append("telefon", current.telefon);
          fd.append("index", String(idx));
          fd.append("total", String(current.totalImages));
          const res = await fetch("/api/lead/attachments", { method: "POST", body: fd });
          ok = res.ok;
        } catch {
          ok = false;
        }

        if (!ok) {
          current = undefined; // stop dette job — resten forsøges igen næste drain
          break;
        }

        const fresh = (await getAllJobs(db)).find((j) => j.leadRef === job.leadRef);
        if (!fresh) {
          current = undefined;
          break;
        }
        fresh.images = fresh.images.filter((x) => x.id !== img.id);
        if (fresh.images.length === 0) {
          await deleteJob(db, fresh.leadRef).catch(() => {});
          current = undefined;
        } else {
          await putJob(db, fresh).catch(() => {});
          current = fresh;
        }
        sent++;
        emit({ status: "draining", total: denom, done: base + sent });
      }
    }

    const leftover = (await getAllJobs(db)).filter((j) => j.images.length > 0);
    emit({
      status: liveCounts(leftover).pending === 0 ? "done" : "partial",
      total: denom,
      done: base + sent,
    });
    db.close();
  } finally {
    draining = false;
  }
}

/** Fallback uden persistering, hvis IndexedDB ikke kan bruges. */
async function drainJobsInMemory(jobs: OutboxJob[]): Promise<void> {
  for (const job of jobs) {
    let sent = 0;
    for (const img of job.images) {
      try {
        const small = await downscale(img.blob, img.name, img.type);
        const fd = new FormData();
        fd.append("file", small.blob, small.name);
        fd.append("leadRef", job.leadRef);
        fd.append("firma", job.firma);
        fd.append("telefon", job.telefon);
        fd.append("index", String(sent + 1));
        fd.append("total", String(job.totalImages));
        const res = await fetch("/api/lead/attachments", { method: "POST", body: fd });
        if (res.ok) sent++;
      } catch {
        /* ignoreres — ingen kø at genoptage fra */
      }
      emit({ status: "draining", total: job.totalImages, done: sent });
    }
    emit({
      status: sent >= job.totalImages ? "done" : "partial",
      total: job.totalImages,
      done: sent,
    });
  }
}
