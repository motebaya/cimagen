import { Loader2 } from "lucide-react";
import HtmlEmptyState from "./HtmlEmptyState.jsx";

export default function HtmlPreviewCard({
  canvasRef,
  capturedCanvas,
  isRendering,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        minHeight: "540px",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      {capturedCanvas ? (
        <div className="overflow-auto max-h-[780px] px-4 py-5 flex justify-center">
          <canvas ref={canvasRef} className="block max-w-full h-auto" />
        </div>
      ) : (
        <HtmlEmptyState />
      )}

      {isRendering && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.16)" }}
        >
          <Loader2
            size={24}
            className="animate-spin"
            style={{ color: "#fff" }}
          />
        </div>
      )}
    </div>
  );
}
