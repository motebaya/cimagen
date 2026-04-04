import { ChevronDown } from "lucide-react";
import PixelPaletteSwatches from "./PixelPaletteSwatches.jsx";

export default function PixelPaletteCard({
  isExpanded,
  palette,
  paletteName,
  toggleExpanded,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
        }}
      >
        <span>
          <span className="block text-sm font-medium">Active Palette</span>
          <span
            className="block text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {paletteName} · {palette.length} colors
          </span>
        </span>
        <ChevronDown
          size={16}
          className="transition-transform"
          style={{
            color: "var(--text-tertiary)",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isExpanded && (
        <div className="px-4 py-4">
          <PixelPaletteSwatches palette={palette} />
        </div>
      )}
    </div>
  );
}
