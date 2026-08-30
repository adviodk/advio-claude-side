import SectionHeading from "./SectionHeading";
import ProcessSteps from "./ProcessSteps";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-navy-fade">
      <div className="mx-auto max-w-page px-6 pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="Sådan fungerer det"
          lead="Sådan kommer du"
          accent="i gang"
          size="large"
        />
      </div>

      <ProcessSteps />
    </section>
  );
}
