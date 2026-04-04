import { Loader2 } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";
import OcrImagePreviewPane from "./OcrImagePreviewPane.jsx";
import OcrTextEditorPane from "./OcrTextEditorPane.jsx";

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

function ResultStatus({ isProcessing, progress }) {
  return (
    <span
      className="hidden sm:inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        color: "var(--text-secondary)",
      }}
    >
      {isProcessing ? <Loader2 size={12} className="animate-spin" /> : null}
      {isProcessing ? `Processing ${progress}%` : "Editable result"}
    </span>
  );
}

export default function OcrResultCard({
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isDragging,
  isProcessing,
  ocrText,
  onDragLeave,
  onDragOver,
  onDrop,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  onTextChange,
  progress,
  statusText,
  wordCount,
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
        right={<ResultStatus isProcessing={isProcessing} progress={progress} />}
        title="Result"
      />

      <div className="p-4" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        <div className="grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-4 items-stretch">
          <OcrImagePreviewPane
            hasImage={hasImage}
            imageFilename={imageFilename}
            imageSrc={imageSrc}
            isDragging={isDragging}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onOpenImagePicker={onOpenImagePicker}
          />

          <OcrTextEditorPane
            hasImage={hasImage}
            isProcessing={isProcessing}
            ocrText={ocrText}
            onTextChange={onTextChange}
            progress={progress}
            statusText={statusText}
            wordCount={wordCount}
          />
        </div>
      </div>
    </div>
  );
}
