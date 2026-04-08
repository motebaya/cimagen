import CreatorCheckbox from "../creator/CreatorCheckbox.jsx";
import BlueArchiveLogoPositionControls from "./BlueArchiveLogoPositionControls.jsx";

export default function BlueArchiveLogoSettingsCard({
  onUpdateSetting,
  settings,
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
      </div>

      <div
        className="space-y-5 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Left Text
          </label>
          <input
            type="text"
            value={settings.leftText}
            onChange={(event) =>
              onUpdateSetting("leftText", event.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Right Text
          </label>
          <input
            type="text"
            value={settings.rightText}
            onChange={(event) =>
              onUpdateSetting("rightText", event.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <CreatorCheckbox
          checked={settings.transparentMode}
          label="Transparent mode"
          description="Keep the background transparent for PNG export and preview checkerboard mode."
          onChange={(value) => onUpdateSetting("transparentMode", value)}
        />

        <BlueArchiveLogoPositionControls
          label="Halo / Cross Position"
          x={settings.decorationOffsetX}
          y={settings.decorationOffsetY}
          onXChange={(value) => onUpdateSetting("decorationOffsetX", value)}
          onYChange={(value) => onUpdateSetting("decorationOffsetY", value)}
        />
      </div>
    </div>
  );
}
