export default function UpscalerToggle({
  checked,
  disabled,
  label,
  description,
  onChange,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      className="w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left transition-colors disabled:cursor-not-allowed"
      style={{
        borderColor: checked
          ? "var(--color-primary-600)"
          : "var(--border-color)",
        backgroundColor: disabled
          ? "var(--bg-secondary)"
          : "var(--bg-tertiary)",
        opacity: disabled ? 0.58 : 1,
      }}
      disabled={disabled}
    >
      <span className="min-w-0">
        <span
          className="block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </span>
        {description && (
          <span
            className="block text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {description}
          </span>
        )}
      </span>

      <span
        className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors"
        style={{
          backgroundColor: checked ? "var(--color-primary-600)" : "#cbd5e1",
        }}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
          style={{
            transform: checked ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </span>
    </button>
  );
}
