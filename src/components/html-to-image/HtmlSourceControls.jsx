import { Globe, LayoutTemplate, RefreshCcw } from "lucide-react";

export default function HtmlSourceControls({
  loadSampleDisabled,
  markup,
  onLoadSample,
  onMarkupChange,
  onModeChange,
  onResetSample,
  onUrlChange,
  sourceMode,
  sourceModes,
  urlInput,
}) {
  const iconMap = {
    html: LayoutTemplate,
    url: Globe,
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {sourceModes.map((mode) => {
          const Icon = iconMap[mode.value] || LayoutTemplate;
          const isSelected = sourceMode === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onModeChange(mode.value)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
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
              <Icon size={16} />
              {mode.label}
            </button>
          );
        })}
      </div>

      {sourceMode === "html" ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              HTML Markup
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLoadSample}
                disabled={loadSampleDisabled}
                className="text-xs font-medium cursor-pointer border-none bg-transparent disabled:opacity-50"
                style={{ color: "var(--color-primary-600)" }}
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={onResetSample}
                className="flex items-center gap-1 text-xs font-medium cursor-pointer border-none bg-transparent"
                style={{ color: "var(--text-tertiary)" }}
              >
                <RefreshCcw size={12} />
                Reset
              </button>
            </div>
          </div>

          <textarea
            rows="16"
            value={markup}
            onChange={(event) => onMarkupChange(event.target.value)}
            className="w-full px-3 py-3 rounded-lg border outline-none resize-y"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              fontFamily: '"SFMono-Regular", Consolas, monospace',
            }}
          />
        </>
      ) : (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            URL to reconstruct
          </label>
          <input
            type="url"
            value={urlInput}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://your-site/page"
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
          <p
            className="text-xs mt-2 m-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            Static hosting can only reconstruct same-origin or CORS-enabled
            pages. For blocked sites, paste raw HTML instead.
          </p>
        </div>
      )}
    </div>
  );
}
