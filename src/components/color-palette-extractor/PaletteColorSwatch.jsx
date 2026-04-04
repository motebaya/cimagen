import { Check, Copy } from "lucide-react";

export default function PaletteColorSwatch({
  color,
  copied,
  active,
  onCopy,
  onSelect,
  showPercentages,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="w-full min-w-0 rounded-xl border overflow-hidden text-left transition-colors"
      style={{
        borderColor: active
          ? "var(--color-primary-600)"
          : "var(--border-color)",
        backgroundColor: active ? "rgba(92, 124, 250, 0.06)" : "var(--card-bg)",
        boxShadow: active ? "0 0 0 1px rgba(92,124,250,0.12)" : "none",
      }}
    >
      <div className="h-12" style={{ backgroundColor: color.hex }} />
      <div className="p-2.5 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="text-xs font-semibold m-0 truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {color.hex}
            </p>
            <p
              className="text-[11px] m-0 mt-1 truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              RGB {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
            </p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCopy();
            }}
            className="w-7 h-7 rounded-md flex items-center justify-center border-none cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <p
          className="text-[11px] m-0 truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          HSL {color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%
        </p>
        {showPercentages && (
          <p
            className="text-[11px] m-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            {color.percentage.toFixed(1)}% coverage
          </p>
        )}
      </div>
    </div>
  );
}
