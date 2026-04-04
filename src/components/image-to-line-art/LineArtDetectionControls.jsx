import LineArtRangeField from "./LineArtRangeField.jsx";
import LineArtSelect from "./LineArtSelect.jsx";

export default function LineArtDetectionControls({
  modeOptions,
  settings,
  thicknessOptions,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <LineArtSelect
          label="Detection Mode"
          value={settings.mode}
          options={modeOptions}
          onChange={(value) => onUpdateSetting("mode", value)}
        />
        <LineArtSelect
          label="Thickness"
          value={settings.thickness}
          options={thicknessOptions}
          onChange={(value) => onUpdateSetting("thickness", value)}
        />
      </div>

      <LineArtRangeField
        label="Threshold"
        value={settings.threshold}
        min={0}
        max={255}
        step={1}
        onChange={(value) => onUpdateSetting("threshold", value)}
      />
      <LineArtRangeField
        label="Low Threshold"
        value={settings.lowThreshold}
        min={0}
        max={255}
        step={1}
        onChange={(value) => onUpdateSetting("lowThreshold", value)}
      />
      <LineArtRangeField
        label="High Threshold"
        value={settings.highThreshold}
        min={0}
        max={255}
        step={1}
        onChange={(value) => onUpdateSetting("highThreshold", value)}
      />
      <LineArtRangeField
        label="Edge Strength"
        value={settings.edgeStrength}
        min={0.5}
        max={2}
        step={0.05}
        onChange={(value) => onUpdateSetting("edgeStrength", value)}
      />
      <LineArtRangeField
        label="Cleanup Level"
        value={settings.cleanupLevel}
        min={0}
        max={3}
        step={1}
        onChange={(value) => onUpdateSetting("cleanupLevel", value)}
      />
    </div>
  );
}
