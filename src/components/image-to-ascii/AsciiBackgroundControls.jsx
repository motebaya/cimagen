import AsciiSelect from "./AsciiSelect.jsx";

export default function AsciiBackgroundControls({
  backgroundOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <AsciiSelect
        label="Background"
        value={settings.background}
        options={backgroundOptions}
        onChange={(value) => onUpdateSetting("background", value)}
      />

      {settings.background === "custom" && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Custom Background
          </label>
          <input
            type="color"
            value={settings.customBackground}
            onChange={(event) =>
              onUpdateSetting("customBackground", event.target.value)
            }
            className="w-full h-11 rounded-lg border outline-none"
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
