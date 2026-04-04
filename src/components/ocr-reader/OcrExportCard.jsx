import { CheckCircle, Copy, FileJson, FileText } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

function ExportButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: disabled
          ? "var(--bg-tertiary)"
          : "var(--color-primary-600)",
        color: disabled ? "var(--text-tertiary)" : "#ffffff",
      }}
    >
      {children}
    </button>
  );
}

export default function OcrExportCard({
  copiedKey,
  disabled,
  exportMetadata,
  hasImage,
  hasText,
  onCopyJson,
  onCopyText,
  onDownloadJson,
  onDownloadText,
}) {
  return (
    <CreatorExportCardShell
      metadata={exportMetadata}
      description="Copy the recognized text or export the current editable result as TXT or JSON."
      title="Copy / Export / Download"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ExportButton disabled={disabled} onClick={onCopyText}>
          {copiedKey === "text" ? (
            <CheckCircle size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copiedKey === "text" ? "Copied Text" : "Copy Text"}
        </ExportButton>

        <ExportButton disabled={disabled} onClick={onDownloadText}>
          <FileText size={16} />
          Download TXT
        </ExportButton>

        <ExportButton disabled={disabled} onClick={onCopyJson}>
          {copiedKey === "json" ? (
            <CheckCircle size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copiedKey === "json" ? "Copied JSON" : "Copy JSON"}
        </ExportButton>

        <ExportButton disabled={disabled} onClick={onDownloadJson}>
          <FileJson size={16} />
          Download JSON
        </ExportButton>
      </div>

      {!hasImage ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Upload an image to unlock OCR export options.
        </p>
      ) : !hasText ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Export activates once OCR returns text, or after you type into the
          editable result area.
        </p>
      ) : null}
    </CreatorExportCardShell>
  );
}
