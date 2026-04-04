export default function PixelQuickControls({
  colorCountOptions,
  outputScaleOptions,
  pixelSizeOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Pixel Size
        </label>
        <div className="grid grid-cols-5 gap-2">
          {pixelSizeOptions.map((value) => {
            const isSelected = settings.pixelSize === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdateSetting("pixelSize", value)}
                className="px-0 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                style={{
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Color Count
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colorCountOptions.map((value) => {
            const isSelected = settings.colorCount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdateSetting("colorCount", value)}
                className="px-0 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                style={{
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Output Scale
        </label>
        <div className="grid grid-cols-5 gap-2">
          {outputScaleOptions.map((option) => {
            const isSelected = settings.outputScale === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdateSetting("outputScale", option.value)}
                className="px-0 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                style={{
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
