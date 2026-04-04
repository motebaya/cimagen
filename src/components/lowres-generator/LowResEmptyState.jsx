import { ImageIcon, Upload } from "lucide-react";

export default function LowResEmptyState({
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
}) {
  return (
    <div
      onClick={onOpenImagePicker}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className="relative flex flex-col items-center justify-center gap-3 p-8 min-h-[340px] sm:min-h-[520px] rounded-xl border-2 border-dashed cursor-pointer transition-all"
      style={{
        borderColor: isDragging
          ? "var(--color-primary-500)"
          : "var(--border-color)",
        backgroundColor: isDragging
          ? "rgba(92, 124, 250, 0.05)"
          : "var(--bg-tertiary)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {isDragging ? (
          <Upload size={22} style={{ color: "var(--text-tertiary)" }} />
        ) : (
          <ImageIcon size={22} style={{ color: "var(--text-tertiary)" }} />
        )}
      </div>

      <div className="text-center">
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Click to upload or drag and drop
        </p>
        <p
          className="text-xs mt-1 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          JPEG, PNG, WebP, GIF, BMP, or SVG supported (max 20MB)
        </p>
      </div>
    </div>
  );
}
