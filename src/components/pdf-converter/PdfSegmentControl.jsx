export default function PdfSegmentControl({ label, options, value, onChange }) {
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
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
              style={{
                backgroundColor: isActive
                  ? "var(--color-primary-600)"
                  : "var(--bg-tertiary)",
                color: isActive ? "#fff" : "var(--text-primary)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
