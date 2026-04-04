export default function PixelPaletteSwatches({ palette }) {
  return (
    <div className="flex flex-wrap gap-2">
      {palette.map((color) => (
        <div
          key={color}
          className="rounded-lg border px-2 py-2 text-xs font-medium"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <div
            className="w-10 h-6 rounded mb-2"
            style={{ backgroundColor: color }}
          />
          {color}
        </div>
      ))}
    </div>
  );
}
