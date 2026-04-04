import AnsiSelect from "./AnsiSelect.jsx";

export default function AnsiColorControls({
  backgroundOptions,
  colorModeOptions,
  outputFormatOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <AnsiSelect
        label="Color Mode"
        value={settings.colorMode}
        options={colorModeOptions}
        onChange={(value) => onUpdateSetting("colorMode", value)}
      />
      <AnsiSelect
        label="Background"
        value={settings.background}
        options={backgroundOptions}
        onChange={(value) => onUpdateSetting("background", value)}
      />
      <AnsiSelect
        label="Output Format"
        value={settings.outputFormat}
        options={outputFormatOptions}
        onChange={(value) => onUpdateSetting("outputFormat", value)}
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
