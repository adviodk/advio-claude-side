import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#hero", label: "Forside" },
  { href: "#cases", label: "Cases" },
  { href: "#faq", label: "FAQ" },
  { href: "#process", label: "Proces" },
  { href: "#kontakt", label: "Kontakt" },
  { href: "#features", label: "Fordele" },
];

export default function Footer() {
  return (
    <footer className="border-t border-navyDeep bg-navy-fade text-white">
      <div className="h-1.5 bg-beige" />
      <div className="mx-auto max-w-page px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/ADVIOLOGONYT.png"
              alt="Advio logo"
              width={84}
              height={28}
              className="h-7 w-auto"
            />
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="space-y-1.5 text-sm text-white/70">
            <p>
              <a href="mailto:simon@advio.dk" className="hover:text-white">
                simon@advio.dk
              </a>
            </p>
            <p>
              <a href="tel:+4522494295" className="hover:text-white">
                22 49 42 95
              </a>
            </p>
            <p>Alhambravej 11 st., 1826 Frederiksberg</p>
            <p>CVR: 46287088</p>
            <p>
              <Link href="/privatlivspolitik" className="hover:text-white">
                Privatlivspolitik
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
