import EmojiBackgroundControls from "./EmojiBackgroundControls.jsx";
import EmojiMatchControls from "./EmojiMatchControls.jsx";

export default function EmojiMosaicSettingsCard({
  backgroundOptions,
  liveEmojiCount,
  liveGridSummary,
  matchModeOptions,
  presetOptions,
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

        <div className="flex flex-wrap gap-2">
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Grid {liveGridSummary}
          </span>
          {liveEmojiCount != null && (
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {liveEmojiCount} emoji
            </span>
          )}
          {settings.background === "transparent" && (
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(92, 124, 250, 0.08)",
                color: "var(--color-primary-600)",
                border: "1px solid rgba(92, 124, 250, 0.18)",
              }}
            >
              Best for transparent PNG
            </span>
          )}
        </div>
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <EmojiMatchControls
          matchModeOptions={matchModeOptions}
          presetOptions={presetOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />

        <EmojiBackgroundControls
          backgroundOptions={backgroundOptions}
          settings={settings}
          onUpdateSetting={onUpdateSetting}
        />
      </div>
    </div>
  );
}
