import EmojiEmptyState from "./EmojiEmptyState.jsx";

export default function EmojiMosaicViewport({
  background,
  imageSrc,
  mosaic,
  onDrop,
  onOpenImagePicker,
  onDragOver,
  onDragLeave,
  previewCanvas,
  previewMode,
  transparentCheckerboard,
}) {
  if (!imageSrc) {
    return (
      <EmojiEmptyState
        isDragging={false}
        onDrop={onDrop}
        onOpenImagePicker={onOpenImagePicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      />
    );
  }

  if (previewMode === "original") {
    return (
      <div className="flex items-center justify-center min-h-[520px] p-6">
        <img
          src={imageSrc}
          alt="Original reference"
          className="block max-w-full max-h-[520px] object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className="relative max-h-[620px] overflow-auto px-5 py-5 flex justify-center"
      style={
        background === "transparent"
          ? transparentCheckerboard
          : { backgroundColor: background }
      }
    >
      {previewCanvas ? (
        <canvas
          width={previewCanvas.width}
          height={previewCanvas.height}
          ref={(node) => {
            if (!node) return;
            const context = node.getContext("2d");
            context.clearRect(0, 0, node.width, node.height);
            context.drawImage(previewCanvas, 0, 0);
          }}
          className="block max-w-full h-auto"
          style={{ imageRendering: "auto" }}
        />
      ) : (
        <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Generating emoji mosaic...
        </div>
      )}
      {background === "transparent" && mosaic && (
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[11px] font-medium"
          style={{ backgroundColor: "rgba(15,23,42,0.72)", color: "#ffffff" }}
        >
          Transparent background visible on checkerboard
        </div>
      )}
    </div>
  );
}
