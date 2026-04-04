import AnsiBackgroundControls from "./AnsiBackgroundControls.jsx";
import AnsiColorControls from "./AnsiColorControls.jsx";
import AnsiRenderControls from "./AnsiRenderControls.jsx";
import AnsiThemeSwitch from "./AnsiThemeSwitch.jsx";

export default function AnsiSettingsCard({
  backgroundOptions,
  colorModeOptions,
  charsetPresetOptions,
  outputFormatOptions,
  renderModeOptions,
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
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <AnsiRenderControls
          charsetPresetOptions={charsetPresetOptions}
          renderModeOptions={renderModeOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />

        <AnsiColorControls
          backgroundOptions={backgroundOptions}
          colorModeOptions={colorModeOptions}
          outputFormatOptions={outputFormatOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />

        <AnsiThemeSwitch
          theme={settings.terminalTheme}
          onChange={(value) => onUpdateSetting("terminalTheme", value)}
        />

        <AnsiBackgroundControls
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />
      </div>
    </div>
  );
}
