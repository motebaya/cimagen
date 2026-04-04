import { ImageIcon, Loader2 } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

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

export default function WastedPreviewCard({
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isDragging,
  isRendering,
  onImageInputChange,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
  onRemoveImage,
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
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={hiddenInputStyle}
        onChange={onImageInputChange}
      />
      <CreatorPreviewHeader
        fileLabel={hasImage ? imageFilename : "wasted-preview"}
        hasReplace={hasImage}
        onOpenPicker={onOpenImagePicker}
        onRemove={onRemoveImage}
      />
      {hasImage ? (
        <div
          className="p-4 flex justify-center"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <div className="relative w-full max-w-full">
            <canvas
              ref={previewCanvasRef}
              className="w-full h-auto block max-h-[640px] object-contain"
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
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenImagePicker}
          className="w-full flex flex-col items-center justify-center py-24 border-none cursor-pointer"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "inherit" }}
        >
          <ImageIcon
            size={48}
            style={{ color: "var(--text-tertiary)" }}
            className="mb-3 opacity-40"
          />
          <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
            Upload an image to see preview
          </p>
        </button>
      )}
    </div>
  );
}
