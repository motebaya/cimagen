import { Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

export default function LowResExportCard({
  disabled,
  exportFormats,
  exportMetadata,
  exportingFormats,
  hasImage,
  hasPreview,
  isProcessing,
  onExport,
}) {
  let helperText = null;

  if (!hasImage) {
    helperText = "Upload an image to enable export.";
  } else if (isProcessing) {
    helperText =
      "Preview is updating. Export unlocks when processing finishes.";
  } else if (!hasPreview) {
    helperText =
      "Preview unavailable. Adjust settings or upload another image to continue.";
  }

  return (
    <CreatorExportCardShell
      description="Download the processed low-resolution image as JPG, PNG, or WEBP using the current settings."
      metadata={exportMetadata}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={disabled || exportingFormats?.[format]}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {exportingFormats?.[format] ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isProcessing ? "Processing..." : label}
          </button>
        ))}
      </div>

      {helperText ? (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {helperText}
        </p>
      ) : null}
    </CreatorExportCardShell>
  );
}
