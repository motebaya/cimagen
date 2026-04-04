export default function MemeRangeField({ field, value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {field.label}
        </label>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {field.format(value ?? 0)}
        </span>
      </div>

      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value ?? 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </div>
  );
}
