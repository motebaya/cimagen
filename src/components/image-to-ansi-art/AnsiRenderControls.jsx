import {
  ANSI_COLUMN_PRESETS,
  getBlockCharacterOptions,
} from "../../utils/image-to-ansi-art/index.js";
import AnsiRangeField from "./AnsiRangeField.jsx";
import AnsiSelect from "./AnsiSelect.jsx";

export default function AnsiRenderControls({
  charsetPresetOptions,
  renderModeOptions,
  settings,
  onUpdateSetting,
}) {
  const blockOptions = getBlockCharacterOptions().map((option) => ({
    value: option.value,
    label: option.label,
    description: option.value,
  }));

  return (
    <div className="space-y-4">
      <div>
        <p
          className="text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Width Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {ANSI_COLUMN_PRESETS.map(([value, label]) => {
            const isSelected = settings.columns === value;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onUpdateSetting("columns", value)}
                className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                style={{
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <AnsiRangeField
        label="Columns"
        value={settings.columns}
        min={20}
        max={200}
        step={1}
        onChange={(value) => onUpdateSetting("columns", value)}
      />
      <AnsiRangeField
        label="Aspect Compensation"
        value={settings.aspectCompensation}
        min={0.4}
        max={1.4}
        step={0.05}
        onChange={(value) => onUpdateSetting("aspectCompensation", value)}
      />
      <AnsiRangeField
        label="Preview Font Size"
        value={settings.fontSize}
        min={10}
        max={18}
        step={1}
        onChange={(value) => onUpdateSetting("fontSize", value)}
      />
      <AnsiRangeField
        label="Line Height"
        value={settings.lineHeight}
        min={1}
        max={1.5}
        step={0.05}
        onChange={(value) => onUpdateSetting("lineHeight", value)}
      />

      <AnsiSelect
        label="Render Mode"
        value={settings.renderMode}
        options={renderModeOptions}
        onChange={(value) => onUpdateSetting("renderMode", value)}
      />

      {settings.renderMode === "full" && (
        <div className="grid grid-cols-1 gap-4">
          <AnsiSelect
            label="Charset Preset"
            value={settings.charsetPreset}
            options={charsetPresetOptions}
            onChange={(value) => onUpdateSetting("charsetPreset", value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <AnsiSelect
              label="Block Character"
              value={settings.customChar}
              options={blockOptions}
              disabled={settings.charsetPreset !== "custom-char"}
              onChange={(value) => onUpdateSetting("customChar", value)}
            />
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Custom Character
              </label>
              <input
                type="text"
                maxLength={2}
                value={settings.customChar}
                onChange={(event) =>
                  onUpdateSetting("customChar", event.target.value || "█")
                }
                disabled={settings.charsetPreset !== "custom-char"}
                className="w-full px-3 py-2 rounded-lg border outline-none disabled:opacity-50"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {settings.charsetPreset !== "custom-char" && (
            <p
              className="text-xs m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              Charset presets map image luminance to reusable ASCII ramps for
              more stylized terminal looks.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
