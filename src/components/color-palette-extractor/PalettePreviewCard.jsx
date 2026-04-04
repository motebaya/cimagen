import { HIDDEN_INPUT_STYLE } from "../../utils/color-palette-extractor/index.js";
import PaletteEmptyState from "./PaletteEmptyState.jsx";
import PaletteImageOverlay from "./PaletteImageOverlay.jsx";
import PaletteResultCard from "./PaletteResultCard.jsx";
import PaletteToolbar from "./PaletteToolbar.jsx";
import { Loader2 } from "lucide-react";

export default function PalettePreviewCard({
  copiedColorId,
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
  onRemoveImage,
  onSelectColor,
  onCopyColor,
  overlay,
  result,
  selectedColor,
  selectedColorId,
  showPercentages,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
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

      {!hasImage ? (
        <PaletteEmptyState
          isDragging={isDragging}
          onDrop={onDrop}
          onOpenImagePicker={onOpenImagePicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      ) : (
        <>
          <PaletteToolbar
            hasImage={hasImage}
            imageFilename={imageFilename}
            onOpenImagePicker={onOpenImagePicker}
            onRemoveImage={onRemoveImage}
            sampleCount={result?.sampleCount}
          />

          <div
            className="p-4"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <div className="relative w-fit max-w-full mx-auto">
              <img
                src={imageSrc}
                alt="Palette source"
                className="block max-w-full max-h-[520px] object-contain"
              />
              <PaletteImageOverlay
                overlay={overlay}
                selectedColor={selectedColor}
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
          </div>

          {result && (
            <PaletteResultCard
              copiedColorId={copiedColorId}
              palette={result.palette}
              selectedColorId={selectedColorId}
              onCopyColor={onCopyColor}
              onSelectColor={onSelectColor}
              showPercentages={showPercentages}
            />
          )}
        </>
      )}
    </div>
  );
}
