import { proxyToAutomation } from "@/lib/automationProxy";

export async function GET() {
  return proxyToAutomation("/api/availability");
}
