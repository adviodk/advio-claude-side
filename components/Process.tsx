import Reveal from "./Reveal";

const steps = [
  {
    title: "Udfyld skema",
    body: "Tag 2 minutter på de korte trin.",
  },
  {
    title: "Godkend dit udkast",
    body: "Vi sender et færdigt udkast til gennemsyn.",
  },
  {
    title: "Gå live på 2 dage",
    body: "Din nye side er klar til kunderne.",
  },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-navyDeep">
      <div className="mx-auto max-w-page px-6 py-16">
        <Reveal>
          <h2 className="leading-[1.02] tracking-tight">
            <span className="font-sans text-3xl font-black uppercase text-white sm:text-4xl">
              Sådan kommer du
            </span>{" "}
            <span className="font-display text-3xl font-medium italic text-beige sm:text-4xl">
              i gang
            </span>
          </h2>
        </Reveal>

        <div className="mt-8 max-w-2xl">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="font-display text-sm font-medium text-steel">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">{step.body}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <span className="block h-px w-10 bg-white/20" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
