import { ResizeMethod } from "../../utils/pokemonCardRenderer.js";

export default function PokemonCardSettingsCard({
  description,
  onDescriptionChange,
  onResizeMethodChange,
  onTemplateIndexChange,
  onTitleChange,
  resizeMethod,
  templates,
  title,
  templateIndex,
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
            Card Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Card Template
          </label>
          <div className="grid grid-cols-4 gap-2">
            {templates.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onTemplateIndexChange(idx)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor:
                    templateIndex === idx
                      ? "var(--color-primary-600)"
                      : "var(--bg-tertiary)",
                  color: templateIndex === idx ? "#fff" : "var(--text-primary)",
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Image Resize Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: ResizeMethod.AUTO, label: "Auto" },
              { value: ResizeMethod.SCALE, label: "Scale" },
              { value: ResizeMethod.CROP, label: "Crop" },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => onResizeMethodChange(method.value)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor:
                    resizeMethod === method.value
                      ? "var(--color-primary-600)"
                      : "var(--bg-tertiary)",
                  color:
                    resizeMethod === method.value
                      ? "#fff"
                      : "var(--text-primary)",
                }}
              >
                {method.label}
              </button>
            ))}
          </div>
          <p
            className="text-xs mt-2 m-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            Auto: smart crop with border detection.
          </p>
        </div>
      </div>
    </div>
  );
}
