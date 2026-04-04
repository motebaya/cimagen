import {
  CheckCircle,
  Copy,
  Download,
  FileJson,
  FileText,
  FileX,
} from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

function ActionButton({ children, disabled, onClick }) {
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

export default function MetadataExportCard({
  copiedKey,
  exportMetadata,
  hasImage,
  hasMetadata,
  onCopyJson,
  onCopyText,
  onDownloadClean,
  onDownloadJson,
  onDownloadText,
}) {
  return (
    <CreatorExportCardShell
      description="Copy or download the current metadata result, or save a clean image without embedded metadata."
      metadata={exportMetadata}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionButton disabled={!hasMetadata} onClick={onCopyJson}>
          {copiedKey === "export-json" ? (
            <CheckCircle size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copiedKey === "export-json" ? "Copied JSON" : "Copy JSON"}
        </ActionButton>

        <ActionButton disabled={!hasMetadata} onClick={onDownloadJson}>
          <FileJson size={16} />
          Download JSON
        </ActionButton>

        <ActionButton disabled={!hasMetadata} onClick={onCopyText}>
          {copiedKey === "export-text" ? (
            <CheckCircle size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copiedKey === "export-text" ? "Copied Text" : "Copy Parsed Text"}
        </ActionButton>

        <ActionButton disabled={!hasMetadata} onClick={onDownloadText}>
          <FileText size={16} />
          Download TXT
        </ActionButton>

        <div className="sm:col-span-2">
          <ActionButton disabled={!hasImage} onClick={onDownloadClean}>
            <FileX size={16} />
            Download Without Metadata
          </ActionButton>
        </div>
      </div>

      {!hasImage ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Upload an image to unlock metadata export and clean-image download.
        </p>
      ) : !hasMetadata ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Metadata export activates once the current method returns readable
          fields.
        </p>
      ) : null}
    </CreatorExportCardShell>
  );
}
