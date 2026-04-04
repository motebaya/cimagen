export default function ThumbnailColorPaletteSection({
  bgColor,
  onBackgroundChange,
  presetColors,
}) {
  return (
    <div className="space-y-3">
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        Color Palette
      </label>
      <div className="grid grid-cols-7 gap-2">
        {presetColors.map((preset) => (
          <button
            key={preset.color}
            type="button"
            onClick={() => onBackgroundChange(preset.color)}
            className="w-full aspect-square rounded-lg border-2 transition-all cursor-pointer"
            style={{
              backgroundColor: preset.color,
              borderColor:
                bgColor === preset.color
                  ? "var(--color-primary-500)"
                  : "var(--border-color)",
              transform: bgColor === preset.color ? "scale(1.08)" : "scale(1)",
            }}
            title={preset.label}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={bgColor}
          onChange={(event) => onBackgroundChange(event.target.value)}
          className="w-11 h-11 rounded-lg cursor-pointer border-0 p-0"
          style={{ backgroundColor: "transparent" }}
        />
        <input
          type="text"
          value={bgColor}
          onChange={(event) => {
            const value = event.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(value)) {
              onBackgroundChange(value);
            }
          }}
          className="w-32 px-3 py-2 rounded-lg border text-sm font-mono transition-colors focus:outline-none"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>
    </div>
  );
}
