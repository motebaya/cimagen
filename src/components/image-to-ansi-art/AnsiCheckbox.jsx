import { Check } from "lucide-react";

export default function AnsiCheckbox({
  checked,
  description,
  label,
  onChange,
}) {
  return (
    <label
      className="flex items-start gap-3 rounded-lg border px-3 py-3 cursor-pointer"
      style={{
        borderColor: checked
          ? "var(--color-primary-600)"
          : "var(--border-color)",
        backgroundColor: checked
          ? "rgba(92, 124, 250, 0.05)"
          : "var(--bg-tertiary)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0"
        style={{
          borderColor: checked
            ? "var(--color-primary-600)"
            : "var(--border-color)",
          backgroundColor: checked ? "var(--color-primary-600)" : "transparent",
          color: checked ? "#fff" : "transparent",
        }}
      >
        <Check size={13} />
      </span>
      <span>
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
    </label>
  );
}
