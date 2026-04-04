import { Download, Loader2 } from "lucide-react";

export default function UpscalerResultDetailsCard({
  exportFormats,
  exportingFormats,
  hasImage,
  onExport,
  resultSummary,
  selectedModel,
  upscaleScale,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
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
          Result Details
        </h2>
        <p
          className="text-xs mt-1 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Export the latest processed result using the selected upscale method
          and scale.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {resultSummary.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border px-3 py-3"
            style={{ borderColor: "var(--border-color)" }}
          >
            <p
              className="text-xs m-0 mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              {label}
            </p>
            <p
              className="text-sm font-semibold m-0 break-all"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg border px-3 py-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p
            className="text-xs m-0 mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Selected model
          </p>
          <p
            className="text-sm font-semibold m-0"
            style={{ color: "var(--text-primary)" }}
          >
            {selectedModel?.label || "-"}
          </p>
        </div>
        <div
          className="rounded-lg border px-3 py-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p
            className="text-xs m-0 mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Scale factor
          </p>
          <p
            className="text-sm font-semibold m-0"
            style={{ color: "var(--text-primary)" }}
          >
            {upscaleScale}x
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={!hasImage || exportingFormats?.[format]}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {exportingFormats?.[format] ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
