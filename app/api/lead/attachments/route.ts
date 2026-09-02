import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

/**
 * Same-origin relay for skema-billeder. Browseren uploader ÉT billede ad gangen
 * hertil (fra den durable IndexedDB-outbox i lib/attachmentOutbox.ts), og denne
 * route videresender det til FormSubmit — samme leveringskanal som resten af
 * skemaet. Formålet er robusthed: en lille same-origin POST pr. fil rammer
 * hverken Vercels body-loft eller FormSubmits HTTP/2-grænse, og outboxen kan
 * genoptage det, browseren ikke nåede.
 *
 * Rører IKKE Advio Automation eller de tre proxy-ruter — ingen import af
 * proxyToAutomation, ingen Sheets/Calendar/Telegram.
 */

// Leveringsmål. Kan overstyres via env (fx til et lokalt test-sink), men
// defaulter til den rigtige FormSubmit-adresse — samme som resten af skemaet.
const FORMSUBMIT_ENDPOINT =
  process.env.FORMSUBMIT_ENDPOINT || "https://formsubmit.co/simon@advio.dk";
const MAX_FILE_BYTES = 6 * 1024 * 1024; // rigelig headroom efter klientside-nedskalering

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * `file.type` is whatever the caller's request declares — trivially
 * spoofable by anyone posting directly to this endpoint (bypassing the
 * browser form). This checks the actual leading bytes against known image
 * signatures instead, so a renamed/relabelled non-image can't ride through
 * as an "image" attachment. SVG is deliberately excluded even though it's
 * a valid image MIME type: it's XML and can carry an embedded <script>.
 */
async function sniffImageType(file: File): Promise<string | null> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image/jpeg";
  if (
    head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47 &&
    head[4] === 0x0d && head[5] === 0x0a && head[6] === 0x1a && head[7] === 0x0a
  ) {
    return "image/png";
  }
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x38) return "image/gif";
  if (
    head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
    head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

export async function POST(request: Request) {
  // Per-fil route -> mere generøs grænse end tekst-ruterne (op til ~20 billeder
  // pr. lead + genoptagelser), men stadig et loft mod spam.
  if (isRateLimited(`attach:${getClientIp(request)}`, 80, 10 * 60_000)) {
    return rateLimitResponse();
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Ugyldig upload" }, 400);
  }

  const file = form.get("file");
  const firma = String(form.get("firma") || "").slice(0, 200);
  const telefon = String(form.get("telefon") || "").slice(0, 60);
  const index = String(form.get("index") || "1").slice(0, 8);
  const total = String(form.get("total") || "1").slice(0, 8);

  if (!(file instanceof File)) {
    return json({ ok: false, error: "Ingen fil" }, 400);
  }
  if (!file.type.startsWith("image/")) {
    return json({ ok: false, error: "Kun billeder" }, 415);
  }
  if (file.size > MAX_FILE_BYTES) {
    return json({ ok: false, error: "Filen er for stor" }, 413);
  }
  // Don't trust the declared Content-Type — verify the actual file bytes.
  if (!(await sniffImageType(file))) {
    return json({ ok: false, error: "Filen er ikke et gyldigt billede" }, 415);
  }

  // Byg en minimal FormSubmit-mail for netop dette billede. Emnet tråd-matcher
  // på firma + telefon, så modtageren kan samle billederne med tekst-leaden.
  const out = new FormData();
  out.append(
    "_subject",
    `Billede ${index}/${total} — henvendelse fra ${firma || "ukendt firma"} (${telefon || "?"})`,
  );
  out.append("_template", "table");
  out.append("_captcha", "false");
  out.append("firma", firma);
  out.append("telefon", telefon);
  out.append("billede", file, file.name || `billede-${index}.jpg`);

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      body: out,
      redirect: "manual", // FormSubmit 302'er ved succes — det er en succes
      signal: AbortSignal.timeout(20_000),
    });
    // 2xx eller 3xx (redirect til _next / success-side) = modtaget.
    if (res.status < 400) return json({ ok: true }, 200);
    return json({ ok: false, error: `FormSubmit ${res.status}` }, 502);
  } catch {
    return json({ ok: false, error: "Kunne ikke sende" }, 502);
  }
}
