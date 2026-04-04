import { Camera, ImageIcon, Info, Loader2, MapPin } from "lucide-react";
import MetadataTreeTable from "./MetadataTreeTable.jsx";

function EmptyState({ message }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
      <ImageIcon
        size={44}
        className="mb-3 opacity-40"
        style={{ color: "var(--text-tertiary)" }}
      />
      <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
        {message}
      </p>
    </div>
  );
}

export default function MetadataResultCard({
  copiedKey,
  fieldCount,
  hasCamera,
  hasGPS,
  hasImage,
  hasMetadata,
  isExtracting,
  methodLabel,
  onCopyValue,
  rows,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-3"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <div>
          <h2
            className="text-sm font-medium m-0"
            style={{ color: "var(--text-secondary)" }}
          >
            Metadata Result
          </h2>
          <p
            className="text-xs mt-1 mb-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            Structured output for the current extraction method.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <span
            className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              borderColor: "rgba(59, 130, 246, 0.2)",
              color: "#2563eb",
            }}
          >
            {methodLabel}
          </span>
          <span
            className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgba(148, 163, 184, 0.1)",
              borderColor: "rgba(148, 163, 184, 0.2)",
              color: "#475569",
            }}
          >
            {fieldCount} fields
          </span>
          {hasGPS ? (
            <span
              className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.22)",
                color: "#047857",
              }}
            >
              <MapPin size={12} />
              GPS
            </span>
          ) : null}
          {hasCamera ? (
            <span
              className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                borderColor: "rgba(14, 165, 233, 0.22)",
                color: "#0369a1",
              }}
            >
              <Camera size={12} />
              Camera
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        {isExtracting ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={28}
              className="animate-spin mb-3"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p
              className="text-sm m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              Extracting metadata with {methodLabel}...
            </p>
          </div>
        ) : !hasImage ? (
          <EmptyState message="Upload an image to inspect metadata." />
        ) : !hasMetadata ? (
          <EmptyState
            message={`No readable metadata found with ${methodLabel}.`}
          />
        ) : (
          <div className="space-y-3">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Info size={14} />
              <span>
                Each row can be copied individually. Expand grouped rows to
                inspect nested values.
              </span>
            </div>
            <MetadataTreeTable
              copiedKey={copiedKey}
              nodes={rows}
              onCopyValue={onCopyValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
