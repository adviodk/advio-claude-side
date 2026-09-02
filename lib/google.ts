import { google } from "googleapis";

// Narrowed to least privilege: calendar.events (create/read events) rather
// than full calendar management, and no Sheets scope — lib/sheets.ts (the
// only Sheets consumer) has been removed as dead code (superseded by the
// Advio Automation migration, see AGENTS.md history / git log). If Sheets
// access is ever needed again, re-add "https://www.googleapis.com/auth/spreadsheets"
// here and re-run the OAuth bootstrap flow for a new refresh token.
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth env vars are not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleAuthUrl(state: string) {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

/**
 * Returns an OAuth2 client authorized with the stored refresh token.
 * googleapis handles fetching/refreshing the short-lived access token
 * automatically on every call — no manual refresh logic needed.
 */
export function getAuthorizedClient() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not configured");
  }

  const client = getOAuth2Client();
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function getCalendarClient() {
  return google.calendar({ version: "v3", auth: getAuthorizedClient() });
}

export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
