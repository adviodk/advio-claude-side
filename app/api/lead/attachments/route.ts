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
