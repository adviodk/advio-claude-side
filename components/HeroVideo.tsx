import BackgroundVideo from "./BackgroundVideo";

const DESKTOP_SRC = "/assets/hero-ocean.mp4";
const MOBILE_SRC = "/assets/hero-ocean-mobile.mp4";
const POSTER_SRC = "/assets/hero-ocean-poster.jpg";

export default function HeroVideo() {
  return (
    <BackgroundVideo
      desktopSrc={DESKTOP_SRC}
      mobileSrc={MOBILE_SRC}
      posterSrc={POSTER_SRC}
    />
  );
}
