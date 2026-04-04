import { Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

export default function PaperWriterExportCard({
  disabled,
  exportMetadata,
  exportingState,
  onDownloadAll,
  onDownloadCurrent,
}) {
  return (
    <CreatorExportCardShell
      description="Exports become available once pages are generated from your text."
      metadata={exportMetadata}
    >
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDownloadCurrent}
          disabled={disabled || exportingState.current}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          {exportingState.current ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Current Page
        </button>
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={disabled || exportingState.all}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          {exportingState.all ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Download All
        </button>
      </div>
    </CreatorExportCardShell>
  );
}
