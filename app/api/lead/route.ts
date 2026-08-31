import { proxyToAutomation } from "@/lib/automationProxy";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (isRateLimited(`lead:${getClientIp(request)}`, 10, 5 * 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.text();
  return proxyToAutomation("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
