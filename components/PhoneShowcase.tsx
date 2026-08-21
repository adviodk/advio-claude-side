import BeforeAfterSlider from "./BeforeAfterSlider";

export default function PhoneShowcase() {
  return (
    <div className="flex justify-center">
      <div className="relative w-[230px] rounded-[2.2rem] border-[6px] border-charcoalDeep bg-charcoalDeep p-2 shadow-[10px_10px_0_rgba(35,38,46,0.15)] sm:w-[260px]">
        <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-charcoalDeep" />
        <div className="overflow-hidden rounded-[1.6rem] border border-charcoal">
          <BeforeAfterSlider
            before="/assets/case-vni-before.webp"
            after="/assets/case-vni-after.webp"
            beforeAlt="VN Isolering før"
            afterAlt="VN Isolering efter"
          />
        </div>
        <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-beige">
          VN Isolering — før &amp; efter
        </p>
      </div>
    </div>
  );
}
