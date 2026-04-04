import { Check, Copy, Download, Loader2 } from "lucide-react";

export default function EmojiExportCard({
  copyState,
  exportFormats,
  exportMetadata,
  exportingFormats,
  hasMosaic,
  onCopyText,
  onDownloadImage,
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
          Copy the emoji mosaic text or export it as text, JSON tile data, or
          rendered image formats.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {exportMetadata.map(([label, value]) => (
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

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCopyText}
          disabled={!hasMosaic}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {copyState ? <Check size={16} /> : <Copy size={16} />}
          {copyState ? "Copied" : "Copy emoji text"}
        </button>
        <button
          type="button"
          onClick={onDownloadTxt}
          disabled={!hasMosaic}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download TXT
        </button>
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onDownloadImage(format)}
            disabled={!hasMosaic || exportingFormats?.[format]}
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
        <button
          type="button"
          onClick={onDownloadJson}
          disabled={!hasMosaic}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          <Download size={16} />
          JSON tile map
        </button>
      </div>
    </div>
  );
}
