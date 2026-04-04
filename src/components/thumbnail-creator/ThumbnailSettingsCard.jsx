import ThumbnailColorPaletteSection from "./ThumbnailColorPaletteSection.jsx";

export default function ThumbnailSettingsCard({
  bgColor,
  onBackgroundChange,
  onTextChange,
  presetColors,
  text,
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
            Title Text
          </label>
          <textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Enter your title text..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border text-sm resize-none transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <ThumbnailColorPaletteSection
          bgColor={bgColor}
          onBackgroundChange={onBackgroundChange}
          presetColors={presetColors}
        />
      </div>
    </div>
  );
}
