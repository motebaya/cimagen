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
  Palette,
} from "lucide-react";
import { convertToSvg } from "../utils/svgConverter.js";
import { isValidImage, isValidSize } from "../utils/fileValidation.js";

export default function SvgConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [svgOutput, setSvgOutput] = useState(null);
  const [sourceCanvas, setSourceCanvas] = useState(null);

  // Conversion options
  const [mode, setMode] = useState("logo");
  const [colors, setColors] = useState(8);
  const [smoothing, setSmoothing] = useState(2);
  const [detail, setDetail] = useState(5);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);

  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const processImage = useCallback(() => {
    if (!sourceCanvas) return;

    setIsProcessing(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const svg = convertToSvg(sourceCanvas, {
          mode,
          colors,
          smoothing,
          detail,
          width,
          height,
          preserveAspectRatio,
        });
        setSvgOutput(svg);
      } catch (err) {
        console.error("SVG conversion error:", err);
        setError("Failed to convert image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  }, [
    sourceCanvas,
    mode,
    colors,
    smoothing,
    detail,
    width,
    height,
    preserveAspectRatio,
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

        // Create canvas from image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        setSourceCanvas(canvas);
        setWidth(img.width);
        setHeight(img.height);
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
    setSvgOutput(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!svgOutput) return;

    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageFilename.replace(/\.[^/.]+$/, "")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
          Image to SVG Converter
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Convert raster images to vector SVG format
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
                    Best for logos, icons, silhouettes
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
                  Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["logo", "photo"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer capitalize"
                      style={{
                        backgroundColor:
                          mode === m
                            ? "var(--color-primary-600)"
                            : "var(--bg-tertiary)",
                        color: mode === m ? "#fff" : "var(--text-primary)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Colors: {colors}
                </label>
                <input
                  type="range"
                  min="2"
                  max="32"
                  value={colors}
                  onChange={(e) => setColors(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Smoothing: {smoothing}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={smoothing}
                  onChange={(e) => setSmoothing(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Detail: {detail}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={detail}
                  onChange={(e) => setDetail(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveAspectRatio}
                    onChange={(e) => setPreserveAspectRatio(e.target.checked)}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Preserve aspect ratio
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm border-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm border-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isProcessing || !svgOutput}
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
                    Converting...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download SVG
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
            Preview
          </p>
          <div
            className="rounded-xl border overflow-hidden relative"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {svgOutput ? (
              <div
                className="p-8"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: svgOutput }}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <Palette
                  size={48}
                  style={{ color: "var(--text-tertiary)" }}
                  className="mb-3 opacity-40"
                />
                <p
                  className="text-sm m-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {isProcessing
                    ? "Converting to SVG..."
                    : "Upload an image to see preview"}
                </p>
              </div>
            )}
          </div>

          {svgOutput && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Preview updates automatically as you adjust settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
