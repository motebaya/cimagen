import { HIDDEN_INPUT_STYLE } from "../../utils/image-to-ansi-art/ansiConstants.js";
import AnsiTerminalHeader from "./AnsiTerminalHeader.jsx";
import AnsiTerminalViewport from "./AnsiTerminalViewport.jsx";

export default function AnsiPreviewCard({
  ansiResult,
  fileInputRef,
  hasImage,
  imageFilename,
  imageSrc,
  inputAccept,
  isProcessing,
  onFileSelect,
  onImageInputChange,
  onOpenImagePicker,
  onPreviewModeChange,
  onRemoveImage,
  previewMode,
  previewModeOptions,
  settings,
  terminalTheme,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: terminalTheme.background,
        boxShadow: "var(--card-shadow)",
      }}
      onDrop={(event) => {
        event.preventDefault();
        onFileSelect(event.dataTransfer.files?.[0] || null);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={HIDDEN_INPUT_STYLE}
        onChange={onImageInputChange}
      />

      <AnsiTerminalHeader
        hasImage={hasImage}
        imageFilename={imageFilename}
        onOpenImagePicker={onOpenImagePicker}
        onPreviewModeChange={onPreviewModeChange}
        onRemoveImage={onRemoveImage}
        previewMode={previewMode}
        previewModeOptions={previewModeOptions}
      />

      <AnsiTerminalViewport
        ansiResult={ansiResult}
        imageSrc={imageSrc}
        onOpenImagePicker={onOpenImagePicker}
        previewMode={previewMode}
        settings={settings}
        terminalTheme={terminalTheme}
      />

      {isProcessing && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(15,23,42,0.22)" }}
        >
          <div
            className="rounded-lg border px-4 py-3 text-sm font-medium"
            style={{
              borderColor: "rgba(255,255,255,0.16)",
              backgroundColor: "rgba(15,23,42,0.82)",
              color: "#ffffff",
            }}
          >
            Rendering ANSI output...
          </div>
        </div>
      )}
    </div>
  );
}
