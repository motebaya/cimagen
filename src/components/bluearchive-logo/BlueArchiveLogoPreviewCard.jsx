import { Loader2, Sparkles } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

const checkerboardStyle = {
  backgroundColor: "#f8fafc",
  backgroundImage:
    "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export default function BlueArchiveLogoPreviewCard({
  dimensions,
  isRendering,
  previewCanvasRef,
  transparentMode,
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden relative"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <CreatorPreviewHeader title="Preview" />

      <div
        className="p-4"
        style={
          transparentMode
            ? checkerboardStyle
            : { backgroundColor: "var(--bg-tertiary)" }
        }
      >
        <div className="relative w-full aspect-[900/250] sm:aspect-auto sm:h-[250px] overflow-x-auto overflow-y-hidden rounded-lg">
          <div className="h-full min-w-full flex items-center justify-center">
            <canvas
              ref={previewCanvasRef}
              className={`block h-full w-auto max-w-none shrink-0 ${dimensions.width ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {!dimensions.width ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center py-20">
              <Sparkles
                size={44}
                className="mb-3 opacity-40"
                style={{ color: "var(--text-tertiary)" }}
              />
              <p
                className="text-sm m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                Generating Blue Archive logo preview...
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {isRendering ? (
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
      ) : null}
    </div>
  );
}
