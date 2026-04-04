import { Loader2 } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";
import MetadataBasicInfoPanel from "./MetadataBasicInfoPanel.jsx";
import MetadataPreviewEmptyState from "./MetadataPreviewEmptyState.jsx";

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

function ProcessingBadge({ isExtracting, methodLabel }) {
  return (
    <span
      className="hidden sm:inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        color: "var(--text-secondary)",
      }}
    >
      {isExtracting ? <Loader2 size={12} className="animate-spin" /> : null}
      {isExtracting ? `Reading with ${methodLabel}` : `Live ${methodLabel}`}
    </span>
  );
}

export default function MetadataPreviewCard({
  badges,
  basicDetails,
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isDragging,
  isExtracting,
  methodLabel,
  onDragLeave,
  onDragOver,
  onDrop,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
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
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      <CreatorPreviewHeader
        fileLabel={hasImage ? imageFilename : undefined}
        hasReplace={hasImage}
        onOpenPicker={onOpenImagePicker}
        onRemove={onRemoveImage}
        right={
          <ProcessingBadge
            isExtracting={isExtracting}
            methodLabel={methodLabel}
          />
        }
        title="Image Preview"
      />

      {hasImage ? (
        <div className="p-4" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <div className="grid grid-cols-[minmax(0,160px)_minmax(0,1fr)] sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4 items-start">
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageFilename}
                  className="block w-full h-auto max-h-[320px] object-contain"
                />
              ) : (
                <div className="flex items-center justify-center min-h-[180px]">
                  <Loader2
                    size={24}
                    className="animate-spin"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </div>
              )}
            </div>

            <MetadataBasicInfoPanel badges={badges} details={basicDetails} />
          </div>
        </div>
      ) : (
        <MetadataPreviewEmptyState
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
