import { HIDDEN_INPUT_STYLE } from "../../utils/image-to-pixel/index.js";
import { Loader2 } from "lucide-react";
import BeforeAfterComparisonSlider from "./BeforeAfterComparisonSlider.jsx";
import PixelEmptyState from "./PixelEmptyState.jsx";
import PixelToolbar from "./PixelToolbar.jsx";

export default function PixelPreviewCard({
  comparisonSlider,
  fileInputRef,
  background,
  hasImage,
  imageFilename,
  inputAccept,
  isDragging,
  isProcessing,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  originalCanvasRef,
  pixelArt,
  previewMeta,
  processedCanvasRef,
}) {
  const checkerboardStyle = {
    backgroundColor: "#f8fafc",
    backgroundImage:
      "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      {!hasImage ? (
        <PixelEmptyState
          isDragging={isDragging}
          onDrop={onDrop}
          onOpenImagePicker={onOpenImagePicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      ) : (
        <>
          <PixelToolbar
            hasImage={hasImage}
            imageFilename={imageFilename}
            onOpenImagePicker={onOpenImagePicker}
            onRemoveImage={onRemoveImage}
            pixelMeta={pixelArt}
          />

          <div
            className="p-4"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div
              ref={comparisonSlider.containerRef}
              className="relative block w-fit max-w-full mx-auto select-none"
              style={{ touchAction: "none" }}
              {...comparisonSlider.sliderHandlers}
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={
                  background === "transparent"
                    ? checkerboardStyle
                    : { backgroundColor: background }
                }
              />
              <canvas
                ref={originalCanvasRef}
                className="block relative max-w-full h-auto"
                style={{
                  clipPath: `inset(0 ${100 - comparisonSlider.position}% 0 0)`,
                  maxHeight: "520px",
                }}
              />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `inset(0 0 0 ${comparisonSlider.position}%)`,
                }}
              >
                <canvas
                  ref={processedCanvasRef}
                  className="block max-w-full h-auto"
                  style={{ maxHeight: "520px", imageRendering: "pixelated" }}
                />
              </div>

              <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-slate-800">
                Before
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-white">
                After
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/78 text-white">
                Drag slider to compare
              </div>

              {background === "transparent" && (
                <div
                  className="absolute bottom-12 right-3 px-2 py-1 rounded-md text-[11px] font-medium"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.72)",
                    color: "#ffffff",
                  }}
                >
                  Transparent background visible on checkerboard
                </div>
              )}

              <BeforeAfterComparisonSlider
                position={comparisonSlider.position}
              />

              {isProcessing && (
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
        </>
      )}
    </div>
  );
}
