export type CaseItem = {
  name: string;
  trade: string;
  place: string;
  url: string;
  domain: string;
  shot: string;
  /** Registered address (CVR / the customer's own site) — used for the map. */
  city: string;
  lon: number;
  lat: number;
};

// Trade and area are taken from each customer's own site; city from CVR
// (Erik Larsen, Proelectric) or the site's footer (V&N, JK).
export const cases: CaseItem[] = [
  {
    name: "Erik Larsen & Co.",
    trade: "Aut. VVS og kloak",
    place: "København",
    url: "https://www.eriklarsen.dk",
    domain: "eriklarsen.dk",
    shot: "/redesign/cases/eriklarsen.webp",
    city: "København N",
    lon: 12.545,
    lat: 55.697,
  },
  {
    name: "V&N Isolering",
    trade: "Facadepuds og isolering",
    place: "Jylland",
    url: "https://vnisolering.dk",
    domain: "vnisolering.dk",
    shot: "/redesign/cases/vnisolering.webp",
    city: "Ikast",
    lon: 9.157,
    lat: 56.138,
  },
  {
    name: "JK Dræn & Kloakspuling",
    trade: "Dræn og kloakspuling",
    place: "Sydsjælland & Møn",
    url: "https://jk-kloak.nu",
    domain: "jk-kloak.nu",
    shot: "/redesign/cases/jk-kloak.webp",
    city: "Askeby, Møn",
    lon: 12.212,
    lat: 54.926,
  },
  {
    name: "Proelectric",
    trade: "Autoriseret elinstallatør",
    place: "København",
    url: "https://proelectric.dk",
    domain: "proelectric.dk",
    shot: "/redesign/cases/proelectric.webp",
    city: "Valby",
    lon: 12.509,
    lat: 55.663,
  },
];
