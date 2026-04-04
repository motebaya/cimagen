import { Loader2 } from "lucide-react";
import PdfPageQueue from "./PdfPageQueue.jsx";
import PdfPreviewPane from "./PdfPreviewPane.jsx";
import PdfResultToolbar from "./PdfResultToolbar.jsx";
import PdfUploadEmptyState from "./PdfUploadEmptyState.jsx";

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

export default function PdfPreviewCard({
  draggedIndex,
  fileInputRef,
  hasImages,
  images,
  inputAccept,
  isDragging,
  isProcessing,
  onAddImages,
  onClearAll,
  onDragEnd,
  onDragEnterPage,
  onDragLeave,
  onDragOver,
  onDrop,
  onFilesInputChange,
  onRemoveImage,
  onRotateImage,
  onStartDragPage,
  previewUrls,
  queueCount,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        multiple
        style={HIDDEN_INPUT_STYLE}
        onChange={onFilesInputChange}
      />

      {hasImages ? (
        <>
          <PdfResultToolbar
            count={queueCount}
            isProcessing={isProcessing}
            onAddImages={onAddImages}
            onClearAll={onClearAll}
          />

          <div
            className="p-4"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4 items-start">
              <PdfPageQueue
                draggedIndex={draggedIndex}
                images={images}
                onDragEnd={onDragEnd}
                onDragEnterPage={onDragEnterPage}
                onRemoveImage={onRemoveImage}
                onRotateImage={onRotateImage}
                onStartDragPage={onStartDragPage}
              />

              <div className="relative">
                <PdfPreviewPane previewUrls={previewUrls} />

                {isProcessing ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(15, 23, 42, 0.18)" }}
                  >
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "#fff" }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <PdfUploadEmptyState
          isDragging={isDragging}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onOpenImagePicker={onAddImages}
        />
      )}
    </div>
  );
}
