import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getGoogleAuthUrl } from "@/lib/google";

// Visit this endpoint once to start the one-time Google authorization.
// It redirects to Google's consent screen; after approving access to
// Calendar, Google redirects back to /api/auth/google/callback which
// prints the refresh token to store as GOOGLE_REFRESH_TOKEN.
//
// Gated behind OAUTH_SETUP_KEY (?key=...) so this admin-only bootstrap
// tool isn't reachable by anyone who finds the URL — it mints OAuth
// credentials, so it needs the same access control any admin
// functionality would. Also sets a short-lived, httpOnly state cookie
// that the callback verifies, closing the missing CSRF-in-OAuth gap.
const STATE_COOKIE = "google_oauth_state";

export async function GET(request: NextRequest) {
  const setupKey = process.env.OAUTH_SETUP_KEY;
  const providedKey = request.nextUrl.searchParams.get("key");

  // Fail closed: if the key isn't configured at all, nobody gets in —
  // rather than accidentally leaving this open if the env var is unset.
  if (!setupKey || providedKey !== setupKey) {
    return new NextResponse("Not found", { status: 404 });
  }

  const state = randomBytes(24).toString("hex");
  const response = NextResponse.redirect(getGoogleAuthUrl(state));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes — this flow is a quick manual bootstrap step
    path: "/api/auth/google",
  });
  return response;
}
