import OcrUploadEmptyState from "./OcrUploadEmptyState.jsx";

export default function OcrImagePreviewPane({
  hasImage,
  imageFilename,
  imageSrc,
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
}) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {hasImage ? (
        <div
          className="p-4 flex items-center justify-center min-h-[320px]"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <img
            src={imageSrc}
            alt={imageFilename}
            className="block max-w-full max-h-[420px] h-auto object-contain"
          />
        </div>
      ) : (
        <OcrUploadEmptyState
          isDragging={isDragging}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onOpenImagePicker={onOpenImagePicker}
        />
      )}
    </div>
  );
}
