import { MEME_FONTS } from "../../utils/meme-generator/memeConstants.js";

export default function MemeTextControls({ layer, onUpdateLayer }) {
  const updateCurrentLayer = (patch) => onUpdateLayer(layer.id, patch);

  return (
    <>
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Text
        </label>
        <input
          type="text"
          value={layer.text}
          onChange={(event) => updateCurrentLayer({ text: event.target.value })}
          className="w-full px-3 py-2 rounded-lg border outline-none"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Font
          </label>
          <select
            value={layer.fontFamily}
            onChange={(event) =>
              updateCurrentLayer({ fontFamily: event.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          >
            {MEME_FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Alignment
          </label>
          <select
            value={layer.align}
            onChange={(event) =>
              updateCurrentLayer({ align: event.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Text Color
          </label>
          <input
            type="color"
            value={layer.color}
            onChange={(event) =>
              updateCurrentLayer({ color: event.target.value })
            }
            className="w-full h-10 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Stroke Color
          </label>
          <input
            type="color"
            value={layer.strokeColor || "#000000"}
            onChange={(event) =>
              updateCurrentLayer({ strokeColor: event.target.value })
            }
            className="w-full h-10 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
            }}
          />
        </div>
      </div>

      <label
        className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        <input
          type="checkbox"
          checked={layer.autoSize}
          onChange={(event) =>
            updateCurrentLayer({ autoSize: event.target.checked })
          }
        />
        <span className="text-sm">Auto font resize</span>
      </label>
    </>
  );
}
