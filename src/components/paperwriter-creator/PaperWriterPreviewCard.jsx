import { ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

export default function PaperWriterPreviewCard({
  currentPage,
  hasPages,
  isRendering,
  onNextPage,
  onPreviousPage,
  pageCount,
  pages,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <CreatorPreviewHeader
        title="Preview"
        right={
          hasPages && pageCount > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={currentPage === 0}
                className="p-1.5 rounded-lg border-none cursor-pointer"
                style={{
                  backgroundColor:
                    currentPage === 0
                      ? "var(--bg-secondary)"
                      : "var(--color-primary-600)",
                  color: currentPage === 0 ? "var(--text-tertiary)" : "#fff",
                  opacity: currentPage === 0 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {currentPage + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={onNextPage}
                disabled={currentPage === pageCount - 1}
                className="p-1.5 rounded-lg border-none cursor-pointer"
                style={{
                  backgroundColor:
                    currentPage === pageCount - 1
                      ? "var(--bg-secondary)"
                      : "var(--color-primary-600)",
                  color:
                    currentPage === pageCount - 1
                      ? "var(--text-tertiary)"
                      : "#fff",
                  opacity: currentPage === pageCount - 1 ? 0.5 : 1,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : null
        }
      />
      <div
        className="p-4 flex justify-center relative"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        {hasPages && pages[currentPage] ? (
          <canvas
            ref={(node) => {
              if (!node || !pages[currentPage]) return;
              const ctx = node.getContext("2d");
              node.width = pages[currentPage].width;
              node.height = pages[currentPage].height;
              ctx.clearRect(0, 0, node.width, node.height);
              ctx.drawImage(pages[currentPage], 0, 0);
            }}
            className="w-full h-auto block max-h-[720px] object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <FileText
              size={48}
              style={{ color: "var(--text-tertiary)" }}
              className="mb-3 opacity-40"
            />
            <p
              className="text-sm m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              Enter text to see preview
            </p>
          </div>
        )}
        {isRendering && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(15,23,42,0.18)" }}
          >
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: "#fff" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
