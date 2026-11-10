declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Meta's standard events go through fbq("track"); anything else (e.g. our
// own CTAClick) must use fbq("trackCustom"), or Meta flags it as an error.
const STANDARD_EVENTS = new Set([
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "InitiateCheckout",
  "Lead",
  "PageView",
  "Purchase",
  "Schedule",
  "Search",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
  "ViewContent",
]);

/**
 * Internal-traffic opt-out: set localStorage "meta_tracking_disabled" to
 * "true" in your own browser and the pixel is never loaded and no events are
 * sent from it. Per-browser only, so other visitors are unaffected.
 */
export const META_TRACKING_DISABLED_KEY = "meta_tracking_disabled";

export function isMetaTrackingDisabled() {
  try {
    return window.localStorage.getItem(META_TRACKING_DISABLED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Fires a Meta Pixel event, but only once per event per browser session
 * (sessionStorage-guarded) so re-renders or repeated calls can't
 * double-report the same conversion. Events with a `location` param (CTA
 * clicks) are counted once per location, so a click in the nav and a later
 * click in the footer are both reported. No-ops silently if the Pixel
 * script hasn't loaded (no consent yet) or if storage is unavailable.
 */
export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (isMetaTrackingDisabled()) return;

  const location = typeof params?.location === "string" ? `_${params.location}` : "";
  const guardKey = `meta_evt_${name}${location}`;
  try {
    if (window.sessionStorage.getItem(guardKey)) return;
    window.sessionStorage.setItem(guardKey, "1");
  } catch {
    // sessionStorage unavailable (e.g. private mode) — fire without the guard
  }

  try {
    window.fbq(STANDARD_EVENTS.has(name) ? "track" : "trackCustom", name, params);
  } catch {
    // never let a tracking failure break the calling form/booking flow
  }
}
