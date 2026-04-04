import { AlertTriangle, Download } from "lucide-react";

export default function HtmlExportCard({
  assetIssueNotice,
  capturedCanvas,
  exportFormats,
  metadata,
  onExport,
}) {
  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Export Image
        </h2>
        <p
          className="text-xs mt-1 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Download the currently rendered capture using the active viewport,
          scale, and presentation settings.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metadata.map(([label, value]) => (
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

      {assetIssueNotice && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-3 text-xs"
          style={{
            borderColor: "rgba(180, 83, 9, 0.18)",
            backgroundColor: "rgba(180, 83, 9, 0.08)",
            color: "#b45309",
          }}
        >
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{assetIssueNotice}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={!capturedCanvas}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            <Download size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
