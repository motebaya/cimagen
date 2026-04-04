import { ImageIcon } from "lucide-react";
import { formatFileSize } from "../../utils/watermark/editorLayerUtils.js";

export default function WatermarkImageStrip({
  items,
  activeImageId,
  onSelect,
  containerRef,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) {
  if (items.length <= 1) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="watermark-strip rounded-xl border p-3 overflow-x-auto select-none"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        cursor: "grab",
      }}
    >
      <div className="flex gap-3 min-w-max">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-44 rounded-xl overflow-hidden border text-left cursor-pointer transition-all"
            style={{
              borderColor:
                activeImageId === item.id
                  ? "var(--color-primary-500)"
                  : "var(--border-color)",
              backgroundColor:
                activeImageId === item.id
                  ? "rgba(92,124,250,0.06)"
                  : "var(--bg-secondary)",
              boxShadow:
                activeImageId === item.id ? "var(--card-shadow-hover)" : "none",
            }}
          >
            <div
              className="w-full h-24 flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <img
                src={item.src}
                alt={item.name}
                className="max-w-full max-h-full object-contain block"
              />
            </div>
            <div className="px-3 py-3">
              <div
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {item.name}
              </div>
              <div
                className="mt-1 flex items-center gap-2 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                <ImageIcon size={12} />
                <span>{formatFileSize(item.size)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
