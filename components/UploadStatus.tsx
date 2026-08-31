"use client";

import { useEffect, useState } from "react";
import {
  subscribeOutbox,
  drainOutbox,
  type OutboxState,
} from "@/lib/attachmentOutbox";

/**
 * Ikke-blokerende status for billed-uploaden. Vises kun når der faktisk er
 * billeder i outboxen (dette skema-besøg eller en genoptaget rest). Bookingen
 * fungerer helt uafhængigt af den her. Kicker også drainen ved mount, så
 * /formular/book fortsætter en upload, der startede på /formular.
 */
export default function UploadStatus() {
  const [s, setS] = useState<OutboxState | null>(null);

  useEffect(() => {
    const unsub = subscribeOutbox(setS);
    void drainOutbox({ resumed: false });
    return unsub;
  }, []);

  if (!s || s.total === 0 || s.status === "idle") return null;

  const n = s.total;
  const billeder = `${n} billede${n === 1 ? "" : "r"}`;
  const busy = s.status === "draining";

  const label = busy
    ? `${s.resumed ? "Genoptager billed-upload" : "Sender billeder"} … (${s.done}/${n})`
    : s.status === "done"
      ? `${billeder} sendt`
      : // partial — brugeren forlod siden midt i, eller et kald fejlede
        `${s.done}/${n} billeder sendt. Resten forsøges igen næste gang du er på siden — ellers aftaler vi dem, når vi ringer.`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-4 flex items-center gap-3 border px-4 py-3 text-sm ${
        s.status === "partial"
          ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
          : "border-white/15 bg-white/[0.04] text-white/70"
      }`}
    >
      {busy && (
        <span
          aria-hidden
          className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-beige"
        />
      )}
      <span>{label}</span>
    </div>
  );
}
