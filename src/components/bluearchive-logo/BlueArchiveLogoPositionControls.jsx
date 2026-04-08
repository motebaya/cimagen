import BlueArchiveLogoNumberField from "./BlueArchiveLogoNumberField.jsx";

export default function BlueArchiveLogoPositionControls({
  label,
  x,
  y,
  onXChange,
  onYChange,
}) {
  return (
    <div
      className="rounded-lg border px-3 py-3 space-y-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <p
        className="text-sm font-medium m-0"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BlueArchiveLogoNumberField
          label="X Offset"
          value={x}
          min={-120}
          max={120}
          onChange={onXChange}
        />
        <BlueArchiveLogoNumberField
          label="Y Offset"
          value={y}
          min={-120}
          max={120}
          onChange={onYChange}
        />
      </div>
    </div>
  );
}
