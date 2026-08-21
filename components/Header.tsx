import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "#hero", label: "Forside" },
  { href: "#cases", label: "Cases" },
  { href: "#process", label: "Proces" },
  { href: "#features", label: "Fordele" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4">
        <Link href="#hero" className="flex items-center gap-2">
          <Image
            src="/assets/advio-logo.png"
            alt="Advio logo"
            width={28}
            height={28}
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Advio
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/formular"
          className="inline-flex items-center gap-2 border border-ink bg-blue px-4 py-2.5 text-sm font-semibold text-white shadow-cardSoft transition-colors hover:bg-blueDeep"
        >
          Få et tilbud
        </Link>
      </div>
    </header>
  );
}
