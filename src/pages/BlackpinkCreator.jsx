import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, AlertCircle, Type } from "lucide-react";
import { renderBlackpink } from "../utils/blackpinkRenderer.js";
import ExportControls from "../components/ExportControls.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import { useEditHistory } from "../hooks/useEditHistory.js";
import { useBeforeUnload } from "../hooks/useBeforeUnload.js";

export default function BlackpinkCreator() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("blackpink");

  useBeforeUnload(isDirty);

  const updatePreview = useCallback(() => {
    if (!previewCanvasRef.current || !text.trim()) return;
    setPreviewLoading(true);
    const fontPath = `${import.meta.env.BASE_URL}fonts/blackpink.otf`;
    renderBlackpink(text, fontPath)
      .then((canvas) => {
        if (previewCanvasRef.current) {
          const ctx = previewCanvasRef.current.getContext("2d");
          previewCanvasRef.current.width = canvas.width;
          previewCanvasRef.current.height = canvas.height;
          ctx.drawImage(canvas, 0, 0);
        }
      })
      .catch((err) => console.error("Preview error:", err))
      .finally(() => setPreviewLoading(false));
  }, [text]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(updatePreview, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [updatePreview]);

  useEffect(() => {
    if (text) setIsDirty(true);
  }, [text]);

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const fontPath = `${import.meta.env.BASE_URL}fonts/blackpink.otf`;
      const canvas = await renderBlackpink(text, fontPath);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = canvas.width;
        canvasRef.current.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
      }

      setHasGenerated(true);
      setIsDirty(false);

      const previewDataUrl = canvasRef.current.toDataURL("image/webp", 0.2);
      saveEntry({ text }, previewDataUrl);
    } catch (err) {
      console.error("Generation failed:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestore = (entry) => {
    setText(entry.state.text || "");
    setHasGenerated(false);
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
          Blackpink Text Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Create pink text on black background with border effect
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
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isGenerating) handleGenerate();
              }}
            />
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

          {/* Export controls */}
          {hasGenerated && (
            <div
              className="pt-4 border-t animate-fade-in"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Export
              </p>
              <ExportControls
                canvasRef={canvasRef}
                filename={`blackpink_${text.slice(0, 20)}`}
                disabled={!hasGenerated}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <p
            className="text-sm font-medium mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Preview
          </p>
          <div
            className="rounded-xl border overflow-hidden relative"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {text.trim() ? (
              <>
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-auto block"
                />
                {previewLoading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "#fff" }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <Type
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

          {/* Hidden canvas for high-quality export */}
          <canvas ref={canvasRef} className="hidden" />

          {text.trim() && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Preview updates automatically as you type
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
