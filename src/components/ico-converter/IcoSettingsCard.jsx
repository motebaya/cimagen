export default function IcoSettingsCard({
  availableSizes,
  selectedSizes,
  toggleSize,
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
        className="space-y-3 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Output Sizes
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
              style={{
                backgroundColor: selectedSizes.includes(size)
                  ? "var(--color-primary-600)"
                  : "var(--bg-tertiary)",
                color: selectedSizes.includes(size)
                  ? "#fff"
                  : "var(--text-primary)",
              }}
            >
              {size}×{size}
            </button>
          ))}
        </div>
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {selectedSizes.length} size{selectedSizes.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      </div>
    </div>
  );
}
