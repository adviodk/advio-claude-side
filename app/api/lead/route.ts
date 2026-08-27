import { proxyToAutomation } from "@/lib/automationProxy";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyToAutomation("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
