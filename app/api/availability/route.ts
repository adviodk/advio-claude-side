import { proxyToAutomation } from "@/lib/automationProxy";
import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

export async function GET(request: Request) {
  if (isRateLimited(`availability:${getClientIp(request)}`, 20, 60_000)) {
    return rateLimitResponse();
  }

  return proxyToAutomation("/api/availability");
}
