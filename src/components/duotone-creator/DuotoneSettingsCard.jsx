export default function DuotoneSettingsCard({
  activeFilter,
  filters,
  onFilterChange,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
      </div>
      <div
        className="space-y-3 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Filter Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border outline-none"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
