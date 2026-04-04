import { Check, Copy, Download } from "lucide-react";

export default function PaletteExportCard({
  copyState,
  cssVariables,
  hasPalette,
  jsonExport,
  metadata,
  onCopyCss,
  onCopyHex,
  onDownloadJson,
  onDownloadTxt,
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
          Export
        </h2>
        <p
          className="text-xs mt-1 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Copy or download the extracted palette in simple text, CSS variable,
          or JSON forms.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
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

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCopyHex}
          disabled={!hasPalette}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {copyState === "hex" ? <Check size={16} /> : <Copy size={16} />}
          Copy HEX list
        </button>
        <button
          type="button"
          onClick={onCopyCss}
          disabled={!hasPalette || !cssVariables}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {copyState === "css" ? <Check size={16} /> : <Copy size={16} />}
          Copy CSS vars
        </button>
        <button
          type="button"
          onClick={onDownloadTxt}
          disabled={!hasPalette}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download TXT
        </button>
        <button
          type="button"
          onClick={onDownloadJson}
          disabled={!hasPalette || !jsonExport}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download JSON
        </button>
      </div>
    </div>
  );
}
