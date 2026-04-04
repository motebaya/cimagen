import { FlipHorizontal, FlipVertical, Move, RotateCcw } from "lucide-react";

export default function CropToolbar({
  flipX,
  flipY,
  onCenterImage,
  onResetTransforms,
  onToggleFlipX,
  onToggleFlipY,
}) {
  const buttonStyle = {
    borderColor: "var(--border-color)",
    backgroundColor: "var(--bg-tertiary)",
    color: "var(--text-secondary)",
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onToggleFlipX}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
        style={{
          ...buttonStyle,
          borderColor: flipX
            ? "var(--color-primary-500)"
            : buttonStyle.borderColor,
        }}
      >
        <FlipHorizontal size={16} />
        Flip H
      </button>

      <button
        type="button"
        onClick={onToggleFlipY}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
        style={{
          ...buttonStyle,
          borderColor: flipY
            ? "var(--color-primary-500)"
            : buttonStyle.borderColor,
        }}
      >
        <FlipVertical size={16} />
        Flip V
      </button>

      <button
        type="button"
        onClick={onCenterImage}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
        style={buttonStyle}
      >
        <Move size={16} />
        Center
      </button>

      <button
        type="button"
        onClick={onResetTransforms}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
        style={buttonStyle}
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}
