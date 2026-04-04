import { ImageIcon, Upload, X } from "lucide-react";

export default function PaletteToolbar({
  hasImage,
  imageFilename,
  onOpenImagePicker,
  onRemoveImage,
  sampleCount,
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
          {hasImage ? imageFilename : "palette-preview"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {sampleCount ? (
          <span
            className="text-xs hidden sm:inline"
            style={{ color: "var(--text-tertiary)" }}
          >
            {sampleCount.toLocaleString()} sampled pixels
          </span>
        ) : null}
        {hasImage && (
          <>
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
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
