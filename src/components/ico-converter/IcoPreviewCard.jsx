import { Crop } from "lucide-react";
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

export default function IcoPreviewCard({
  croppedCanvas,
  fileInputRef,
  hasImage,
  imageFilename,
  imageRef,
  imageSrc,
  inputAccept,
  onDragLeave,
  onDragOver,
  onDrop,
  onImageInputChange,
  onImageLoad,
  onOpenImagePicker,
  onRemoveImage,
  selectedSizes,
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
        fileLabel={hasImage ? imageFilename : "ico-preview"}
        hasReplace={hasImage}
        onOpenPicker={onOpenImagePicker}
        onRemove={onRemoveImage}
      />

      {hasImage ? (
        <div className="p-6" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Uploaded"
            className="hidden"
            onLoad={onImageLoad}
          />
          {croppedCanvas ? (
            <div className="grid grid-cols-3 gap-4">
              {selectedSizes.map((size) => (
                <div key={size} className="text-center">
                  <div
                    style={{
                      width: size > 64 ? 64 : size,
                      height: size > 64 ? 64 : size,
                      backgroundImage:
                        "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                      display: "inline-block",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <canvas
                      ref={(el) => {
                        if (el && croppedCanvas) {
                          const displaySize = size > 64 ? 64 : size;
                          el.width = displaySize;
                          el.height = displaySize;
                          const ctx = el.getContext("2d");
                          ctx.imageSmoothingEnabled = size > 32;
                          ctx.imageSmoothingQuality = "high";
                          ctx.drawImage(
                            croppedCanvas,
                            0,
                            0,
                            displaySize,
                            displaySize,
                          );
                        }
                      }}
                    />
                  </div>
                  <p
                    className="text-xs mt-1 m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {size}×{size}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Crop
                size={48}
                style={{ color: "var(--text-tertiary)" }}
                className="mb-3 opacity-40"
              />
              <p
                className="text-sm m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                Preparing preview…
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenImagePicker}
          className="w-full flex flex-col items-center justify-center py-24 border-none cursor-pointer"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "inherit" }}
        >
          <Crop
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
