import { Loader2 } from "lucide-react";
import WatermarkSelectionOverlay from "../watermark/WatermarkSelectionOverlay.jsx";

export default function MemeCanvas({
  previewCanvasRef,
  rendered,
  selectedBound,
  selectedPreview,
  selectionVisible,
  selectedLayerLocked,
  isRendering,
  onSelectionTransform,
  onPreviewPointerDown,
}) {
  return (
    <div className="relative flex justify-center">
      <div className="relative inline-block mx-auto">
        <canvas
          ref={previewCanvasRef}
          className="block relative h-auto max-w-full"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
        <WatermarkSelectionOverlay
          width={rendered?.canvas?.width || 0}
          height={rendered?.canvas?.height || 0}
          selectedBound={selectedBound}
          selectedPreview={selectedPreview}
          guides={null}
          visible={selectionVisible && !selectedLayerLocked}
          showGrid={false}
          onTransform={onSelectionTransform}
          onBackgroundMouseDown={onPreviewPointerDown}
        />
      </div>

      {isRendering && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(15,23,42,0.16)" }}
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
