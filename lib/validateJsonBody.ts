/**
 * Minimal shape guard for the /api/lead and /api/book request bodies,
 * before they're relayed on to Advio Automation. This intentionally does
 * NOT try to be the full schema/authorization boundary — Automation (a
 * separate service, out of this repo's control) remains responsible for
 * deciding what's actually valid lead/booking data. This layer only
 * rejects structurally malformed or oversized junk (wrong JSON shape,
 * non-string values, absurdly long fields) before it leaves this app, as
 * a cheap extra layer independent of whatever Automation itself checks.
 */

const MAX_FIELD_LENGTH = 2000;
export const MAX_BODY_BYTES = 20_000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Every present value must be a short string. Doesn't enforce which
 * fields are required — see module doc above. */
export function isValidLeadOrBookBody(data: unknown): data is Record<string, string> {
  if (!isPlainObject(data)) return false;
  for (const value of Object.values(data)) {
    if (typeof value !== "string") return false;
    if (value.length > MAX_FIELD_LENGTH) return false;
  }
  return true;
}

export function badRequest(error: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
