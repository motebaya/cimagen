import { FileText, Loader2, Plus, Trash2 } from "lucide-react";

export default function PdfResultToolbar({
  count,
  isProcessing,
  onAddImages,
  onClearAll,
}) {
  return (
    <div
      className="px-4 py-3 border-b flex items-center justify-between gap-3"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <FileText size={14} style={{ color: "var(--text-tertiary)" }} />
        <span
          className="text-sm truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {count} {count === 1 ? "page" : "pages"} ready
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isProcessing ? (
          <span
            className="hidden sm:inline-flex items-center gap-1 text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Loader2 size={12} className="animate-spin" />
            Generating PDF
          </span>
        ) : null}

        <button
          type="button"
          onClick={onAddImages}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-secondary)",
          }}
        >
          <Plus size={14} />
          Add Images
        </button>

        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-secondary)",
          }}
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>
    </div>
  );
}
