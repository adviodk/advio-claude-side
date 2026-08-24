import CallbackModal from "./CallbackModal";

export default function CallbackBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navyDeep/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-6 py-3">
        <p className="text-sm font-medium text-white">
          Skal vi ringe dig op?
        </p>
        <CallbackModal
          label="Ring til os"
          className="inline-flex shrink-0 items-center gap-2 rounded-none bg-beige px-5 py-2.5 text-sm font-semibold text-navyDeep transition-colors hover:bg-beigeDeep"
        />
      </div>
    </div>
  );
}
