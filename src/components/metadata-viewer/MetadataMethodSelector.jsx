export default function MetadataMethodSelector({
  methodOptions,
  selectedMethod,
  onChange,
}) {
  return (
    <div className="space-y-3">
      {methodOptions.map((option) => {
        const isActive = option.value === selectedMethod;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="w-full text-left rounded-lg border px-4 py-3 transition-colors cursor-pointer"
            style={{
              borderColor: isActive
                ? option.tone.borderColor
                : "var(--border-color)",
              backgroundColor: isActive
                ? option.tone.backgroundColor
                : "var(--bg-tertiary)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold m-0"
                  style={{ color: "var(--text-primary)" }}
                >
                  {option.label}
                </p>
                <p
                  className="text-xs mt-1 mb-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {option.title}
                </p>
              </div>

              <span
                className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold"
                style={option.tone}
              >
                Live
              </span>
            </div>

            <p
              className="text-xs mt-2 mb-0 leading-5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
