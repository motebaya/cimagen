export default function LineArtQuickModes({
  activeQuickMode,
  quickModes,
  onApplyQuickMode,
}) {
  return (
    <div className="space-y-3">
      <div>
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Quick Modes
        </p>
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Start from a styled preset, then fine-tune individual controls if
          needed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {quickModes.map((mode) => {
          const isActive = activeQuickMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onApplyQuickMode(mode.id)}
              className="w-full rounded-lg border px-3 py-3 text-left transition-colors"
              style={{
                borderColor: isActive
                  ? "var(--color-primary-600)"
                  : "var(--border-color)",
                backgroundColor: isActive
                  ? "rgba(92, 124, 250, 0.08)"
                  : "var(--bg-tertiary)",
                boxShadow: isActive
                  ? "0 0 0 1px rgba(92,124,250,0.15)"
                  : "none",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {mode.label}
                </span>
                {isActive && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: "var(--color-primary-600)",
                      color: "#fff",
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
              <p
                className="text-xs mt-1 m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
