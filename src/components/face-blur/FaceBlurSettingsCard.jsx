import CreatorCheckbox from "../creator/CreatorCheckbox.jsx";
import CreatorSelect from "../creator/CreatorSelect.jsx";
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
        <CreatorSelect
          label="Blur Method"
          value={settings.effect}
          options={effectOptions.map(([value, label]) => ({ value, label }))}
          onChange={(value) => onUpdateSetting("effect", value)}
        />

        <CreatorSelect
          label="Mask Shape"
          value={settings.shape}
          options={shapeOptions.map(([value, label]) => ({ value, label }))}
          onChange={(value) => onUpdateSetting("shape", value)}
        />
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
        <CreatorCheckbox
          checked={settings.showBoxes}
          compact
          label="Show face boxes"
          onChange={(value) => onUpdateSetting("showBoxes", value)}
        />
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
