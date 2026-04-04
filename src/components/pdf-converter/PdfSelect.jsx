import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PdfSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || options[0],
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {label ? (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--input-bg)",
          color: "var(--text-primary)",
        }}
      >
        <span className="min-w-0">
          <span className="block text-sm font-medium truncate">
            {selectedOption?.label}
          </span>
          {selectedOption?.description ? (
            <span
              className="block text-xs truncate"
              style={{ color: "var(--text-tertiary)" }}
            >
              {selectedOption.description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={16}
          className="transition-transform"
          style={{
            color: "var(--text-tertiary)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        className={`absolute z-20 mt-2 w-full rounded-lg border overflow-hidden transition-all origin-top ${open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--card-bg)",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div className="max-h-64 overflow-y-auto py-1" role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? "rgba(92, 124, 250, 0.08)"
                    : "transparent",
                  color: "var(--text-primary)",
                }}
              >
                <span className="block text-sm font-medium">
                  {option.label}
                </span>
                {option.description ? (
                  <span
                    className="block text-xs mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {option.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
