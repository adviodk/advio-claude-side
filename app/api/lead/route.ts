import { proxyToAutomation } from "@/lib/automationProxy";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";
import { isValidLeadOrBookBody, badRequest, MAX_BODY_BYTES } from "@/lib/validateJsonBody";

export async function POST(request: Request) {
  if (isRateLimited(`lead:${getClientIp(request)}`, 10, 5 * 60_000)) {
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
  if (!isValidLeadOrBookBody(parsed) || typeof parsed.type !== "string") {
    return badRequest("Invalid body");
  }

  return proxyToAutomation("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
