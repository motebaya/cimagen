import HtmlSelect from "./HtmlSelect.jsx";

export default function HtmlThemeControls({
  backgroundColor,
  fullPage,
  onBackgroundColorChange,
  onThemeChange,
  theme,
  themeOptions,
}) {
  return (
    <div className="space-y-4">
      <HtmlSelect
        label="Theme"
        value={theme}
        options={themeOptions}
        onChange={onThemeChange}
      />

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Background canvas
        </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(event) => onBackgroundColorChange(event.target.value)}
          disabled={fullPage}
          className="w-full h-10 rounded-lg border outline-none disabled:opacity-50"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
          }}
        />
        <p
          className="text-xs mt-2 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Full Page capture ignores this canvas background and renders the page
          as-is.
        </p>
      </div>
    </div>
  );
}
