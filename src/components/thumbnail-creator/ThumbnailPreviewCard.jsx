import { Loader2 } from "lucide-react";
import { HEIGHT, WIDTH } from "../../utils/thumbnailRenderer.js";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

export default function ThumbnailPreviewCard({
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
      <canvas
        ref={previewCanvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="w-full h-auto block"
        style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}
      />
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
      <div
        className="px-4 py-3 border-t"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Output: {WIDTH} x {HEIGHT}px
        </p>
      </div>
    </div>
  );
}
