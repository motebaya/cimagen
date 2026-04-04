import { Download, Loader2 } from "lucide-react";

export default function FaceBlurResultDetailsCard({
  crowdedHint,
  detectionInfo,
  exportFormats,
  faces,
  isExporting,
  resultSummary,
  onExport,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
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
          Result Details
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {resultSummary.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border px-3 py-3"
            style={{ borderColor: "var(--border-color)" }}
          >
            <p
              className="text-xs m-0 mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              {label}
            </p>
            <p
              className="text-sm font-semibold m-0 break-all"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
        {faces.length
          ? "Click a face box in the preview to exclude or re-enable that face."
          : "Upload an image to run local face detection and blur controls."}
      </p>

      {detectionInfo?.note && (
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {detectionInfo.note}
        </p>
      )}
      {detectionInfo?.warning && (
        <p className="text-xs m-0" style={{ color: "#b45309" }}>
          {detectionInfo.warning}
        </p>
      )}
      {crowdedHint && (
        <p className="text-xs m-0" style={{ color: "#b45309" }}>
          {crowdedHint}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {exportFormats.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={isExporting || !faces.length}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
