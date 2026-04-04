import EmojiCheckbox from "./EmojiCheckbox.jsx";
import EmojiRangeField from "./EmojiRangeField.jsx";
import EmojiSelect from "./EmojiSelect.jsx";

export default function EmojiBackgroundControls({
  backgroundOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <EmojiSelect
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

      <div className="grid grid-cols-1 gap-3">
        <EmojiCheckbox
          checked={settings.preserveAspectRatio}
          onChange={(value) => onUpdateSetting("preserveAspectRatio", value)}
          label="Preserve aspect ratio"
          description="Automatically keep rows aligned to the source image aspect ratio."
        />
        <EmojiCheckbox
          checked={settings.invertBrightness}
          onChange={(value) => onUpdateSetting("invertBrightness", value)}
          label="Invert brightness"
          description="Flip luminance mapping for more unconventional emoji selection."
        />
        <EmojiCheckbox
          checked={settings.trimEmptyBorders}
          onChange={(value) => onUpdateSetting("trimEmptyBorders", value)}
          label="Trim empty borders"
          description="Remove fully empty rows and columns around the finished mosaic."
        />
      </div>

      <EmojiRangeField
        label="Luminance Weight"
        value={settings.luminanceWeight}
        min={0}
        max={1.5}
        step={0.05}
        onChange={(value) => onUpdateSetting("luminanceWeight", value)}
      />
      <EmojiRangeField
        label="Brightness Weight"
        value={settings.brightnessWeight}
        min={0}
        max={1.5}
        step={0.05}
        onChange={(value) => onUpdateSetting("brightnessWeight", value)}
      />
      <EmojiRangeField
        label="Saturation Weight"
        value={settings.saturationWeight}
        min={0}
        max={1.5}
        step={0.05}
        onChange={(value) => onUpdateSetting("saturationWeight", value)}
      />
    </div>
  );
}
