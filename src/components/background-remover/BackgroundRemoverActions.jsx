import { Upload, X } from "lucide-react";

export default function BackgroundRemoverActions({
  onOpenImagePicker,
  onRemoveImage,
}) {
  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}
