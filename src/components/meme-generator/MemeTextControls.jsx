import CreatorCheckbox from "../creator/CreatorCheckbox.jsx";
import CreatorSelect from "../creator/CreatorSelect.jsx";
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
        <CreatorSelect
          label="Font"
          value={layer.fontFamily}
          options={MEME_FONTS.map((font) => ({ value: font, label: font }))}
          onChange={(value) => updateCurrentLayer({ fontFamily: value })}
        />

        <CreatorSelect
          label="Alignment"
          value={layer.align}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
          onChange={(value) => updateCurrentLayer({ align: value })}
        />
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

      <CreatorCheckbox
        checked={layer.autoSize}
        compact
        label="Auto font resize"
        onChange={(value) => updateCurrentLayer({ autoSize: value })}
      />
    </>
  );
}
