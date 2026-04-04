import { Download, Loader2 } from "lucide-react";

export default function ExportCard({
  exportFormats,
  hasImage,
  isExporting,
  onExport,
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="mb-4">
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Export / Download
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={!hasImage || isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {isExporting ? (
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
