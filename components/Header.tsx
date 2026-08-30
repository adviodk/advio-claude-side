import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "./Button";

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
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-navyDeep/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5 lg:px-10">
        <Link href="#hero" className="flex items-center">
          <Image
            src="/assets/ADVIOLOGONYT.png"
            alt="Advio logo"
            width={96}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <ButtonLink href="/formular" className="px-5 py-2.5 text-[11px]">
          Få et tilbud
        </ButtonLink>
      </div>
    </header>
  );
}
