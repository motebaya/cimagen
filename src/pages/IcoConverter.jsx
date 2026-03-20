import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  Loader2,
  Download,
  Crop,
} from "lucide-react";
import { convertToIco } from "../utils/icoConverter.js";
import { isValidImage, isValidSize } from "../utils/fileValidation.js";

export default function IcoConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedCanvas, setCroppedCanvas] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([
    16, 32, 48, 64, 128, 256,
  ]);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const availableSizes = [16, 32, 48, 64, 128, 256];

  useEffect(() => {
    if (imageSrc && imageRef.current && imageRef.current.complete) {
      initializeCrop();
    }
  }, [imageSrc, imageLoaded]);

  const initializeCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    const x = (img.naturalWidth - size) / 2;
    const y = (img.naturalHeight - size) / 2;

    setCropArea({ x, y, size });
    performCrop(x, y, size);
  };

  const performCrop = (x, y, size) => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(imageRef.current, x, y, size, size, 0, 0, size, size);

    setCroppedCanvas(canvas);
  };

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
    setImageLoaded(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
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
    setCroppedCanvas(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b),
    );
  };

  const handleDownloadMultiple = async () => {
    if (!croppedCanvas || selectedSizes.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const baseFilename = imageFilename.replace(/\.[^/.]+$/, "");

      // If only one size selected, download single ICO
      if (selectedSizes.length === 1) {
        const size = selectedSizes[0];
        const icoBlob = await convertToIco(croppedCanvas, [size]);
        const url = URL.createObjectURL(icoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${baseFilename}_${size}x${size}.ico`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Download multiple ICOs
        for (const size of selectedSizes) {
          const icoBlob = await convertToIco(croppedCanvas, [size]);
          const url = URL.createObjectURL(icoBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${baseFilename}_${size}x${size}.ico`;
          a.click();
          URL.revokeObjectURL(url);
          // Small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
          Image to ICO Converter
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Convert images to .ico format with multiple sizes
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    JPEG, PNG, WebP, GIF, BMP supported (max 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "var(--bg-tertiary)",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Uploaded"
                    className="w-full h-auto"
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: "block" }}
                  />
                </div>
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
        </div>

        <div className="space-y-6">
          <div>
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
              {croppedCanvas ? (
                <div
                  className="p-8"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {selectedSizes.map((size) => (
                      <div key={size} className="text-center">
                        <div
                          style={{
                            width: size > 64 ? 64 : size,
                            height: size > 64 ? 64 : size,
                            backgroundImage:
                              "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                            backgroundSize: "8px 8px",
                            backgroundPosition:
                              "0 0, 0 4px, 4px -4px, -4px 0px",
                            display: "inline-block",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          <canvas
                            ref={(el) => {
                              if (el && croppedCanvas) {
                                const displaySize = size > 64 ? 64 : size;
                                el.width = displaySize;
                                el.height = displaySize;
                                const ctx = el.getContext("2d");
                                ctx.imageSmoothingEnabled =
                                  size <= 32 ? false : true;
                                ctx.imageSmoothingQuality = "high";
                                ctx.drawImage(
                                  croppedCanvas,
                                  0,
                                  0,
                                  displaySize,
                                  displaySize,
                                );
                              }
                            }}
                          />
                        </div>
                        <p
                          className="text-xs mt-1 m-0"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {size}×{size}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-20"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <Crop
                    size={48}
                    style={{ color: "var(--text-tertiary)" }}
                    className="mb-3 opacity-40"
                  />
                  <p
                    className="text-sm m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Upload an image to see preview
                  </p>
                </div>
              )}
            </div>

            {croppedCanvas && (
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Image automatically cropped to square
              </p>
            )}
          </div>

          {imageSrc && (
            <>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Output Sizes
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                      style={{
                        backgroundColor: selectedSizes.includes(size)
                          ? "var(--color-primary-600)"
                          : "var(--bg-tertiary)",
                        color: selectedSizes.includes(size)
                          ? "#fff"
                          : "var(--text-primary)",
                      }}
                    >
                      {size}×{size}
                    </button>
                  ))}
                </div>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {selectedSizes.length} size
                  {selectedSizes.length !== 1 ? "s" : ""} selected
                </p>
              </div>

              <button
                onClick={handleDownloadMultiple}
                disabled={isProcessing || selectedSizes.length === 0}
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
                    Download ICO{selectedSizes.length > 1 ? "s" : ""}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
