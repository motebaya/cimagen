import MemeLayerControls from "./MemeLayerControls.jsx";
import MemeLayerItem from "./MemeLayerItem.jsx";

export default function MemeLayersPanel({
  layers,
  selectedLayer,
  selectedLayerId,
  rangeFields,
  onRemoveLayer,
  onSelectLayer,
  onToggleLayerLock,
  onUpdateLayer,
}) {
  return (
    <div
      className="rounded-xl border p-4 space-y-4 xl:sticky xl:top-6"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Layers
        </p>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {layers.length} total
        </span>
      </div>

      {layers.length ? (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {layers.map((layer) => (
            <MemeLayerItem
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={() => onSelectLayer(layer.id)}
              onToggleLock={() => onToggleLayerLock(layer.id)}
              onRemove={() => onRemoveLayer(layer.id)}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-lg border px-3 py-4 text-sm"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-tertiary)",
          }}
        >
          Add a text, sticker, or image layer to start editing.
        </div>
      )}

      <MemeLayerControls
        layer={selectedLayer}
        rangeFields={rangeFields}
        onUpdateLayer={onUpdateLayer}
      />
    </div>
  );
}
