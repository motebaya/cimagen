import { Check } from "lucide-react";

export default function CreatorCheckbox({
  checked,
  className = "",
  compact = false,
  description,
  disabled = false,
  label,
  onChange,
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-lg border cursor-pointer ${compact ? "px-3 py-2" : "px-3 py-3"} ${className}`}
      style={{
        borderColor: checked
          ? "var(--color-primary-600)"
          : "var(--border-color)",
        backgroundColor: checked
          ? "rgba(92, 124, 250, 0.05)"
          : "var(--bg-tertiary)",
        opacity: disabled ? 0.58 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />

      <span
        className={`mt-0.5 rounded-md border flex items-center justify-center flex-shrink-0 ${compact ? "w-[18px] h-[18px]" : "w-5 h-5"}`}
        style={{
          borderColor: checked
            ? "var(--color-primary-600)"
            : "var(--border-color)",
          backgroundColor: checked ? "var(--color-primary-600)" : "transparent",
          color: checked ? "#fff" : "transparent",
        }}
      >
        <Check size={compact ? 11 : 13} />
      </span>

      <span>
        <span
          className={`block ${compact ? "text-sm" : "text-sm"} font-medium`}
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </span>
        {description ? (
          <span
            className="block text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
