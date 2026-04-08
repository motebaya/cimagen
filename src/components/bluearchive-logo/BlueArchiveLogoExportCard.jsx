import { CheckCircle2, Copy, Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";
import CreatorSelect from "../creator/CreatorSelect.jsx";

export default function BlueArchiveLogoExportCard({
  copyState,
  exportFormat,
  exportFormats,
  exportMetadata,
  exportingKey,
  onCopy,
  onDownload,
  onFormatChange,
}) {
  return (
    <CreatorExportCardShell
      description="Preview updates automatically. Download the current composition or copy a PNG to the clipboard."
      metadata={exportMetadata}
    >
      <CreatorSelect
        label="Export Format"
        value={exportFormat}
        options={exportFormats}
        onChange={onFormatChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={Boolean(exportingKey)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-primary-600)",
            color: "#ffffff",
          }}
        >
          {exportingKey === exportFormat ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {`Download ${exportFormat.toUpperCase()}`}
        </button>

        <button
          type="button"
          onClick={onCopy}
          disabled={Boolean(exportingKey)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer border"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          {exportingKey === "copy" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : copyState === "copied" ? (
            <CheckCircle2 size={16} />
          ) : (
            <Copy size={16} />
          )}
          {copyState === "copied" ? "Copied PNG" : "Copy PNG"}
        </button>
      </div>
    </CreatorExportCardShell>
  );
}
