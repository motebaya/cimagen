import AsciiRangeField from "./AsciiRangeField.jsx";

export default function AsciiRenderControls({ settings, onUpdateSetting }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Size Width
          </label>
          <input
            type="number"
            min="8"
            max="240"
            value={settings.width}
            onChange={(event) =>
              onUpdateSetting("width", Number(event.target.value) || 8)
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
            Size Height
          </label>
          <input
            type="number"
            min="8"
            max="240"
            value={settings.height}
            onChange={(event) =>
              onUpdateSetting("height", Number(event.target.value) || 8)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Scale X
          </label>
          <input
            type="number"
            min="0.1"
            max="3"
            step="0.1"
            value={settings.scaleX}
            onChange={(event) =>
              onUpdateSetting("scaleX", Number(event.target.value) || 1)
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
            Scale Y
          </label>
          <input
            type="number"
            min="0.1"
            max="3"
            step="0.1"
            value={settings.scaleY}
            onChange={(event) =>
              onUpdateSetting("scaleY", Number(event.target.value) || 1)
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <AsciiRangeField
        label="Brightness"
        min={0.25}
        max={2}
        step={0.05}
        value={settings.brightness}
        onChange={(value) => onUpdateSetting("brightness", value)}
      />
      <AsciiRangeField
        label="Contrast"
        min={0.25}
        max={2}
        step={0.05}
        value={settings.contrast}
        onChange={(value) => onUpdateSetting("contrast", value)}
      />
      <AsciiRangeField
        label="Sharpness"
        min={0}
        max={3}
        step={0.1}
        value={settings.sharpness}
        onChange={(value) => onUpdateSetting("sharpness", value)}
      />
      <AsciiRangeField
        label="Preview Font Size"
        min={8}
        max={16}
        step={1}
        value={settings.fontSize}
        onChange={(value) => onUpdateSetting("fontSize", value)}
      />
      <AsciiRangeField
        label="Line Height"
        min={1}
        max={1.4}
        step={0.05}
        value={settings.lineHeight}
        onChange={(value) => onUpdateSetting("lineHeight", value)}
      />
    </div>
  );
}
