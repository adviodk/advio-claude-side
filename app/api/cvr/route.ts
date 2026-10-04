import { getClientIp, isRateLimited, rateLimitResponse } from "@/lib/rateLimit";

/**
 * Same-origin proxy to DanskCVRAPI's autocomplete endpoint. The API key is
 * server-only (never sent to the browser); the client only ever talks to
 * this route. Company-name search is an assist on top of a plain text
 * field, never a requirement — any failure here (missing key, upstream
 * down, quota exceeded) returns an empty suggestion list rather than an
 * error, so the form itself is never blocked by this third party.
 */

const CVR_API_URL = "https://api.danskcvrapi.dk/v1/companies/autocomplete";
const MIN_QUERY_LENGTH = 2;

type RawSuggestion = Record<string, unknown>;

function pickString(obj: RawSuggestion, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function normalize(raw: RawSuggestion) {
  return {
    name: pickString(raw, ["name", "navn"]) ?? "",
    cvr: pickString(raw, ["cvr", "cvr_number", "cvrNumber", "vat", "vat_number"]),
    city: pickString(raw, ["city", "by"]),
    industry: pickString(raw, ["industry", "branche"]),
  };
}

export async function GET(request: Request) {
  if (isRateLimited(`cvr:${getClientIp(request)}`, 30, 60_000)) {
    return rateLimitResponse();
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < MIN_QUERY_LENGTH) {
    return Response.json({ ok: true, results: [] });
  }

  const apiKey = process.env.DANSK_CVR_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: true, results: [] });
  }

  try {
    const url = `${CVR_API_URL}?q=${encodeURIComponent(q)}&limit=5`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return Response.json({ ok: true, results: [] });
    }

    const data = await res.json();
    const rawResults: RawSuggestion[] = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];
    const results = rawResults.map(normalize).filter((r) => r.name);

    return Response.json({ ok: true, results });
  } catch {
    return Response.json({ ok: true, results: [] });
  }
}
