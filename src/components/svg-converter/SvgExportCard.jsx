import { Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

export default function SvgExportCard({
  disabled,
  exportMetadata,
  isProcessing,
  onExport,
}) {
  return (
    <CreatorExportCardShell
      description="Export stays enabled once a valid SVG preview exists."
      metadata={exportMetadata}
    >
      <button
        type="button"
        onClick={onExport}
        disabled={disabled || isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "var(--color-primary-600)" }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Converting…
          </>
        ) : (
          <>
            <Download size={18} />
            Download SVG
          </>
        )}
      </button>
    </CreatorExportCardShell>
  );
}
