import LowResCheckbox from "./LowResCheckbox.jsx";
import LowResRangeField from "./LowResRangeField.jsx";

const EFFECT_OPTIONS = [
  {
    key: "addJpegArtifacts",
    label: "Add JPEG artifacts",
    description:
      "Simulate blocky compression noise and rougher image encoding.",
  },
  {
    key: "addBlur",
    label: "Add blur",
    description: "Soften fine detail to mimic a softer, lower quality capture.",
  },
  {
    key: "reduceColors",
    label: "Reduce colors",
    description: "Posterize the image for a flatter, limited palette result.",
  },
];

export default function LowResSettingsCard({
  previewDimensions,
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

        {previewDimensions ? (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "rgba(92, 124, 250, 0.08)",
                color: "var(--color-primary-600)",
                border: "1px solid rgba(92, 124, 250, 0.18)",
              }}
            >
              Preview {previewDimensions.width} x {previewDimensions.height}
            </span>
          </div>
        ) : null}
      </div>

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <LowResRangeField
          label="Degradation level"
          value={settings.level}
          min={1}
          max={100}
          step={1}
          hint="1 keeps detail mostly intact. 100 pushes the image toward a heavily degraded result."
          onChange={(value) => onUpdateSetting("level", value)}
        />

        <div className="space-y-3">
          {EFFECT_OPTIONS.map((option) => (
            <LowResCheckbox
              key={option.key}
              checked={settings[option.key]}
              description={option.description}
              label={option.label}
              onChange={(value) => onUpdateSetting(option.key, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
