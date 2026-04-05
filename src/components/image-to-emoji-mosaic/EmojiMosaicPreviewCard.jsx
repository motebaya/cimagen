import { HIDDEN_INPUT_STYLE } from "../../utils/image-to-emoji-mosaic/index.js";
import { Loader2 } from "lucide-react";
import EmojiMosaicPreviewHeader from "./EmojiMosaicPreviewHeader.jsx";
import EmojiMosaicViewport from "./EmojiMosaicViewport.jsx";
import { useState } from "react";

export default function EmojiMosaicPreviewCard({
  background,
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isProcessing,
  mosaic,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onPreviewModeChange,
  onRemoveImage,
  previewCanvas,
  previewMode,
  previewModeOptions,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const transparentCheckerboard = {
    backgroundColor: "#f8fafc",
    backgroundImage:
      "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };

  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        onFileSelect(event.dataTransfer.files?.[0] || null);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      <EmojiMosaicPreviewHeader
        hasImage={hasImage}
        imageFilename={imageFilename}
        mosaic={mosaic}
        onOpenImagePicker={onOpenImagePicker}
        onPreviewModeChange={onPreviewModeChange}
        onRemoveImage={onRemoveImage}
        previewMode={previewMode}
        previewModeOptions={previewModeOptions}
      />

        <EmojiMosaicViewport
          background={background}
          imageSrc={imageSrc}
          isDragging={isDragging}
          mosaic={mosaic}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          onFileSelect(event.dataTransfer.files?.[0] || null);
        }}
        onOpenImagePicker={onOpenImagePicker}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        previewCanvas={previewCanvas}
        previewMode={previewMode}
        transparentCheckerboard={transparentCheckerboard}
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
