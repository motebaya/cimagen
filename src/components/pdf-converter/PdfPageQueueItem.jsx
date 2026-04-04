import { GripVertical, RotateCw, Trash2 } from "lucide-react";
import PdfThumbnailCanvas from "./PdfThumbnailCanvas.jsx";

export default function PdfPageQueueItem({
  image,
  index,
  isDragging,
  onDragEnd,
  onDragEnter,
  onDragStart,
  onRemove,
  onRotate,
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(event) => event.preventDefault()}
      onDragEnd={onDragEnd}
      className="flex items-center gap-3 p-3 rounded-lg cursor-move"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <GripVertical size={16} style={{ color: "var(--text-tertiary)" }} />
      <PdfThumbnailCanvas canvas={image.canvas} rotation={image.rotation} />

      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate m-0"
          style={{ color: "var(--text-primary)" }}
        >
          {image.filename}
        </p>
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {`Page ${index + 1} - ${image.rotation} deg rotation`}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRotate(image.id)}
        className="p-2 rounded transition-colors border-none cursor-pointer"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
        title="Rotate 90 degrees"
      >
        <RotateCw size={16} />
      </button>

      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="p-2 rounded transition-colors border-none cursor-pointer"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
        title="Remove page"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
