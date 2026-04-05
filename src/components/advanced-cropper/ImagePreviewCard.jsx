import { useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import CreatorUploadDropzone from "../creator/CreatorUploadDropzone.jsx";

const hiddenInputStyle = {
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

export default function ImagePreviewCard({
  fileInputRef,
  imageFilename,
  imageSrc,
  inputAccept,
  isProcessing,
  previewCanvasRef,
  previewFrameRef,
  onFileInputChange,
  onFileSelect,
  onOpenImagePicker,
  onRemoveImage,
  interactionHandlers,
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      ref={previewFrameRef}
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={hiddenInputStyle}
        onChange={onFileInputChange}
      />

      {!imageSrc ? (
        <CreatorUploadDropzone
          isDragging={isDragging}
          desktopMinHeightClass="sm:min-h-[560px]"
          dragIcon={Upload}
          idleIcon={Upload}
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
          onOpenImagePicker={onOpenImagePicker}
          title="Click to upload or drag and drop"
          description="PNG, JPG, WEBP supported (max 20MB)"
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
            className="relative p-4 flex justify-center"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div
              className="relative inline-block max-w-full"
              style={{ touchAction: "none" }}
              onMouseDown={interactionHandlers.onMouseDown}
              onMouseMove={interactionHandlers.onMouseMove}
              onMouseUp={interactionHandlers.onMouseUp}
              onMouseLeave={interactionHandlers.onMouseLeave}
              onWheel={interactionHandlers.onWheel}
              onTouchStart={interactionHandlers.onTouchStart}
              onTouchMove={interactionHandlers.onTouchMove}
              onTouchEnd={interactionHandlers.onTouchEnd}
            >
              <canvas
                ref={previewCanvasRef}
                className="block max-w-full h-auto cursor-grab active:cursor-grabbing"
              />

              {isProcessing && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(248, 250, 252, 0.4)" }}
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
