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
  GripVertical,
  RotateCw,
  Trash2,
  FileText,
} from "lucide-react";
import {
  convertImagesToPdf,
  generatePdfPreviews,
  PAGE_SIZES,
  LAYOUT_MODES,
} from "../utils/pdfConverter.js";
import {
  validateImageFiles,
  getImageAcceptAttribute,
} from "../utils/fileValidation.js";

export default function PdfConverter() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  // PDF options
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [layout, setLayout] = useState(LAYOUT_MODES.CONTAIN);
  const [margin, setMargin] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [filename, setFilename] = useState("");

  const fileInputRef = useRef(null);

  // Update preview whenever settings or images change
  useEffect(() => {
    if (images.length > 0) {
      const previews = generatePdfPreviews(images, {
        pageSize,
        orientation,
        layout,
        margin,
        backgroundColor,
      });
      setPreviewUrls(previews);
    } else {
      setPreviewUrls([]);
    }
  }, [images, pageSize, orientation, layout, margin, backgroundColor]);

  const handleFilesSelect = async (files) => {
    if (!files || files.length === 0) return;

    const validation = validateImageFiles(files);
    if (!validation.valid) {
      setError(validation.errors.join(" "));
      return;
    }

    setError(null);

    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const canvas = await loadImageToCanvas(file);
      newImages.push({
        id: Date.now() + i,
        filename: file.name,
        canvas,
        rotation: 0,
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const loadImageToCanvas = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const rotateImage = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img,
      ),
    );
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pdfBlob = await convertImagesToPdf(images, {
        pageSize,
        orientation,
        layout,
        margin,
        backgroundColor,
      });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `images_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
      style={{ maxWidth: "1800px", margin: "0 auto" }}
    >
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
          Image to PDF Converter
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Convert multiple images to a single PDF document
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Uploader */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Upload Images
            </label>

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
                  Multiple images supported (max 20MB each)
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={getImageAcceptAttribute()}
              multiple
              onChange={(e) => handleFilesSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Pages ({images.length})
                </label>
                <button
                  onClick={() => setImages([])}
                  className="text-xs px-2 py-1 rounded transition-colors border-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clear All
                </button>
              </div>

              <div
                className="space-y-2"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-move"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      opacity: draggedIndex === index ? 0.5 : 1,
                    }}
                  >
                    <GripVertical
                      size={16}
                      style={{ color: "var(--text-tertiary)" }}
                    />
                    <canvas
                      ref={(el) => {
                        if (el && image.canvas) {
                          el.width = 60;
                          el.height = 60;
                          const ctx = el.getContext("2d");
                          const scale = Math.min(
                            60 / image.canvas.width,
                            60 / image.canvas.height,
                          );
                          const w = image.canvas.width * scale;
                          const h = image.canvas.height * scale;
                          ctx.drawImage(
                            image.canvas,
                            (60 - w) / 2,
                            (60 - h) / 2,
                            w,
                            h,
                          );
                        }
                      }}
                      className="rounded"
                      style={{ border: "1px solid var(--border-color)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate m-0"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {image.filename}
                      </p>
                      <p
                        className="text-xs m-0"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {image.rotation}° rotation
                      </p>
                    </div>
                    <button
                      onClick={() => rotateImage(image.id)}
                      className="p-2 rounded transition-colors border-none cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                      }}
                      title="Rotate 90°"
                    >
                      <RotateCw size={16} />
                    </button>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 rounded transition-colors border-none cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                      }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - Preview */}
        <div className="lg:col-span-5">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            PDF Preview ({previewUrls.length}{" "}
            {previewUrls.length === 1 ? "Page" : "Pages"})
          </label>
          <div
            className="rounded-xl border overflow-hidden relative"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
              backgroundColor: "var(--bg-tertiary)",
              maxHeight: "800px",
            }}
          >
            {previewUrls.length > 0 ? (
              <div
                className="p-4 space-y-4"
                style={{ maxHeight: "800px", overflowY: "auto" }}
              >
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div
                      className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                      }}
                    >
                      Page {index + 1}
                    </div>
                    <img
                      src={url}
                      alt={`PDF Preview Page ${index + 1}`}
                      className="w-full h-auto"
                      style={{
                        border: "1px solid var(--border-color)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center"
                style={{ minHeight: "600px" }}
              >
                <FileText
                  size={48}
                  style={{ color: "var(--text-tertiary)" }}
                  className="mb-3 opacity-40"
                />
                <p
                  className="text-sm m-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Upload images to see preview
                </p>
              </div>
            )}
          </div>
          {previewUrls.length > 0 && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Preview updates automatically as you change settings
            </p>
          )}
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="A4">A4</option>
              <option value="LETTER">Letter</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["portrait", "landscape"].map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer capitalize"
                  style={{
                    backgroundColor:
                      orientation === o
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color: orientation === o ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Layout
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              <option value={LAYOUT_MODES.CONTAIN}>Contain</option>
              <option value={LAYOUT_MODES.COVER}>Cover</option>
              <option value={LAYOUT_MODES.ACTUAL}>Actual Size</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Margin (mm): {margin}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Background
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["white", "black"].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBackgroundColor(bg)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer capitalize"
                  style={{
                    backgroundColor:
                      backgroundColor === bg
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color:
                      backgroundColor === bg ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Filename (optional)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="images.pdf"
              className="w-full px-3 py-2 rounded-lg text-sm border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <button
            onClick={handleGeneratePdf}
            disabled={isProcessing || images.length === 0}
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
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
