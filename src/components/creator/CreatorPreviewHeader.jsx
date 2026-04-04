import { ImageIcon, Upload } from "lucide-react";

export default function CreatorPreviewHeader({
  fileLabel,
  hasReplace,
  onOpenPicker,
  onRemove,
  right,
  title = "Preview",
}) {
  return (
    <div
      className="px-4 py-3 border-b flex items-center justify-between gap-3"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {fileLabel ? (
          <>
            <ImageIcon size={14} style={{ color: "var(--text-tertiary)" }} />
            <span
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {fileLabel}
            </span>
          </>
        ) : (
          <p
            className="text-sm font-medium m-0"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {right}
        {hasReplace && (
          <>
            <button
              type="button"
              onClick={onOpenPicker}
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
              onClick={onRemove}
              className="px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
              }}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
