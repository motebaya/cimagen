import { ImageIcon, Loader2, Upload, X } from "lucide-react";

export default function LowResPreviewToolbar({
  hasImage,
  imageFilename,
  isProcessing,
  level,
  onOpenImagePicker,
  onRemoveImage,
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 border-b"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ImageIcon size={14} style={{ color: "var(--text-tertiary)" }} />
        <span
          className="text-sm truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {hasImage ? imageFilename : "lowres-preview"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hasImage && (
          <>
            {isProcessing ? (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Loader2 size={12} className="animate-spin" />
                Updating preview
              </span>
            ) : (
              <span
                className="hidden sm:inline text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Level {level}
              </span>
            )}

            <button
              type="button"
              onClick={onOpenImagePicker}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
              }}
            >
              <Upload size={14} />
              Replace
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="p-1 rounded-md cursor-pointer border-none"
              style={{
                color: "var(--text-tertiary)",
                backgroundColor: "transparent",
              }}
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
