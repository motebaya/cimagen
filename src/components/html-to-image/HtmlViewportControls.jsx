import HtmlRangeField from "./HtmlRangeField.jsx";
import HtmlSelect from "./HtmlSelect.jsx";

export default function HtmlViewportControls({
  customHeight,
  customWidth,
  delay,
  heightPreset,
  heightOptions,
  onCustomHeightChange,
  onCustomWidthChange,
  onDelayChange,
  onHeightPresetChange,
  onPaddingChange,
  onScaleFactorChange,
  onWidthPresetChange,
  padding,
  scaleFactor,
  widthOptions,
  widthPreset,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <HtmlSelect
          label="Viewport preset"
          value={widthPreset}
          options={widthOptions}
          onChange={onWidthPresetChange}
        />
        <HtmlSelect
          label="Viewport height"
          value={heightPreset}
          options={heightOptions}
          onChange={onHeightPresetChange}
        />
      </div>

      {widthPreset === "custom" && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Custom width
          </label>
          <input
            type="number"
            min="320"
            max="2200"
            value={customWidth}
            onChange={(event) =>
              onCustomWidthChange(Number(event.target.value) || 1280)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      {heightPreset === "custom" && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Custom height
          </label>
          <input
            type="number"
            min="320"
            max="2400"
            value={customHeight}
            onChange={(event) =>
              onCustomHeightChange(Number(event.target.value) || 900)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      <HtmlRangeField
        label="Scale factor"
        value={scaleFactor}
        min={1}
        max={2}
        step={0.25}
        onChange={onScaleFactorChange}
      />
      <HtmlRangeField
        label="Delay render"
        value={delay}
        min={0}
        max={1000}
        step={50}
        onChange={onDelayChange}
      />
      <HtmlRangeField
        label="Presentation padding"
        value={padding}
        min={0}
        max={80}
        step={4}
        onChange={onPaddingChange}
      />
    </div>
  );
}
