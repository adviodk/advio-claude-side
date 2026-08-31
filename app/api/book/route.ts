import { proxyToAutomation } from "@/lib/automationProxy";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (isRateLimited(`book:${getClientIp(request)}`, 5, 10 * 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.text();
  return proxyToAutomation("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
