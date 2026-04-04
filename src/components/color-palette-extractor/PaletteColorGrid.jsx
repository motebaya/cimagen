import PaletteColorSwatch from "./PaletteColorSwatch.jsx";

export default function PaletteColorGrid({
  copiedColorId,
  palette,
  selectedColorId,
  onCopyColor,
  onSelectColor,
  showPercentages,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
      {palette.map((color) => (
        <PaletteColorSwatch
          key={color.id}
          color={color}
          copied={copiedColorId === color.id}
          active={selectedColorId === color.id}
          onCopy={() => onCopyColor(color.hex, color.id)}
          onSelect={() => onSelectColor(color.id)}
          showPercentages={showPercentages}
        />
      ))}
    </div>
  );
}
