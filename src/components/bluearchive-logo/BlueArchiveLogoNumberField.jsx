export default function BlueArchiveLogoNumberField({
  label,
  value,
  min,
  max,
  onChange,
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>

      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}
