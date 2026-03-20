import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { downloadCanvas } from "../utils/exportImage.js";

export default function ExportControls({
  canvasRef,
  filename = "image",
  disabled = false,
}) {
  const [format, setFormat] = useState("png");
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG" },
    { value: "webp", label: "WEBP" },
  ];

  const handleDownload = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const quality = format === "webp" ? 0.4 : 0.92;
      await downloadCanvas(canvasRef.current, filename, format, quality);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex rounded-lg overflow-hidden border"
        style={{ borderColor: "var(--border-color)" }}
      >
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className="px-3 py-2 text-sm font-medium transition-colors cursor-pointer border-none outline-none"
            style={{
              backgroundColor:
                format === f.value
                  ? "var(--color-primary-600)"
                  : "var(--bg-tertiary)",
              color: format === f.value ? "#ffffff" : "var(--text-secondary)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleDownload}
        disabled={disabled || isExporting}
        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-all cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "var(--color-primary-600)" }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled)
            e.currentTarget.style.backgroundColor = "var(--color-primary-700)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-600)";
        }}
      >
        {isExporting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download size={16} />
            Download
          </>
        )}
      </button>
    </div>
  );
}
