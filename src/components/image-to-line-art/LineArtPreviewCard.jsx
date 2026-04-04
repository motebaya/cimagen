import { HIDDEN_INPUT_STYLE } from "../../utils/image-to-line-art/index.js";
import BeforeAfterComparisonSlider from "./BeforeAfterComparisonSlider.jsx";
import LineArtEmptyState from "./LineArtEmptyState.jsx";
import LineArtToolbar from "./LineArtToolbar.jsx";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LineArtPreviewCard({
  comparisonSlider,
  coverage,
  background,
  fileInputRef,
  hasImage,
  imageFilename,
  inputAccept,
  isProcessing,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  originalCanvasRef,
  processedCanvasRef,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const checkerboardStyle = {
    backgroundColor: "#f8fafc",
    backgroundImage:
      "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };
  const showCheckerboardHint = background === "transparent";

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      {!hasImage ? (
        <LineArtEmptyState
          isDragging={isDragging}
          onOpenImagePicker={onOpenImagePicker}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            onFileSelect(event.dataTransfer.files?.[0] || null);
          }}
        />
      ) : (
        <>
          <LineArtToolbar
            coverage={coverage}
            hasImage={hasImage}
            imageFilename={imageFilename}
            onOpenImagePicker={onOpenImagePicker}
            onRemoveImage={onRemoveImage}
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
                style={checkerboardStyle}
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
                  style={{ maxHeight: "520px" }}
                />
              </div>

              {showCheckerboardHint && (
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

              <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-slate-800">
                Before
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-white">
                After
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/78 text-white">
                Drag slider to compare
              </div>

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
