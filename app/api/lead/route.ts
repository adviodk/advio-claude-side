import { NextResponse } from "next/server";

type LeadPayload = {
  type: "kontaktformular" | "spørgeskema";
  navn?: string;
  kontakt?: string;
  firma?: string;
  telefon?: string;
  email?: string;
};

const TITLES: Record<LeadPayload["type"], string> = {
  kontaktformular: "NYT LEAD (KONTAKTFORMULAR)",
  "spørgeskema": "NYT LEAD (SPØRGESKEMA)",
};

function buildMessage(payload: LeadPayload): string {
  const lines = [`🚨 ${TITLES[payload.type]}`];

  if (payload.type === "spørgeskema") {
    if (payload.firma) lines.push(`Firma: ${payload.firma}`);
    const kontakt = [payload.telefon, payload.email].filter(Boolean).join(" / ");
    if (kontakt) lines.push(`Kontakt: ${kontakt}`);
  } else {
    if (payload.navn) lines.push(`Navn: ${payload.navn}`);
    const kontakt = payload.kontakt || payload.telefon;
    if (kontakt) lines.push(`Kontakt: ${kontakt}`);
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: "Telegram not configured" }, { status: 500 });
  }

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.type || !(payload.type in TITLES)) {
    return NextResponse.json({ ok: false, error: "Invalid lead type" }, { status: 400 });
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(payload),
        // Loud, attention-grabbing delivery — leads should never be silent.
        disable_notification: false,
      }),
    });

    if (!telegramRes.ok) {
      const detail = await telegramRes.text();
      return NextResponse.json({ ok: false, error: detail }, { status: 502 });
    }

    const sent = await telegramRes.json();
    const messageId = sent?.result?.message_id;

    // Pin the lead so it stays at the top of the chat and can't be missed
    // or scrolled past — this also fires its own notification.
    if (messageId) {
      await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          disable_notification: false,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 502 },
    );
  }
}
