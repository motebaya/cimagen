import AnsiCheckbox from "./AnsiCheckbox.jsx";

export default function AnsiBackgroundControls({ settings, onUpdateSetting }) {
  return (
    <div className="space-y-3">
      <AnsiCheckbox
        checked={settings.optimizeEscapeCodes}
        onChange={(value) => onUpdateSetting("optimizeEscapeCodes", value)}
        label="Optimize escape codes"
        description="Minimize repeated ANSI sequences for cleaner terminal output."
      />
      <AnsiCheckbox
        checked={settings.addResetAtEnd}
        onChange={(value) => onUpdateSetting("addResetAtEnd", value)}
        label="Add reset at end"
        description="Append a final reset code to avoid leaking styles into later terminal text."
      />
      <AnsiCheckbox
        checked={settings.trimEmptyRows}
        onChange={(value) => onUpdateSetting("trimEmptyRows", value)}
        label="Trim empty rows"
        description="Remove unused blank lines after rendering to tighten the output height."
      />
    </div>
  );
}
