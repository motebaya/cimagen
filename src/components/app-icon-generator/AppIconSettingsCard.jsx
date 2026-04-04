export default function AppIconSettingsCard({
  androidName,
  appName,
  backgroundColor,
  badgeColor,
  badgeEnabled,
  badgeText,
  onAndroidNameChange,
  onAppNameChange,
  onBackgroundColorChange,
  onBadgeColorChange,
  onBadgeEnabledChange,
  onBadgeTextChange,
  onZoomChange,
  zoom,
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
        className="space-y-5 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Image Scale
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.01"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer border"
              style={{ borderColor: "var(--border-color)" }}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            App Name
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onAppNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border-none"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Android File Name
          </label>
          <input
            type="text"
            value={androidName}
            onChange={(e) => onAndroidNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border-none"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1rem",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Badge Strip
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={badgeEnabled}
                onChange={(e) => onBadgeEnabledChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {badgeEnabled && (
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => onBadgeTextChange(e.target.value)}
                  maxLength="10"
                  className="w-full px-3 py-2 rounded-lg text-sm border-none"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Badge Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => onBadgeColorChange(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer border"
                    style={{ borderColor: "var(--border-color)" }}
                  />
                  <input
                    type="text"
                    value={badgeColor}
                    onChange={(e) => onBadgeColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm border-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
