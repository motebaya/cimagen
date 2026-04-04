import UpscalerModelSelector from "./UpscalerModelSelector.jsx";
import UpscalerRangeField from "./UpscalerRangeField.jsx";
import UpscalerToggle from "./UpscalerToggle.jsx";

export default function UpscalerSettingsCard({
  hasImage,
  modelState,
  performanceWarning,
  settings,
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
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
        {performanceWarning && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(180, 83, 9, 0.08)",
                color: "#b45309",
                border: "1px solid rgba(180, 83, 9, 0.18)",
              }}
            >
              High memory load
            </span>
          </div>
        )}
      </div>

      <UpscalerModelSelector modelState={modelState} />

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Scale Factor
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(modelState.selectedModel?.scaleOptions || [2]).map((value) => {
              const isSelected = settings.scale === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onUpdateSetting("scale", value)}
                  className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                  style={{
                    borderColor: isSelected
                      ? "var(--color-primary-600)"
                      : "var(--border-color)",
                    backgroundColor: isSelected
                      ? "var(--color-primary-600)"
                      : "var(--bg-tertiary)",
                    color: isSelected ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {value}x
                </button>
              );
            })}
          </div>
        </div>

        <UpscalerRangeField
          label="Detail Strength"
          value={settings.detailStrength}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) => onUpdateSetting("detailStrength", value)}
        />
        <UpscalerRangeField
          label="Sharpen Strength"
          value={settings.sharpenStrength}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) => onUpdateSetting("sharpenStrength", value)}
        />
        <UpscalerRangeField
          label="Noise Cleanup"
          value={settings.noiseReduction}
          min={0}
          max={0.5}
          step={0.02}
          onChange={(value) => onUpdateSetting("noiseReduction", value)}
        />

        <div className="space-y-3">
          <UpscalerToggle
            checked={settings.preserveEdges}
            disabled={!hasImage}
            onChange={(value) => onUpdateSetting("preserveEdges", value)}
            label="Preserve Edges"
            description="Keep text and UI edges cleaner during sharpening passes."
          />
          <UpscalerToggle
            checked={settings.adaptiveSharpen}
            disabled={!hasImage}
            onChange={(value) => onUpdateSetting("adaptiveSharpen", value)}
            label="Adaptive Sharpen"
            description="Apply extra sharpening only after the selected method finishes resizing."
          />
        </div>

        <p
          className="text-xs leading-relaxed m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Models are lazy-loaded only when selected, then cached for future
          runs. Preview processing uses smaller working dimensions to stay
          responsive.
        </p>
        {performanceWarning && (
          <p
            className="text-xs leading-relaxed m-0"
            style={{ color: "#b45309" }}
          >
            {performanceWarning}
          </p>
        )}
      </div>
    </div>
  );
}
