import { Loader2 } from "lucide-react";

export default function UpscalerLoadingOverlay({ elapsedLabel, status }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(15,23,42,0.18)" }}
    >
      <div
        className="rounded-xl border px-5 py-4 text-center"
        style={{
          borderColor: "rgba(255,255,255,0.22)",
          backgroundColor: "rgba(15,23,42,0.8)",
          color: "#ffffff",
        }}
      >
        <Loader2 size={22} className="animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium m-0">{status || "Upscaling image"}</p>
        <p className="text-xs mt-1 mb-0 opacity-80">Elapsed: {elapsedLabel}</p>
      </div>
    </div>
  );
}
