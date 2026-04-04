import LineArtDetectionControls from "./LineArtDetectionControls.jsx";
import LineArtQuickModes from "./LineArtQuickModes.jsx";
import LineArtStyleControls from "./LineArtStyleControls.jsx";

export default function LineArtSettingsCard({
  edgeCoverage,
  activeQuickMode,
  backgroundOptions,
  modeOptions,
  outputScaleOptions,
  quickModes,
  settings,
  thicknessOptions,
  onApplyQuickMode,
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

        {edgeCoverage != null && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(92, 124, 250, 0.08)",
                color: "var(--color-primary-600)",
                border: "1px solid rgba(92, 124, 250, 0.18)",
              }}
            >
              Edge coverage {(edgeCoverage * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <LineArtQuickModes
          activeQuickMode={activeQuickMode}
          quickModes={quickModes}
          onApplyQuickMode={onApplyQuickMode}
        />

        <LineArtDetectionControls
          modeOptions={modeOptions}
          settings={settings}
          thicknessOptions={thicknessOptions}
          onUpdateSetting={onUpdateSetting}
        />

        <LineArtStyleControls
          backgroundOptions={backgroundOptions}
          outputScaleOptions={outputScaleOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />
      </div>
    </div>
  );
}
