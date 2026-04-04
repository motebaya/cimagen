import PixelCheckbox from "./PixelCheckbox.jsx";
import PixelQuickControls from "./PixelQuickControls.jsx";
import PixelRangeField from "./PixelRangeField.jsx";
import PixelSelect from "./PixelSelect.jsx";

export default function PixelSettingsCard({
  backgroundOptions,
  colorCountOptions,
  ditheringOptions,
  finalPixelDimensions,
  outlineOptions,
  outputScaleOptions,
  paletteOptions,
  pixelSizeOptions,
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
      <div className="space-y-3">
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
        {finalPixelDimensions && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(92, 124, 250, 0.08)",
                color: "var(--color-primary-600)",
                border: "1px solid rgba(92, 124, 250, 0.18)",
              }}
            >
              Final pixels {finalPixelDimensions}
            </span>
          </div>
        )}
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <PixelQuickControls
          colorCountOptions={colorCountOptions}
          outputScaleOptions={outputScaleOptions}
          pixelSizeOptions={pixelSizeOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />

        <div className="grid grid-cols-2 gap-4">
          <PixelSelect
            label="Palette"
            value={settings.palette}
            options={paletteOptions}
            onChange={(value) => onUpdateSetting("palette", value)}
          />
          <PixelSelect
            label="Dithering"
            value={settings.dithering}
            options={ditheringOptions}
            onChange={(value) => onUpdateSetting("dithering", value)}
          />
        </div>

        {settings.palette === "custom" && (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Custom Palette
            </label>
            <textarea
              rows="3"
              value={settings.customPaletteText}
              onChange={(event) =>
                onUpdateSetting("customPaletteText", event.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border outline-none resize-y"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--input-bg)",
                color: "var(--text-primary)",
              }}
            />
            <p
              className="text-xs mt-2 m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              Separate hex colors with commas or new lines.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <PixelSelect
            label="Outline"
            value={settings.outline}
            options={outlineOptions}
            onChange={(value) => onUpdateSetting("outline", value)}
          />
          <PixelSelect
            label="Background"
            value={settings.background}
            options={backgroundOptions}
            onChange={(value) => onUpdateSetting("background", value)}
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

        <PixelRangeField
          label="Sharpen"
          min={0}
          max={2}
          step={0.1}
          value={settings.sharpen}
          onChange={(value) => onUpdateSetting("sharpen", value)}
        />
        <PixelRangeField
          label="Blur"
          min={0}
          max={2}
          step={1}
          value={settings.blur}
          onChange={(value) => onUpdateSetting("blur", value)}
        />
        <PixelRangeField
          label="Contrast"
          min={0.5}
          max={2}
          step={0.1}
          value={settings.contrast}
          onChange={(value) => onUpdateSetting("contrast", value)}
        />

        <PixelCheckbox
          checked={settings.showGrid}
          onChange={(value) => onUpdateSetting("showGrid", value)}
          label="Show Grid"
          description="Draw a faint grid over the preview and pixel PNG export when enabled."
        />
      </div>
    </div>
  );
}
