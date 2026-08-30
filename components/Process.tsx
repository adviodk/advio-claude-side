import Reveal from "./Reveal";
import ProcessSteps from "./ProcessSteps";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 py-16">
        <Reveal>
          <h2 className="leading-[1.02] tracking-tight">
            <span className="font-sans text-3xl font-black uppercase text-white sm:text-4xl">
              Sådan kommer du
            </span>{" "}
            <span className="font-display text-3xl font-medium uppercase text-beige sm:text-4xl">
              i gang
            </span>
          </h2>
        </Reveal>

        <ProcessSteps />
      </div>
    </section>
  );
}
