import FaceBlurModelSelector from "./FaceBlurModelSelector.jsx";
import FaceBlurRangeField from "./FaceBlurRangeField.jsx";

export default function FaceBlurSettingsCard({
  activeFaceCount,
  crowdedHint,
  faceCount,
  hasImage,
  modelState,
  effectOptions,
  shapeOptions,
  settings,
  onSetAllFacesActive,
  onUpdateSetting,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="space-y-3">
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>

        {hasImage && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {faceCount} detected
            </span>
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {activeFaceCount} blurred
            </span>
            {crowdedHint && (
              <span
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "rgba(180, 83, 9, 0.08)",
                  color: "#b45309",
                  border: "1px solid rgba(180, 83, 9, 0.18)",
                }}
              >
                Crowded scene
              </span>
            )}
          </div>
        )}

        {crowdedHint && (
          <p className="text-xs m-0" style={{ color: "#b45309" }}>
            {crowdedHint}
          </p>
        )}
      </div>

      <FaceBlurModelSelector modelState={modelState} />

      <div
        className="grid grid-cols-2 gap-4 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Blur Method
          </label>
          <select
            value={settings.effect}
            onChange={(event) => onUpdateSetting("effect", event.target.value)}
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          >
            {effectOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Mask Shape
          </label>
          <select
            value={settings.shape}
            onChange={(event) => onUpdateSetting("shape", event.target.value)}
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          >
            {shapeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FaceBlurRangeField
        label="Blur Strength"
        value={settings.strength}
        min={4}
        max={36}
        step={1}
        onChange={(value) => onUpdateSetting("strength", value)}
      />
      <FaceBlurRangeField
        label="Face Padding"
        value={settings.padding}
        min={0}
        max={0.6}
        step={0.05}
        onChange={(value) => onUpdateSetting("padding", value)}
      />
      <FaceBlurRangeField
        label="Feather Edge"
        value={settings.feather}
        min={0}
        max={28}
        step={1}
        onChange={(value) => onUpdateSetting("feather", value)}
      />
      <FaceBlurRangeField
        label="Detection Sensitivity"
        value={settings.detectionSensitivity}
        min={0.2}
        max={0.8}
        step={0.05}
        onChange={(value) => onUpdateSetting("detectionSensitivity", value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <label
          className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <input
            type="checkbox"
            checked={settings.showBoxes}
            onChange={(event) =>
              onUpdateSetting("showBoxes", event.target.checked)
            }
          />
          <span className="text-sm">Show face boxes</span>
        </label>
        <button
          type="button"
          onClick={() => onSetAllFacesActive(true)}
          disabled={!hasImage}
          className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          Blur all faces
        </button>
        <button
          type="button"
          onClick={() => onSetAllFacesActive(false)}
          disabled={!hasImage}
          className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          Clear selections
        </button>
      </div>

      <p
        className="text-xs leading-relaxed m-0"
        style={{ color: "var(--text-tertiary)" }}
      >
        Detection methods rerun automatically when you change the selected model
        or sensitivity. Blur settings only re-render the masking layer.
      </p>
    </div>
  );
}
