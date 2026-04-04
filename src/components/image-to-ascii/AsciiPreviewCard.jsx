import { HIDDEN_INPUT_STYLE } from "../../utils/image-to-ascii/index.js";
import { Loader2 } from "lucide-react";
import AsciiTerminalHeader from "./AsciiTerminalHeader.jsx";
import AsciiTerminalViewport from "./AsciiTerminalViewport.jsx";

export default function AsciiPreviewCard({
  asciiMeta,
  asciiResult,
  backgroundValue,
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isDragging,
  isProcessing,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onPreviewModeChange,
  onRemoveImage,
  previewMode,
  previewModeOptions,
  settings,
  textColor,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor:
          backgroundValue === "transparent"
            ? "var(--card-bg)"
            : backgroundValue,
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

      <AsciiTerminalHeader
        asciiMeta={asciiMeta}
        hasImage={hasImage}
        imageFilename={imageFilename}
        onOpenImagePicker={onOpenImagePicker}
        onPreviewModeChange={onPreviewModeChange}
        onRemoveImage={onRemoveImage}
        previewMode={previewMode}
        previewModeOptions={previewModeOptions}
      />

      <AsciiTerminalViewport
        asciiResult={asciiResult}
        backgroundValue={backgroundValue}
        imageSrc={imageSrc}
        isDragging={isDragging}
        onDrop={onDrop}
        onOpenImagePicker={onOpenImagePicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        previewMode={previewMode}
        settings={settings}
        textColor={textColor}
      />

      {isProcessing && (
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
  );
}
