import { useState } from "react";
import { ImageIcon, Loader2, ScanFace } from "lucide-react";
import { HIDDEN_INPUT_STYLE } from "../../utils/face-blur/faceBlurConstants.js";
import BeforeAfterComparisonSlider from "./BeforeAfterComparisonSlider.jsx";
import FaceBlurActions from "./FaceBlurActions.jsx";
import FaceBlurEmptyState from "./FaceBlurEmptyState.jsx";

export default function FaceBlurPreviewCard({
  comparisonSlider,
  faces,
  hasImage,
  imageFilename,
  imageInputRef,
  inputAccept,
  isBusy,
  originalCanvasRef,
  processedCanvasRef,
  showBoxes,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  onToggleFace,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [targetedFaceId, setTargetedFaceId] = useState(null);
  const hitPadding = 10;

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

      {!hasImage ? (
        <FaceBlurEmptyState
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
            <FaceBlurActions
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
                  ref={processedCanvasRef}
                  className="block max-w-full h-auto"
                />
              </div>

              <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-slate-800">
                Before
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-white">
                After
              </div>

              {showBoxes &&
                faces.map((face, index) => (
                  <button
                    key={face.id}
                    type="button"
                    title="Click to toggle blur for this face"
                    onMouseEnter={() => setTargetedFaceId(face.id)}
                    onMouseLeave={() =>
                      setTargetedFaceId((current) =>
                        current === face.id ? null : current,
                      )
                    }
                    onFocus={() => setTargetedFaceId(face.id)}
                    onBlur={() =>
                      setTargetedFaceId((current) =>
                        current === face.id ? null : current,
                      )
                    }
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleFace(face.id);
                    }}
                    className="absolute cursor-pointer transition-colors"
                    style={{
                      left: `calc(${face.x * 100}% - ${hitPadding}px)`,
                      top: `calc(${face.y * 100}% - ${hitPadding}px)`,
                      width: `calc(${face.width * 100}% + ${hitPadding * 2}px)`,
                      height: `calc(${face.height * 100}% + ${hitPadding * 2}px)`,
                      minWidth: `${hitPadding * 2 + 20}px`,
                      minHeight: `${hitPadding * 2 + 20}px`,
                      backgroundColor: "transparent",
                      zIndex: targetedFaceId === face.id ? 3 : 2,
                    }}
                  >
                    <span
                      className="absolute px-2 py-0.5 rounded-md text-[11px] font-semibold"
                      style={{
                        top: `${Math.max(0, hitPadding - 24)}px`,
                        left: `${hitPadding}px`,
                        backgroundColor: face.active ? "#38bdf8" : "#ef4444",
                        color: "#fff",
                      }}
                    >
                      {index + 1}
                    </span>

                    <span
                      className="absolute rounded-md border-2"
                      style={{
                        inset: `${hitPadding}px`,
                        borderColor: face.active ? "#38bdf8" : "#ef4444",
                        backgroundColor: face.active
                          ? "rgba(56, 189, 248, 0.14)"
                          : "rgba(239, 68, 68, 0.12)",
                        boxShadow:
                          targetedFaceId === face.id
                            ? face.active
                              ? "0 0 0 3px rgba(56, 189, 248, 0.25)"
                              : "0 0 0 3px rgba(239, 68, 68, 0.2)"
                            : "none",
                      }}
                    />
                  </button>
                ))}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/78 text-white flex items-center gap-2">
                <ScanFace size={12} />
                Drag slider to compare, click a face box to toggle blur
              </div>

              <BeforeAfterComparisonSlider
                position={comparisonSlider.position}
              />

              {isBusy && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(15,23,42,0.16)" }}
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
