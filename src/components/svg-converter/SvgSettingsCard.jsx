export default function SvgSettingsCard({
  colors,
  detail,
  height,
  mode,
  preserveAspectRatio,
  smoothing,
  width,
  onColorsChange,
  onDetailChange,
  onHeightChange,
  onModeChange,
  onPreserveAspectRatioChange,
  onSmoothingChange,
  onWidthChange,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
      </div>
      <div
        className="space-y-5 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["logo", "photo"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onModeChange(value)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer capitalize"
                style={{
                  backgroundColor:
                    mode === value
                      ? "var(--color-primary-600)"
                      : "var(--bg-tertiary)",
                  color: mode === value ? "#fff" : "var(--text-primary)",
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Colors: {colors}
          </label>
          <input
            type="range"
            min="2"
            max="32"
            value={colors}
            onChange={(e) => onColorsChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Smoothing: {smoothing}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={smoothing}
            onChange={(e) => onSmoothingChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Detail: {detail}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={detail}
            onChange={(e) => onDetailChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={preserveAspectRatio}
            onChange={(e) => onPreserveAspectRatioChange(e.target.checked)}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            Preserve aspect ratio
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
