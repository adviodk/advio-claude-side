import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google";

const STATE_COOKIE = "google_oauth_state";

function htmlPage(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Google-autorisation</title>
    <style>
      body{font-family:system-ui,sans-serif;background:#1c2020;color:#f7f6f2;padding:40px;line-height:1.6}
      code{display:block;background:#000;color:#e1e2d1;padding:16px;border-radius:6px;word-break:break-all;margin:12px 0;font-size:14px}
      h1{font-size:20px}
    </style></head><body>${body}</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

// Always clear the one-time state cookie on the way out, whatever the
// outcome, so a stale cookie can never be replayed against a later attempt.
function withClearedStateCookie(response: NextResponse) {
  response.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/api/auth/google",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  // Requires a valid, matching state — closes the OAuth CSRF gap and also
  // means this callback can't be driven by anyone who didn't go through
  // the key-gated /api/auth/google entry point first.
  if (!storedState || !state || state !== storedState) {
    return withClearedStateCookie(
      htmlPage(
        `<h1>Ugyldig eller udløbet forespørgsel</h1><p>Start forfra fra <code>/api/auth/google?key=...</code>.</p>`,
      ),
    );
  }

  if (error) {
    return withClearedStateCookie(
      htmlPage(`<h1>Adgang blev afvist</h1><p>Google-fejl: ${error}</p>`),
    );
  }

  if (!code) {
    return withClearedStateCookie(
      htmlPage(`<h1>Manglende kode</h1><p>Ingen "code"-parameter i URL'en.</p>`),
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      return withClearedStateCookie(
        htmlPage(`
        <h1>Ingen refresh token modtaget</h1>
        <p>Google har sandsynligvis allerede givet en refresh token tidligere.
        Fjern Advio Booking under <a href="https://myaccount.google.com/permissions" style="color:#e1e2d1">
        Google-kontoens tilladelser</a> og prøv igen.</p>
      `),
      );
    }

    return withClearedStateCookie(
      htmlPage(`
      <h1>✅ Autorisation gennemført</h1>
      <p>Kopiér denne værdi og læg den i <code>GOOGLE_REFRESH_TOKEN</code> (lokalt i .env.local og i Vercel):</p>
      <code>${tokens.refresh_token}</code>
      <p>Del den ikke med nogen — den giver adgang til din kalender.
      Du kan lukke denne side, når du har kopieret værdien.</p>
    `),
    );
  } catch (err) {
    return withClearedStateCookie(
      htmlPage(
        `<h1>Fejl under token-udveksling</h1><p>${err instanceof Error ? err.message : "Ukendt fejl"}</p>`,
      ),
    );
  }
}
