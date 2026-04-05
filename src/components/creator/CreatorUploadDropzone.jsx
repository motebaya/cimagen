import { ImageIcon, Upload } from "lucide-react";

export default function CreatorUploadDropzone({
  description,
  desktopMinHeightClass = "sm:min-h-[520px]",
  dragIcon: DragIcon = Upload,
  idleIcon: IdleIcon = ImageIcon,
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
  title,
}) {
  const ActiveIcon = isDragging ? DragIcon : IdleIcon;

  return (
    <div
      onClick={onOpenImagePicker}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative flex flex-col items-center justify-center gap-3 p-8 aspect-square sm:aspect-auto ${desktopMinHeightClass} rounded-xl border-2 border-dashed cursor-pointer transition-all`}
      style={{
        borderColor: isDragging ? "var(--color-primary-500)" : "var(--border-color)",
        backgroundColor: isDragging ? "rgba(92, 124, 250, 0.05)" : "var(--bg-tertiary)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <ActiveIcon size={22} style={{ color: "var(--text-tertiary)" }} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium m-0" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
        <p className="text-xs mt-1 m-0" style={{ color: "var(--text-tertiary)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
