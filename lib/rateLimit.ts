/**
 * Simple in-memory, per-IP rate limiter for the three lead-capturing proxy
 * routes. This runs in Advio side (not Automation) specifically because
 * it's the layer that still sees the real visitor IP — once a request
 * crosses the server-to-server proxy hop to Automation, only Vercel's own
 * outbound IP is visible there.
 *
 * Being in-memory means it resets whenever a serverless instance recycles,
 * and only limits within a single warm instance rather than globally across
 * all of Vercel's edge — it will not stop a large distributed attack. What
 * it does stop, cheaply and without any extra infrastructure (database,
 * KV store, paid firewall), is the realistic case this was asked for: a
 * single browser/script spam-clicking a button or hammering an endpoint.
 * If stronger, globally-consistent protection is ever needed, Vercel's WAF
 * rate limiting or an Upstash/Vercel KV-backed limiter would be the next
 * step — deliberately not added now to keep this proportionate.
 */

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the map doesn't grow unbounded over a long-lived
// instance — runs every so often rather than on a timer.
let requestsSinceSweep = 0;

function sweep(maxAgeMs: number) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > maxAgeMs) buckets.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Returns true if `key` has exceeded `limit` requests within `windowMs`.
 * Call once per incoming request, before doing any real work.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  requestsSinceSweep++;
  if (requestsSinceSweep > 200) {
    requestsSinceSweep = 0;
    sweep(windowMs);
  }

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count++;
  return bucket.count > limit;
}

export function rateLimitResponse() {
  return new Response(
    JSON.stringify({ ok: false, error: "For mange forsøg. Vent lidt og prøv igen." }),
    { status: 429, headers: { "Content-Type": "application/json" } },
  );
}
