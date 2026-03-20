import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { renderPaperWriter } from "../utils/paperWriterRenderer.js";
import ExportControls from "../components/ExportControls.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import { useEditHistory } from "../hooks/useEditHistory.js";
import { useBeforeUnload } from "../hooks/useBeforeUnload.js";

export default function PaperWriterCreator() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const canvasRefs = useRef([]);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("paperwriter");

  useBeforeUnload(isDirty);

  useEffect(() => {
    if (text) {
      setIsDirty(true);
    }
  }, [text]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const fontPath = `${import.meta.env.BASE_URL}fonts/IndieFlower.ttf`;
      const templatePath = `${import.meta.env.BASE_URL}images/before.jpg`;
      const canvases = await renderPaperWriter(text, fontPath, templatePath);

      setPages(canvases);
      setCurrentPage(0);
      canvasRefs.current = canvases;

      setHasGenerated(true);
      setIsDirty(false);

      saveEntry({
        text: text.slice(0, 100) + (text.length > 100 ? "..." : ""),
        pageCount: canvases.length,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate pages. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestore = (entry) => {
    setText(entry.state.text || "");
    setHasGenerated(false);
  };

  const handleDownloadAll = async () => {
    if (pages.length === 0) return;

    for (let i = 0; i < pages.length; i++) {
      const canvas = pages[i];
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `handwritten_page_${i + 1}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium no-underline transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary-500)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-secondary)")
          }
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onDelete={deleteEntry}
          onClear={clearHistory}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Paper Writer Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Convert text to handwritten-style paper pages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Text input */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Your Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here... It will be automatically split into pages (25 lines per page)."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none focus:outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary-500)";
                e.target.style.boxShadow = "0 0 0 3px rgba(92, 124, 250, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
            <p
              className="text-xs mt-2 m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              {text.length} characters
            </p>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-700)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--color-primary-600)";
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Create Image
              </>
            )}
          </button>

          {/* Page info and download */}
          {hasGenerated && pages.length > 0 && (
            <div
              className="p-4 rounded-xl animate-fade-in"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText
                  size={18}
                  style={{ color: "var(--text-secondary)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {pages.length} page{pages.length !== 1 ? "s" : ""} generated
                </span>
              </div>

              {pages.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary-600)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-secondary)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                >
                  <Download size={16} />
                  Download All Pages
                </button>
              )}
            </div>
          )}

          {/* Export controls */}
          {hasGenerated && pages.length > 0 && (
            <div
              className="pt-4 border-t animate-fade-in"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Export Current Page
              </p>
              <ExportControls
                canvasRef={{ current: pages[currentPage] }}
                filename={`handwritten_page_${currentPage + 1}`}
                disabled={!hasGenerated}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-sm font-medium m-0"
              style={{ color: "var(--text-secondary)" }}
            >
              Preview
            </p>
            {hasGenerated && pages.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg transition-all border-none cursor-pointer"
                  style={{
                    backgroundColor:
                      currentPage === 0
                        ? "var(--bg-tertiary)"
                        : "var(--color-primary-600)",
                    color: currentPage === 0 ? "var(--text-tertiary)" : "#fff",
                    opacity: currentPage === 0 ? 0.5 : 1,
                  }}
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currentPage + 1} / {pages.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(pages.length - 1, currentPage + 1))
                  }
                  disabled={currentPage === pages.length - 1}
                  className="p-1.5 rounded-lg transition-all border-none cursor-pointer"
                  style={{
                    backgroundColor:
                      currentPage === pages.length - 1
                        ? "var(--bg-tertiary)"
                        : "var(--color-primary-600)",
                    color:
                      currentPage === pages.length - 1
                        ? "var(--text-tertiary)"
                        : "#fff",
                    opacity: currentPage === pages.length - 1 ? 0.5 : 1,
                  }}
                  title="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          <div
            className="rounded-xl border overflow-hidden relative"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {hasGenerated && pages[currentPage] ? (
              <canvas
                ref={(el) => {
                  if (el && pages[currentPage]) {
                    const ctx = el.getContext("2d");
                    el.width = pages[currentPage].width;
                    el.height = pages[currentPage].height;
                    ctx.drawImage(pages[currentPage], 0, 0);
                  }
                }}
                className="w-full h-auto block"
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
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
          </div>

          {hasGenerated && pages.length > 0 && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Text automatically split into {pages.length} page
              {pages.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
