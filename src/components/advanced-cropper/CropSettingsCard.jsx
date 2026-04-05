import CreatorCheckbox from "../creator/CreatorCheckbox.jsx";
import CreatorSelect from "../creator/CreatorSelect.jsx";
import CropToolbar from "./CropToolbar.jsx";
import RangeField from "./RangeField.jsx";

export default function CropSettingsCard({
  hasImage,
  settings,
  shapeOptions,
  onUpdateSetting,
  onToggleSetting,
  onCenterImage,
  onResetTransforms,
}) {
  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
      </div>

      {!hasImage && (
        <div
          className="rounded-lg border px-3 py-3 text-sm"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-tertiary)",
          }}
        >
          Upload an image to interact with drag, scroll zoom, and export output.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <CreatorSelect
          label="Crop Shape"
          value={settings.shape}
          options={shapeOptions.map(([value, label]) => ({ value, label }))}
          onChange={(value) => onUpdateSetting("shape", value)}
        />

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Output Width
          </label>
          <input
            type="number"
            min="256"
            max="3000"
            value={settings.outputWidth}
            onChange={(event) =>
              onUpdateSetting("outputWidth", Number(event.target.value) || 1200)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <RangeField
        label="Rotate"
        value={settings.rotation}
        min={-45}
        max={45}
        step={1}
        onChange={(value) => onUpdateSetting("rotation", value)}
      />

      {settings.shape === "polygon" && (
        <RangeField
          label="Polygon Sides"
          value={settings.polygonSides}
          min={5}
          max={10}
          step={1}
          onChange={(value) => onUpdateSetting("polygonSides", value)}
        />
      )}

      <RangeField
        label="Zoom"
        value={settings.zoom}
        min={0.5}
        max={3}
        step={0.05}
        onChange={(value) => onUpdateSetting("zoom", value)}
      />

      <RangeField
        label="Scale Multiplier"
        value={settings.scaleMultiplier}
        min={1}
        max={4}
        step={0.5}
        onChange={(value) => onUpdateSetting("scaleMultiplier", value)}
      />

      <CropToolbar
        flipX={settings.flipX}
        flipY={settings.flipY}
        onCenterImage={onCenterImage}
        onResetTransforms={onResetTransforms}
        onToggleFlipX={() => onToggleSetting("flipX")}
        onToggleFlipY={() => onToggleSetting("flipY")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["showGrid", "Grid overlay"],
          ["showSafeArea", "Show safe area"],
          ["transparentBackground", "Transparent background"],
        ].map(([key, label]) => (
          <CreatorCheckbox
            key={key}
            checked={settings[key]}
            compact
            label={label}
            onChange={() => onToggleSetting(key)}
          />
        ))}
      </div>

      {!settings.transparentBackground && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Background
          </label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(event) =>
              onUpdateSetting("backgroundColor", event.target.value)
            }
            className="w-full h-10 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
            }}
          />
        </div>
      )}
    </div>
  );
}
