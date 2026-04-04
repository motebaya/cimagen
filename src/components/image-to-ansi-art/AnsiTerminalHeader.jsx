import { Circle } from "lucide-react";

export default function AnsiTerminalHeader({
  hasImage,
  imageFilename,
  onOpenImagePicker,
  onPreviewModeChange,
  onRemoveImage,
  previewMode,
  previewModeOptions,
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 border-b"
      style={{
        borderColor: "rgba(148,163,184,0.18)",
        backgroundColor: "rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5">
          <Circle size={10} fill="#fb7185" stroke="#fb7185" />
          <Circle size={10} fill="#f59e0b" stroke="#f59e0b" />
          <Circle size={10} fill="#34d399" stroke="#34d399" />
        </div>
        <span
          className="text-xs truncate"
          style={{ color: "var(--text-tertiary)" }}
        >
          {hasImage ? imageFilename : "ansi-terminal-preview"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 rounded-full border px-1 py-1"
          style={{ borderColor: "var(--border-color)" }}
        >
          {Object.entries(previewModeOptions).map(([value, label]) => {
            const isSelected = previewMode === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onPreviewModeChange(value)}
                disabled={!hasImage}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "transparent",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {hasImage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenImagePicker}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
              }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
