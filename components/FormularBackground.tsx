import BackgroundVideo from "./BackgroundVideo";

/**
 * Light background for /formular and /formular/book: a slow camera move
 * through white architecture, with its still frame as the poster.
 */
export default function FormularBackground() {
  return (
    <div aria-hidden className="fixed inset-0 bg-[#e9e8e5]">
      <BackgroundVideo
        desktopSrc="/formular-bg/arkitektur.mp4"
        mobileSrc="/formular-bg/arkitektur-mobile.mp4"
        posterSrc="/formular-bg/arkitektur-poster.webp"
      />
      {/* Soft veil so the card and header always read cleanly */}
      <div className="absolute inset-0 bg-white/20" />
    </div>
  );
}
