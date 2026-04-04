import { Layers3 } from "lucide-react";
import MemeImageControls from "./MemeImageControls.jsx";
import MemeRangeField from "./MemeRangeField.jsx";
import MemeStickerControls from "./MemeStickerControls.jsx";
import MemeTextControls from "./MemeTextControls.jsx";

export default function MemeLayerControls({
  layer,
  rangeFields,
  onUpdateLayer,
}) {
  if (!layer) {
    return null;
  }

  return (
    <fieldset
      disabled={layer.lock}
      className={`space-y-4 ${layer.lock ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-sm font-medium m-0 flex items-center gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <Layers3 size={14} />
          Selected Layer
        </p>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {layer.lock ? "Locked" : "Drag, resize, or rotate on preview"}
        </span>
      </div>

      {layer.type === "text" && (
        <MemeTextControls layer={layer} onUpdateLayer={onUpdateLayer} />
      )}

      {layer.type === "sticker" && (
        <MemeStickerControls layer={layer} onUpdateLayer={onUpdateLayer} />
      )}

      {layer.type === "image" && <MemeImageControls layer={layer} />}

      {rangeFields.map((field) => (
        <MemeRangeField
          key={field.key}
          field={field}
          value={layer[field.key]}
          onChange={(value) => onUpdateLayer(layer.id, { [field.key]: value })}
        />
      ))}
    </fieldset>
  );
}
