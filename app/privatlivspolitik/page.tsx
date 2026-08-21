import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privatlivspolitik — Advio",
};

export default function PrivatlivspolitikPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <span aria-hidden>←</span>
            Tilbage til forsiden
          </Link>
          <Image src="/assets/advio-logo.png" alt="Advio" width={26} height={26} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Privatlivspolitik
        </h1>
        <p className="mt-3 text-sm text-muted">Senest opdateret: august 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">Dataansvarlig</h2>
            <p className="mt-3">
              Advio
              <br />
              Alhambravej 11 st., 1826 Frederiksberg
              <br />
              CVR: 46287088
              <br />
              E-mail:{" "}
              <a href="mailto:simon@advio.dk" className="font-medium text-navy">
                simon@advio.dk
              </a>
              <br />
              Telefon:{" "}
              <a href="tel:+4522494295" className="font-medium text-navy">
                22 49 42 95
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              Hvilke oplysninger indsamler vi?
            </h2>
            <p className="mt-3">
              Når du udfylder kontaktformularen på advio.dk, indsamler vi de
              oplysninger du selv angiver: firmanavn, branche, telefonnummer
              og/eller e-mail, om I har en hjemmeside eller Facebook-side i
              forvejen, eventuelle billeder du uploader af udført arbejde, og
              hvilke elementer I ønsker på jeres hjemmeside. Vi bruger kun
              disse oplysninger til at udarbejde et skræddersyet udkast til
              jer og til at komme i kontakt med jer om det.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              Hvem deler vi oplysninger med?
            </h2>
            <p className="mt-3">Vi bruger følgende databehandlere/tjenester:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-ink">FormSubmit.co</span> —
                modtager indholdet af kontaktformularen og videresender det som
                e-mail til simon@advio.dk.
              </li>
              <li>
                <span className="font-medium text-ink">Calendly</span> — hvis du
                booker et møde, håndteres bookingen af Calendly.
              </li>
              <li>
                <span className="font-medium text-ink">Google Analytics</span> —
                indsamler anonymiseret statistik om besøg på siden, men kun hvis
                du har givet samtykke til statistik-cookies.
              </li>
              <li>
                <span className="font-medium text-ink">Vercel</span> — hoster
                selve hjemmesiden.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">Cookies</h2>
            <p className="mt-3">
              Vi bruger kun cookies til statistik (Google Analytics), og kun
              hvis du aktivt har accepteret det i cookie-banneret. Cookies fra
              Google Analytics indsamler oplysninger om hvordan du bruger
              siden, fx hvilke sider du besøger og hvor du kommer fra. Du kan
              til enhver tid trække dit samtykke tilbage ved at slette cookies
              i din browser og genindlæse siden, hvorefter banneret vises
              igen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              Opbevaring og sletning
            </h2>
            <p className="mt-3">
              Vi opbevarer kun de oplysninger du sender via kontaktformularen
              så længe det er nødvendigt for at kunne følge op på din
              henvendelse. Ønsker du dine oplysninger slettet, kan du til
              enhver tid kontakte os på simon@advio.dk.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              Dine rettigheder
            </h2>
            <p className="mt-3">
              Du har efter databeskyttelsesforordningen (GDPR) ret til indsigt
              i, berigtigelse af og sletning af dine oplysninger, samt ret til
              at gøre indsigelse mod vores behandling. Kontakt os på
              simon@advio.dk, hvis du ønsker at gøre brug af dine rettigheder.
              Du kan også klage til Datatilsynet, se{" "}
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-navy"
              >
                datatilsynet.dk
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
