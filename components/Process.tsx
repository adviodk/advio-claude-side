const steps = [
  {
    n: "01",
    title: "Udfyld skema",
    body: "Tag 2 minutter på de korte trin.",
  },
  {
    n: "02",
    title: "Godkend dit udkast",
    body: "Vi sender et færdigt udkast til gennemsyn.",
  },
  {
    n: "03",
    title: "Gå live på 2 dage",
    body: "Din nye side er klar til kunderne.",
  },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-t border-border bg-white">
      <div className="mx-auto max-w-page px-6 py-24">
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-yellow" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Sådan kommer du i gang
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="inline-flex h-8 w-8 items-center justify-center border border-ink bg-yellow font-display text-sm font-bold text-ink">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-black text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
