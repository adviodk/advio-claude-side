import { serif } from "./fonts";

export const services = [
  {
    title: "Skræddersyet webdesign",
    text: "Et design bygget fra bunden til din virksomhed – roligt, tidløst og med plads til det, der gør dig særlig. Ingen skabeloner.",
  },
  {
    title: "Udvikling til alle skærme",
    text: "Hurtig, sikker og gennemført på mobil, tablet og computer. Teknisk klar til Google fra første dag.",
  },
  {
    title: "Tekster, der sælger",
    text: "Vi skriver teksterne til dine kunder i et klart og troværdigt sprog, der får dem til at tage kontakt.",
  },
  {
    title: "Booking og henvendelser",
    text: "Lad kunder booke møder og konsultationer direkte på siden – eller skrive til dig med det samme.",
  },
  {
    title: "Sprog og integrationer",
    text: "Dansk og engelsk, CRM, betaling eller nyhedsbrev. Vi kobler siden sammen med de værktøjer, du allerede bruger.",
  },
  {
    title: "Drift og opdateringer",
    text: "Ønsker du det, holder vi hjemmesiden opdateret og kørende til en fast månedlig pris – så du kan passe dine kunder.",
  },
];

/** Ydelser — what a project with Advio includes, as six quiet cards. */
export default function Services() {
  return (
    <section id="ydelser" className="scroll-mt-4 px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className={`${serif.className} text-[2.9rem] font-normal leading-[1] tracking-[-0.01em] sm:text-7xl`}>
            Det, vi <em className="italic">leverer</em>
          </h2>
          <p className="mt-6 text-balance text-[16px] leading-relaxed text-[var(--muted)] sm:text-[18px]">
            Alt, hvad der skal til for en hjemmeside, der matcher kvaliteten af dit arbejde – samlet ét sted.
          </p>
        </div>

        <ul className="mt-16 grid gap-3 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.title} className="rounded-[3px] bg-white/60 p-7 sm:p-8">
              <h3 className={`${serif.className} text-[1.75rem] leading-[1.1] tracking-[-0.005em]`}>{s.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
