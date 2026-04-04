export default function BeforeAfterComparisonSlider({ position }) {
  return (
    <div
      className="absolute inset-y-0 pointer-events-none"
      style={{ left: `${position}%`, transform: "translateX(-50%)" }}
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/85 shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center text-xs font-semibold"
        style={{
          borderColor: "rgba(255,255,255,0.88)",
          backgroundColor: "rgba(15,23,42,0.78)",
          color: "#ffffff",
        }}
      >
        ||
      </div>
    </div>
  );
}
