import { ImageIcon } from "lucide-react";

export default function AnsiEmptyState({ onOpenImagePicker }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[520px] px-8">
      <button
        type="button"
        onClick={onOpenImagePicker}
        className="w-full max-w-md rounded-xl border-2 border-dashed px-6 py-16 text-center cursor-pointer"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "rgba(255,255,255,0.02)",
          color: "inherit",
        }}
      >
        <ImageIcon size={44} className="mx-auto mb-4 opacity-50" />
        <p className="text-sm font-medium m-0">
          Upload an image to render ANSI art
        </p>
        <p className="text-xs mt-2 mb-0 opacity-75">
          Switch between the terminal output and original image in the same
          preview window.
        </p>
      </button>
    </div>
  );
}
