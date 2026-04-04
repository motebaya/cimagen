import { Moon, Sun } from "lucide-react";

export default function AnsiThemeSwitch({ theme, onChange }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? "light" : "dark")}
      className="w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left transition-colors"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: isDark ? "#0f172a" : "#fff7ed",
            color: isDark ? "#f8fafc" : "#d97706",
          }}
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </span>
        <span>
          <span
            className="block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Terminal Theme
          </span>
          <span
            className="block text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {isDark ? "Dark Terminal" : "Light Terminal"}
          </span>
        </span>
      </span>

      <span
        className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors"
        style={{
          backgroundColor: isDark ? "var(--color-primary-600)" : "#cbd5e1",
        }}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
          style={{ transform: isDark ? "translateX(22px)" : "translateX(2px)" }}
        />
      </span>
    </button>
  );
}
