import { proxyToAutomation } from "@/lib/automationProxy";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";
import { isValidLeadOrBookBody, badRequest, MAX_BODY_BYTES } from "@/lib/validateJsonBody";

export async function POST(request: Request) {
  if (isRateLimited(`book:${getClientIp(request)}`, 5, 10 * 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return badRequest("Body too large", 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return badRequest("Invalid JSON");
  }
  if (
    !isValidLeadOrBookBody(parsed) ||
    !parsed.slot ||
    !parsed.navn ||
    !parsed.email
  ) {
    return badRequest("Invalid body");
  }

  return proxyToAutomation("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
