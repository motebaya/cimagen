import EmojiRangeField from "./EmojiRangeField.jsx";
import EmojiSelect from "./EmojiSelect.jsx";

export default function EmojiMatchControls({
  matchModeOptions,
  presetOptions,
  settings,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <EmojiSelect
          label="Emoji Set"
          value={settings.preset}
          options={presetOptions}
          onChange={(value) => onUpdateSetting("preset", value)}
        />
        <EmojiSelect
          label="Match Mode"
          value={settings.matchMode}
          options={matchModeOptions}
          onChange={(value) => onUpdateSetting("matchMode", value)}
        />
      </div>

      {settings.preset === "custom" && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Custom Emoji Set
          </label>
          <textarea
            rows="3"
            value={settings.customEmojiSet}
            onChange={(event) =>
              onUpdateSetting("customEmojiSet", event.target.value)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none resize-y"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Columns
          </label>
          <input
            type="number"
            min="8"
            max="120"
            value={settings.columns}
            onChange={(event) =>
              onUpdateSetting("columns", Number(event.target.value) || 8)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Rows
          </label>
          <input
            type="number"
            min="8"
            max="120"
            value={settings.rows}
            disabled={settings.preserveAspectRatio}
            onChange={(event) =>
              onUpdateSetting("rows", Number(event.target.value) || 8)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none disabled:opacity-60"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <EmojiRangeField
        label="Tile Size"
        value={settings.tileSize}
        min={10}
        max={30}
        step={1}
        onChange={(value) => onUpdateSetting("tileSize", value)}
      />
      <EmojiRangeField
        label="Sampling Density"
        value={settings.samplingDensity}
        min={1}
        max={6}
        step={1}
        onChange={(value) => onUpdateSetting("samplingDensity", value)}
      />
      <EmojiRangeField
        label="Line Height"
        value={settings.lineHeight}
        min={0.8}
        max={1.4}
        step={0.02}
        onChange={(value) => onUpdateSetting("lineHeight", value)}
      />
    </div>
  );
}
