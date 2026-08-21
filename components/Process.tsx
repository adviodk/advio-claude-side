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
      <div className="mx-auto max-w-page px-6 py-24">
        <Reveal>
          <h2 className="font-display text-4xl font-black text-white sm:text-5xl">
            Sådan kommer du i gang
          </h2>
        </Reveal>

        <div className="mt-16 max-w-2xl">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div>
                <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="font-display text-sm text-steel">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-white/60">{step.body}</p>
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
