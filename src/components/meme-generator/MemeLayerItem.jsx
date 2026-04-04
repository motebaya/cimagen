import { ImageIcon, Lock, Sticker, Trash2, Type } from "lucide-react";
import { getLayerLabel } from "../../utils/meme-generator/editorHelpers.js";

function getLayerIcon(layerType) {
  if (layerType === "image") return ImageIcon;
  if (layerType === "sticker") return Sticker;
  return Type;
}

export default function MemeLayerItem({
  layer,
  isSelected,
  onSelect,
  onToggleLock,
  onRemove,
}) {
  const LayerIcon = getLayerIcon(layer.type);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left cursor-pointer border"
      style={{
        borderColor: isSelected
          ? "var(--color-primary-500)"
          : "var(--border-color)",
        backgroundColor: isSelected
          ? "rgba(92,124,250,0.06)"
          : "var(--bg-secondary)",
        color: "var(--text-secondary)",
        opacity: layer.lock ? 0.78 : 1,
      }}
    >
      <span className="min-w-0 truncate text-sm flex items-center gap-2">
        <LayerIcon size={14} />
        {getLayerLabel(layer)}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={layer.lock ? "Unlock layer" : "Lock layer"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleLock();
          }}
          className="border-none cursor-pointer w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: layer.lock
              ? "rgba(92,124,250,0.1)"
              : "transparent",
            color: layer.lock
              ? "var(--color-primary-600)"
              : "var(--text-tertiary)",
          }}
        >
          <Lock size={14} />
        </button>

        <button
          type="button"
          aria-label="Remove layer"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="border-none cursor-pointer w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: "transparent", color: "#ef4444" }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
