import { Download, Loader2 } from "lucide-react";
import CreatorExportCardShell from "../creator/CreatorExportCardShell.jsx";

const EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export default function BlackpinkExportCard({
  disabled,
  exportMetadata,
  exportingFormats,
  onExport,
}) {
  return (
    <CreatorExportCardShell
      description="The export is enabled once text is entered. The preview renders automatically."
      metadata={exportMetadata}
    >
      <div className="grid grid-cols-3 gap-3">
        {EXPORT_FORMATS.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={disabled || exportingFormats[format]}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {exportingFormats[format] ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {label}
          </button>
        ))}
      </div>
    </CreatorExportCardShell>
  );
}
