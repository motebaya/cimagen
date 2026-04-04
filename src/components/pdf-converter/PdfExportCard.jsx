import { Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

export default function PdfExportCard({
  disabled,
  exportMetadata,
  hasImages,
  isProcessing,
  onExport,
}) {
  return (
    <CreatorExportCardShell
      metadata={exportMetadata}
      description="Download the current image stack as a single PDF using the active page and layout settings."
    >
      <button
        type="button"
        onClick={onExport}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled
            ? "var(--bg-tertiary)"
            : "var(--color-primary-600)",
          color: disabled ? "var(--text-tertiary)" : "#ffffff",
        }}
      >
        {isProcessing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {isProcessing ? "Generating PDF..." : "Download PDF"}
      </button>

      {!hasImages ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Upload one or more images to build a PDF document.
        </p>
      ) : null}
    </CreatorExportCardShell>
  );
}
