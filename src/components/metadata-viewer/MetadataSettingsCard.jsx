import { Loader2 } from "lucide-react";
import MetadataMethodSelector from "./MetadataMethodSelector.jsx";

export default function MetadataSettingsCard({
  isExtracting,
  method,
  methodOption,
  methodOptions,
  onMethodChange,
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
      <div className="space-y-3">
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>

        <div
          className="rounded-lg border px-3 py-3"
          style={{
            borderColor: methodOption.tone.borderColor,
            backgroundColor: methodOption.tone.backgroundColor,
          }}
        >
          <p
            className="text-xs font-semibold m-0"
            style={{ color: methodOption.tone.color }}
          >
            What does this method do?
          </p>
          <p
            className="text-sm font-semibold mt-2 mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {methodOption.label}
          </p>
          <p
            className="text-xs m-0 leading-5"
            style={{ color: "var(--text-secondary)" }}
          >
            {methodOption.helper}
          </p>
        </div>
      </div>

      <div
        className="pt-1 border-t space-y-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <MetadataMethodSelector
          methodOptions={methodOptions}
          selectedMethod={method}
          onChange={onMethodChange}
        />

        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          {isExtracting ? <Loader2 size={14} className="animate-spin" /> : null}
          <span>
            {isExtracting
              ? "Reprocessing metadata for the selected method."
              : "Metadata updates automatically when you switch methods."}
          </span>
        </div>
      </div>
    </div>
  );
}
