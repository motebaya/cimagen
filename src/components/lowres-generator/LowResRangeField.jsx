export default function LowResRangeField({
  hint,
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />

      {hint ? (
        <p
          className="text-xs mt-2 mb-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
