import { Download, Loader2, Plus, Sticker, Upload } from "lucide-react";
import { visuallyHiddenInputStyle } from "../../utils/meme-generator/editorHelpers.js";

const EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export default function MemeToolbar({
  inputAccept,
  layerImageInputRef,
  isExporting,
  onAddTextLayer,
  onAddStickerLayer,
  onExport,
  onLayerInputChange,
  onOpenLayerImagePicker,
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAddTextLayer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          <Plus size={16} />
          Add Text Layer
        </button>

        <button
          type="button"
          onClick={onAddStickerLayer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          <Sticker size={16} />
          Add Sticker
        </button>

        <button
          type="button"
          onClick={onOpenLayerImagePicker}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
        >
          <Upload size={16} />
          Upload Image Layer
        </button>

        {EXPORT_FORMATS.map(([format, label]) => (
          <button
            key={format}
            type="button"
            onClick={() => onExport(format)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {label}
          </button>
        ))}
      </div>

      <input
        ref={layerImageInputRef}
        type="file"
        accept={inputAccept}
        style={visuallyHiddenInputStyle}
        onChange={onLayerInputChange}
      />
    </div>
  );
}
