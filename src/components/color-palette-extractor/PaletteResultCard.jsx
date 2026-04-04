import PaletteColorGrid from "./PaletteColorGrid.jsx";

export default function PaletteResultCard({
  copiedColorId,
  palette,
  selectedColorId,
  onCopyColor,
  onSelectColor,
  showPercentages,
}) {
  return (
    <div
      className="px-4 py-4 space-y-3"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <div>
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Extracted Palette
        </p>
        <p
          className="text-xs mt-1 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Click any swatch to highlight where that color appears in the source
          image.
        </p>
      </div>

      <PaletteColorGrid
        copiedColorId={copiedColorId}
        palette={palette}
        selectedColorId={selectedColorId}
        onCopyColor={onCopyColor}
        onSelectColor={onSelectColor}
        showPercentages={showPercentages}
      />
    </div>
  );
}
