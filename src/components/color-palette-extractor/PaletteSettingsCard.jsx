import PaletteCheckbox from "./PaletteCheckbox.jsx";
import PaletteRangeField from "./PaletteRangeField.jsx";
import PaletteSelect from "./PaletteSelect.jsx";

export default function PaletteSettingsCard({
  averageColor,
  selectedColorHex,
  settings,
  sortOptions,
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

        <div className="flex flex-wrap gap-2">
          {selectedColorHex && (
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${selectedColorHex}18`,
                color: "var(--text-secondary)",
                border: `1px solid ${selectedColorHex}66`,
              }}
            >
              Selected {selectedColorHex}
            </span>
          )}
          {averageColor && (
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${averageColor}18`,
                color: "var(--text-secondary)",
                border: `1px solid ${averageColor}66`,
              }}
            >
              Average {averageColor}
            </span>
          )}
        </div>
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <PaletteRangeField
          label="Dominant Colors"
          min={3}
          max={12}
          step={1}
          value={settings.colorCount}
          onChange={(value) => onUpdateSetting("colorCount", value)}
        />
        <PaletteRangeField
          label="Sample Size"
          min={2000}
          max={20000}
          step={1000}
          value={settings.sampleLimit}
          onChange={(value) => onUpdateSetting("sampleLimit", value)}
        />

        <PaletteSelect
          label="Sort Palette"
          value={settings.sortMode}
          options={sortOptions}
          onChange={(value) => onUpdateSetting("sortMode", value)}
        />

        <PaletteCheckbox
          checked={settings.showPercentages}
          onChange={(value) => onUpdateSetting("showPercentages", value)}
          label="Show percentage labels"
          description="Display the estimated image coverage for each extracted color swatch."
        />
      </div>
    </div>
  );
}
