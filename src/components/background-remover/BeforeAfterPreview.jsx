import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { HIDDEN_INPUT_STYLE } from "../../utils/background-remover/backgroundRemovalConstants.js";
import BackgroundRemoverActions from "./BackgroundRemoverActions.jsx";
import BackgroundRemoverEmptyState from "./BackgroundRemoverEmptyState.jsx";
import ImageComparisonSlider from "./ImageComparisonSlider.jsx";

export default function BeforeAfterPreview({
  inputAccept,
  imageInputRef,
  imageFilename,
  imageSrc,
  isProcessing,
  originalCanvasRef,
  resultCanvasRef,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  comparisonSlider,
}) {
  const [isDragging, setIsDragging] = useState(false);
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
    >
      <input
        ref={imageInputRef}
        type="file"
        accept={inputAccept}
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      {!imageSrc ? (
        <BackgroundRemoverEmptyState
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

            <BackgroundRemoverActions
              onOpenImagePicker={onOpenImagePicker}
              onRemoveImage={onRemoveImage}
            />
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
              <div
                className="absolute inset-0 rounded-lg"
                style={checkerboardStyle}
              />

              <canvas
                ref={originalCanvasRef}
                className="block relative max-w-full h-auto"
                style={{
                  clipPath: `inset(0 ${100 - comparisonSlider.position}% 0 0)`,
                }}
              />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `inset(0 0 0 ${comparisonSlider.position}%)`,
                }}
              >
                <canvas
                  ref={resultCanvasRef}
                  className="block max-w-full h-auto"
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

              <ImageComparisonSlider position={comparisonSlider.position} />

              {isProcessing && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(15,23,42,0.14)" }}
                >
                  <Loader2
                    size={24}
                    className="animate-spin"
                    style={{ color: "#0f172a" }}
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
