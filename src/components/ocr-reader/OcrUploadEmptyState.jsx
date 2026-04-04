import { ImageIcon, Upload } from "lucide-react";

export default function OcrUploadEmptyState({
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
      className="relative flex flex-col items-center justify-center gap-3 p-6 min-h-[320px] rounded-lg border-2 border-dashed cursor-pointer transition-all"
      style={{
        borderColor: isDragging
          ? "var(--color-primary-500)"
          : "var(--border-color)",
        backgroundColor: isDragging
          ? "rgba(92, 124, 250, 0.05)"
          : "var(--card-bg)",
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
          Best results come from clear, high-contrast text images.
        </p>
      </div>
    </div>
  );
}
