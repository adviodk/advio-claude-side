/**
 * Thin server-to-server forwarder to Advio Automation. Used by the /api/lead,
 * /api/book and /api/availability route handlers so their URL, method and
 * JSON contract stay byte-for-byte identical for the browser — only the
 * implementation behind them changed (previously did the work inline, now
 * forwards to the Automation service). See AGENTS.md history / git log for
 * the pre-migration inline implementation if a rollback is ever needed.
 */
export async function proxyToAutomation(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.AUTOMATION_BASE_URL;
  const apiKey = process.env.AUTOMATION_API_KEY;

  if (!baseUrl || !apiKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "Automation is not configured" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      "x-automation-key": apiKey,
    },
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
