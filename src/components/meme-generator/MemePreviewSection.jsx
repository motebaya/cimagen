import MemeCanvas from "./MemeCanvas.jsx";
import MemeEmptyState from "./MemeEmptyState.jsx";

export default function MemePreviewSection({
  hasTemplate,
  previewFrameRef,
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
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div ref={previewFrameRef} className="w-full">
        {hasTemplate ? (
          <MemeCanvas
            previewCanvasRef={previewCanvasRef}
            rendered={rendered}
            selectedBound={selectedBound}
            selectedPreview={selectedPreview}
            selectionVisible={selectionVisible}
            selectedLayerLocked={selectedLayerLocked}
            isRendering={isRendering}
            onSelectionTransform={onSelectionTransform}
            onPreviewPointerDown={onPreviewPointerDown}
          />
        ) : (
          <MemeEmptyState />
        )}
      </div>
    </div>
  );
}
