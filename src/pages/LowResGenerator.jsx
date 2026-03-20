import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  Loader2,
  Download,
  Sliders,
} from "lucide-react";
import { degradeImage, createComparison } from "../utils/imageDegradation.js";
import { isValidImage, isValidSize } from "../utils/fileValidation.js";

export default function LowResGenerator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceCanvas, setSourceCanvas] = useState(null);
  const [degradedCanvas, setDegradedCanvas] = useState(null);
  const [comparisonCanvas, setComparisonCanvas] = useState(null);

  // Degradation options
  const [level, setLevel] = useState(5);
  const [addJpegArtifacts, setAddJpegArtifacts] = useState(true);
  const [addBlur, setAddBlur] = useState(true);
  const [reduceColors, setReduceColors] = useState(false);
  const [splitPosition, setSplitPosition] = useState(0.5);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const processImage = useCallback(async () => {
    if (!sourceCanvas) return;

    setIsProcessing(true);

    try {
      const degraded = await degradeImage(sourceCanvas, {
        level,
        addJpegArtifacts,
        addBlur,
        reduceColors,
      });

      setDegradedCanvas(degraded);

      const comparison = createComparison(
        sourceCanvas,
        degraded,
        splitPosition,
      );
      setComparisonCanvas(comparison);
    } catch (err) {
      console.error("Degradation error:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceCanvas,
    level,
    addJpegArtifacts,
    addBlur,
    reduceColors,
    splitPosition,
  ]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(processImage, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [processImage]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError(
        "Please select a valid image file (JPEG, PNG, WebP, GIF, BMP, or SVG).",
      );
      return;
    }

    if (!isValidSize(file, 20)) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }

    setError(null);
    setImageFilename(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(e.target.result);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        setSourceCanvas(canvas);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setSourceCanvas(null);
    setDegradedCanvas(null);
    setComparisonCanvas(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!degradedCanvas) return;

    degradedCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lowres_${imageFilename}`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium no-underline transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary-500)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-secondary)")
          }
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Low-Resolution Image Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Simulate realistic low-quality degraded images
        </p>
      </div>

      {error && (
        <div
          className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
          }}
        >
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Upload Image
            </label>

            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                style={{
                  borderColor: isDragging
                    ? "var(--color-primary-500)"
                    : "var(--border-color)",
                  backgroundColor: isDragging
                    ? "rgba(92, 124, 250, 0.05)"
                    : "var(--bg-tertiary)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <Upload size={22} style={{ color: "var(--text-tertiary)" }} />
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-medium m-0"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Click to upload or drag and drop
                  </p>
                  <p
                    className="text-xs mt-1 m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    JPEG, PNG, WebP supported (max 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: "var(--border-color)" }}
              >
                <img src={imageSrc} alt="Uploaded" className="w-full h-auto" />
                <div
                  className="flex items-center justify-between px-3 py-2"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon
                      size={14}
                      style={{ color: "var(--text-tertiary)" }}
                    />
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {imageFilename}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="p-1 rounded-md cursor-pointer border-none transition-colors"
                    style={{
                      color: "var(--text-tertiary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#ef4444")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-tertiary)")
                    }
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {imageSrc && (
            <>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Degradation Level: {level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  1 = Minimal, 100 = Maximum
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addJpegArtifacts}
                    onChange={(e) => setAddJpegArtifacts(e.target.checked)}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Add JPEG artifacts
                  </span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBlur}
                    onChange={(e) => setAddBlur(e.target.checked)}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Add blur
                  </span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reduceColors}
                    onChange={(e) => setReduceColors(e.target.checked)}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Reduce colors
                  </span>
                </label>
              </div>

              <button
                onClick={handleDownload}
                disabled={isProcessing || !degradedCanvas}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-primary-600)" }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary-700)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-primary-600)";
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download Result
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          <p
            className="text-sm font-medium mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Before / After Comparison
          </p>
          <div
            className="rounded-xl border overflow-hidden relative"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {comparisonCanvas ? (
              <div
                style={{ position: "relative", cursor: "ew-resize" }}
                onMouseDown={(e) => {
                  setIsDraggingSlider(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  setSplitPosition(x / rect.width);
                }}
                onMouseMove={(e) => {
                  if (isDraggingSlider) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setSplitPosition(Math.max(0, Math.min(1, x / rect.width)));
                  }
                }}
                onMouseUp={() => setIsDraggingSlider(false)}
                onMouseLeave={() => setIsDraggingSlider(false)}
              >
                <canvas
                  ref={(el) => {
                    if (el && comparisonCanvas) {
                      el.width = comparisonCanvas.width;
                      el.height = comparisonCanvas.height;
                      const ctx = el.getContext("2d");
                      ctx.drawImage(comparisonCanvas, 0, 0);
                    }
                  }}
                  className="w-full h-auto block"
                />
                {/* Slider handle */}
                <div
                  style={{
                    position: "absolute",
                    left: `${splitPosition * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                    cursor: "ew-resize",
                    transform: "translateX(-2px)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 4L2 8L6 12M10 4L14 8L10 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <Sliders
                  size={48}
                  style={{ color: "var(--text-tertiary)" }}
                  className="mb-3 opacity-40"
                />
                <p
                  className="text-sm m-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {isProcessing
                    ? "Processing image..."
                    : "Upload an image to see comparison"}
                </p>
              </div>
            )}
          </div>

          {comparisonCanvas && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Drag the slider to compare original (right) vs degraded (left)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
