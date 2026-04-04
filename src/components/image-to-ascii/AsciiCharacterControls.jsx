import AsciiCheckbox from "./AsciiCheckbox.jsx";
import AsciiSelect from "./AsciiSelect.jsx";

export default function AsciiCharacterControls({
  charsetOptions,
  settings,
  onUpdateCharset,
  onUpdateCharsetPreset,
  onUpdateSetting,
}) {
  return (
    <div className="space-y-4">
      <AsciiSelect
        label="Character Set"
        value={settings.charsetPreset}
        options={charsetOptions}
        onChange={onUpdateCharsetPreset}
      />

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Charset Ramp
        </label>
        <textarea
          rows="4"
          value={settings.charset}
          onChange={(event) => onUpdateCharset(event.target.value)}
          className="w-full px-3 py-2 rounded-lg border outline-none resize-y"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            fontFamily: "monospace",
          }}
        />
        <p
          className="text-xs mt-2 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Ordered light-to-dark unless sort is enabled, matching the Python
          converter flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AsciiCheckbox
          checked={settings.fixScaling}
          onChange={(value) => onUpdateSetting("fixScaling", value)}
          label="Fix scaling"
          description="Mimic the Python tool behavior that doubles width to compensate for character aspect ratio."
        />
        <AsciiCheckbox
          checked={settings.invert}
          onChange={(value) => onUpdateSetting("invert", value)}
          label="Invert output"
          description="Flip dark and light areas before character mapping."
        />
        <AsciiCheckbox
          checked={settings.sortChars}
          onChange={(value) => onUpdateSetting("sortChars", value)}
          label="Sort charset"
          description="Sort the provided characters by measured glyph brightness before rendering."
        />
        <AsciiCheckbox
          checked={settings.colorful}
          onChange={(value) => onUpdateSetting("colorful", value)}
          label="Color preview"
          description="Render per-character image color in the preview and exported image formats."
        />
      </div>
    </div>
  );
}
