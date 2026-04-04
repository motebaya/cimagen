import { Check, Copy, Download } from "lucide-react";

export default function AnsiExportCard({
  ansiResult,
  copyState,
  exportMetadata,
  onCopyText,
  onDownloadPreviewImage,
  onDownloadText,
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
          Copy the terminal-ready ANSI output or download text and preview-image
          exports.
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
          onClick={() => onCopyText("raw")}
          disabled={!ansiResult}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {copyState === "raw" ? <Check size={16} /> : <Copy size={16} />}
          Copy ANSI
        </button>
        <button
          type="button"
          onClick={() => onCopyText("formatted")}
          disabled={!ansiResult}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {copyState === "formatted" ? <Check size={16} /> : <Copy size={16} />}
          Copy formatted
        </button>
        <button
          type="button"
          onClick={() => onDownloadText("txt")}
          disabled={!ansiResult}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download TXT
        </button>
        <button
          type="button"
          onClick={() => onDownloadText("ansi")}
          disabled={!ansiResult}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download ANSI
        </button>
        <button
          type="button"
          onClick={onDownloadPreviewImage}
          disabled={!ansiResult}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <Download size={16} />
          Download PNG Preview
        </button>
      </div>
    </div>
  );
}
