import { FileText, Loader2 } from "lucide-react";

export default function OcrTextEditorPane({
  hasImage,
  isProcessing,
  ocrText,
  onTextChange,
  progress,
  statusText,
  wordCount,
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
        className="px-4 py-3 border-b flex items-center justify-between gap-3"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <div>
          <p
            className="text-sm font-medium m-0"
            style={{ color: "var(--text-secondary)" }}
          >
            OCR Result
          </p>
          <p
            className="text-xs mt-1 mb-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            Edit the recognized text before copying or exporting it.
          </p>
        </div>

        <div className="text-right">
          <p
            className="text-xs font-medium m-0"
            style={{ color: "var(--text-secondary)" }}
          >
            {wordCount} words
          </p>
          {isProcessing ? (
            <p
              className="text-[11px] mt-1 mb-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              {progress}%
            </p>
          ) : null}
        </div>
      </div>

      <div
        className="relative p-4 min-h-[320px]"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <textarea
          value={ocrText}
          onChange={(event) => onTextChange(event.target.value)}
          disabled={!hasImage || (isProcessing && !ocrText)}
          placeholder={
            hasImage
              ? "Recognized text will appear here..."
              : "Upload an image to extract text."
          }
          className="w-full min-h-[288px] resize-none rounded-lg border outline-none px-3 py-3 text-sm leading-6"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
          }}
        />

        {!ocrText && !isProcessing && !hasImage ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <FileText
              size={42}
              className="mb-3 opacity-40"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p
              className="text-sm m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              OCR output appears here after you upload an image.
            </p>
          </div>
        ) : null}

        {isProcessing ? (
          <div
            className="absolute inset-x-4 bottom-4 rounded-lg border px-3 py-2 flex items-center gap-2"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "rgba(255,255,255,0.92)",
            }}
          >
            <Loader2
              size={14}
              className="animate-spin"
              style={{ color: "var(--color-primary-600)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {statusText} {progress ? `(${progress}%)` : ""}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
