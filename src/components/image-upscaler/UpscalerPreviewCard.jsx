import { useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { HIDDEN_INPUT_STYLE } from "../../utils/image-upscaler/index.js";
import BeforeAfterComparisonSlider from "./BeforeAfterComparisonSlider.jsx";
import UpscalerEmptyState from "./UpscalerEmptyState.jsx";
import UpscalerLoadingOverlay from "./UpscalerLoadingOverlay.jsx";

export default function UpscalerPreviewCard({
  comparisonSlider,
  fileInputRef,
  hasImage,
  imageFilename,
  inputAccept,
  isBusy,
  loadingElapsed,
  loadingStatus,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  originalCanvasRef,
  processedCanvasRef,
}) {
  const [isDragging, setIsDragging] = useState(false);

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
        <UpscalerEmptyState
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
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border-b"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-tertiary)",
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ImageIcon size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                className="text-sm truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {imageFilename}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenImagePicker}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-secondary)",
                }}
              >
                <Upload size={14} />
                Replace
              </button>
              <button
                type="button"
                onClick={onRemoveImage}
                className="p-1 rounded-md cursor-pointer border-none"
                style={{
                  color: "var(--text-tertiary)",
                  backgroundColor: "transparent",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

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

              {isBusy && (
                <UpscalerLoadingOverlay
                  elapsedLabel={loadingElapsed}
                  status={loadingStatus}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
