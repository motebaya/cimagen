import PdfPageQueueItem from "./PdfPageQueueItem.jsx";

export default function PdfPageQueue({
  draggedIndex,
  images,
  onDragEnd,
  onDragEnterPage,
  onRemoveImage,
  onRotateImage,
  onStartDragPage,
}) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Page Order
        </p>
        <p
          className="text-xs mt-1 mb-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Drag to reorder pages before export.
        </p>
      </div>

      <div className="p-3 space-y-2 max-h-[680px] overflow-y-auto">
        {images.map((image, index) => (
          <PdfPageQueueItem
            key={image.id}
            image={image}
            index={index}
            isDragging={draggedIndex === index}
            onDragEnd={onDragEnd}
            onDragEnter={onDragEnterPage}
            onDragStart={onStartDragPage}
            onRemove={onRemoveImage}
            onRotate={onRotateImage}
          />
        ))}
      </div>
    </div>
  );
}
