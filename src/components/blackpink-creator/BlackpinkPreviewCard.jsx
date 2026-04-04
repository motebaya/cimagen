import { Loader2, Type } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

export default function BlackpinkPreviewCard({
  hasContent,
  isRendering,
  previewCanvasRef,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <CreatorPreviewHeader title="Preview" />
      {hasContent ? (
        <canvas ref={previewCanvasRef} className="w-full h-auto block" />
      ) : (
        <div
          className="flex flex-col items-center justify-center py-24"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <Type
            size={48}
            style={{ color: "var(--text-tertiary)" }}
            className="mb-3 opacity-40"
          />
          <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
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
      {hasContent && (
        <div
          className="px-4 py-3 border-t"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-tertiary)",
          }}
        >
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            Preview updates automatically as you type
          </p>
        </div>
      )}
    </div>
  );
}
