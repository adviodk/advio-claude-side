declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta Pixel event, but only once per event name per browser
 * session (sessionStorage-guarded) so re-renders or repeated calls can't
 * double-report the same conversion. No-ops silently if the Pixel script
 * hasn't loaded (no consent yet) or if storage is unavailable.
 */
export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  const guardKey = `meta_evt_${name}`;
  try {
    if (window.sessionStorage.getItem(guardKey)) return;
    window.sessionStorage.setItem(guardKey, "1");
  } catch {
    // sessionStorage unavailable (e.g. private mode) — fire without the guard
  }

  try {
    window.fbq("track", name, params);
  } catch {
    // never let a tracking failure break the calling form/booking flow
  }
}
