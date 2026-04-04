import { Loader2, Palette } from "lucide-react";
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

export default function SvgPreviewCard({
  fileInputRef,
  hasImage,
  imageFilename,
  inputAccept,
  isDragging,
  isProcessing,
  svgOutput,
  onImageInputChange,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
  onRemoveImage,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
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
        fileLabel={hasImage ? imageFilename : "svg-preview"}
        hasReplace={hasImage}
        onOpenPicker={onOpenImagePicker}
        onRemove={onRemoveImage}
      />

      {svgOutput ? (
        <div className="p-8" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div
            dangerouslySetInnerHTML={{ __html: svgOutput }}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenImagePicker}
          className="w-full flex flex-col items-center justify-center py-24 border-none cursor-pointer"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "inherit" }}
        >
          {hasImage && isProcessing ? (
            <>
              <Loader2
                size={24}
                className="animate-spin mb-3"
                style={{ color: "var(--text-tertiary)" }}
              />
              <p
                className="text-sm m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                Converting to SVG...
              </p>
            </>
          ) : (
            <>
              <Palette
                size={48}
                style={{ color: "var(--text-tertiary)" }}
                className="mb-3 opacity-40"
              />
              <p
                className="text-sm m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                Upload an image to see preview
              </p>
            </>
          )}
        </button>
      )}
    </div>
  );
}
