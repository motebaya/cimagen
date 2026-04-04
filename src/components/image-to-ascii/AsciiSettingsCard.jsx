import AsciiBackgroundControls from "./AsciiBackgroundControls.jsx";
import AsciiCharacterControls from "./AsciiCharacterControls.jsx";
import AsciiRenderControls from "./AsciiRenderControls.jsx";

export default function AsciiSettingsCard({
  backgroundOptions,
  charsetOptions,
  finalAsciiSize,
  settings,
  onUpdateCharset,
  onUpdateCharsetPreset,
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
        {finalAsciiSize && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(92, 124, 250, 0.08)",
                color: "var(--color-primary-600)",
                border: "1px solid rgba(92, 124, 250, 0.18)",
              }}
            >
              Final ASCII {finalAsciiSize}
            </span>
          </div>
        )}
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <AsciiRenderControls
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />
        <AsciiCharacterControls
          charsetOptions={charsetOptions}
          settings={settings}
          onUpdateCharset={onUpdateCharset}
          onUpdateCharsetPreset={onUpdateCharsetPreset}
          onUpdateSetting={onUpdateSetting}
        />
        <AsciiBackgroundControls
          backgroundOptions={backgroundOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />
      </div>
    </div>
  );
}
