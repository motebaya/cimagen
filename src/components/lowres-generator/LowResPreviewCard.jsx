import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import LowResBeforeAfterSlider from "./LowResBeforeAfterSlider.jsx";
import LowResEmptyState from "./LowResEmptyState.jsx";
import LowResPreviewToolbar from "./LowResPreviewToolbar.jsx";

const HIDDEN_INPUT_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function LowResPreviewCard({
  comparisonSlider,
  fileInputRef,
  hasImage,
  hasPreview,
  imageFilename,
  inputAccept,
  isProcessing,
  level,
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
        <LowResEmptyState
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
          <LowResPreviewToolbar
            hasImage={hasImage}
            imageFilename={imageFilename}
            isProcessing={isProcessing}
            level={level}
            onOpenImagePicker={onOpenImagePicker}
            onRemoveImage={onRemoveImage}
          />

          <div
            className="p-4"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            {hasPreview ? (
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
                    maxHeight: "560px",
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
                    style={{ maxHeight: "560px" }}
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

                <LowResBeforeAfterSlider position={comparisonSlider.position} />

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
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-3 min-h-[340px] sm:min-h-[520px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {isProcessing ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <ImageIcon size={32} className="opacity-60" />
                )}
                <p className="text-sm m-0">
                  {isProcessing
                    ? "Generating low-resolution preview..."
                    : "Preview unavailable."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
