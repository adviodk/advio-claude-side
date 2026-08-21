import BeforeAfterSlider from "./BeforeAfterSlider";

export default function PhoneShowcase() {
  return (
    <div className="flex justify-center">
      <div className="relative w-[240px] rounded-[2.8rem] bg-gradient-to-b from-[#e2e5ec] via-[#aab0c2] to-[#7d8399] p-[3px] shadow-[10px_10px_0_rgba(35,38,46,0.12)] sm:w-[260px]">
        <div className="rounded-[2.7rem] bg-charcoalDeep p-[10px]">
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-[#8a90a3]" />
          <div className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-[#8a90a3]" />
          <div className="absolute -right-[3px] top-28 h-16 w-[3px] rounded-r bg-[#8a90a3]" />

          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-charcoalDeep" />
            <BeforeAfterSlider
              before="/assets/case-vni-before.webp"
              after="/assets/case-vni-after.webp"
              beforeAlt="VN Isolering før"
              afterAlt="VN Isolering efter"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
