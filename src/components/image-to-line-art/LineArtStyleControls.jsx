import LineArtCheckbox from "./LineArtCheckbox.jsx";
import LineArtRangeField from "./LineArtRangeField.jsx";
import LineArtSelect from "./LineArtSelect.jsx";

export default function LineArtStyleControls({
  backgroundOptions,
  outputScaleOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <LineArtRangeField
        label="Brightness"
        value={settings.brightness}
        min={0.3}
        max={2}
        step={0.05}
        onChange={(value) => onUpdateSetting("brightness", value)}
      />
      <LineArtRangeField
        label="Contrast"
        value={settings.contrast}
        min={0.5}
        max={2}
        step={0.05}
        onChange={(value) => onUpdateSetting("contrast", value)}
      />
      <LineArtRangeField
        label="Blur"
        value={settings.blur}
        min={0}
        max={3}
        step={1}
        onChange={(value) => onUpdateSetting("blur", value)}
      />
      <LineArtRangeField
        label="Sharpen"
        value={settings.sharpen}
        min={0}
        max={2}
        step={0.1}
        onChange={(value) => onUpdateSetting("sharpen", value)}
      />
      <LineArtRangeField
        label="Noise Reduction"
        value={settings.noiseReduction}
        min={0}
        max={2}
        step={1}
        onChange={(value) => onUpdateSetting("noiseReduction", value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <LineArtSelect
          label="Background"
          value={settings.background}
          options={backgroundOptions}
          onChange={(value) => onUpdateSetting("background", value)}
        />
        <LineArtSelect
          label="Output Scale"
          value={settings.outputScale}
          options={outputScaleOptions}
          onChange={(value) => onUpdateSetting("outputScale", Number(value))}
        />
      </div>

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

      <div className="grid grid-cols-1 gap-3">
        <LineArtCheckbox
          checked={settings.invert}
          onChange={(value) => onUpdateSetting("invert", value)}
          label="Invert mode"
          description="Swap foreground and background line values for negative-style output."
        />
        <LineArtCheckbox
          checked={settings.autoContrast}
          onChange={(value) => onUpdateSetting("autoContrast", value)}
          label="Auto contrast"
          description="Normalize grayscale range before edge detection for more balanced line extraction."
        />
      </div>
    </div>
  );
}
