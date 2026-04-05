import { Cpu, SlidersHorizontal, Sparkles, Zap } from "lucide-react";

const DEFAULT_ICONS = {
  fast: Zap,
  balanced: SlidersHorizontal,
  quality: Sparkles,
  heavy: Cpu,
};

function resolveIcon(option) {
  return option.icon || DEFAULT_ICONS[option.id] || SlidersHorizontal;
}

export default function CreatorMethodCategoryButtons({
  label = "Method Category",
  options,
  selectedValue,
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

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const Icon = resolveIcon(option);
          const isSelected = option.id === selectedValue;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border text-left"
              style={{
                borderColor: isSelected ? "var(--color-primary-600)" : "var(--border-color)",
                backgroundColor: isSelected ? "var(--color-primary-600)" : "var(--bg-tertiary)",
                color: isSelected ? "#fff" : "var(--text-secondary)",
              }}
            >
              <Icon size={15} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
