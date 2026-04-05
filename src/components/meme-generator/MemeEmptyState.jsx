import { ImageIcon } from "lucide-react";

export default function MemeEmptyState() {
  return (
    <div
      className="aspect-square sm:aspect-auto min-h-0 sm:min-h-[560px] rounded-xl border-2 border-dashed flex items-center justify-center px-6 text-center"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <div className="max-w-sm mx-auto">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <ImageIcon size={22} style={{ color: "var(--text-tertiary)" }} />
        </div>
        <p
          className="text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Select a meme template to start building your layout
        </p>
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Choose one of the built-in memes or upload your own image to start
          editing. The layers panel appears after a template is chosen.
        </p>
      </div>
    </div>
  );
}
