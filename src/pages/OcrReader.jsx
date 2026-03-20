import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  Loader2,
  Download,
  Copy,
  CheckCircle,
  FileText,
} from "lucide-react";
import { isValidImage, isValidSize } from "../utils/fileValidation.js";

export default function OcrReader() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [language, setLanguage] = useState("eng");
  const [progress, setProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [tesseractLoaded, setTesseractLoaded] = useState(false);

  const fileInputRef = useRef(null);
  const workerRef = useRef(null);

  const loadTesseract = async () => {
    if (tesseractLoaded) return;

    try {
      // Lazy load tesseract.js
      const { createWorker } = await import("tesseract.js");
      workerRef.current = await createWorker(language);
      setTesseractLoaded(true);
    } catch (err) {
      console.error("Failed to load Tesseract:", err);
      setError("Failed to load OCR engine. Please refresh and try again.");
    }
  };

  const preprocessImage = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    // Apply threshold (binarization)
    const threshold = 128;
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > threshold ? 255 : 0;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  const handleFileSelect = async (file) => {
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
    setOcrText("");
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      setImageSrc(e.target.result);

      // Auto-process
      await loadTesseract();
      await performOcr(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const performOcr = async (imgSrc) => {
    if (!workerRef.current) {
      await loadTesseract();
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Load image to canvas for preprocessing
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgSrc;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Preprocess
      const preprocessed = preprocessImage(canvas);

      // Perform OCR
      const {
        data: { text },
      } = await workerRef.current.recognize(preprocessed);

      setOcrText(text);
    } catch (err) {
      console.error("OCR error:", err);
      setError(
        "Failed to extract text. Please try again with a clearer image.",
      );
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
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
    setOcrText("");
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ocrText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([ocrText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageFilename.replace(/\.[^/.]+$/, "")}_ocr.txt`;
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
          Image OCR Reader
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Extract text from images using optical character recognition
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
                    Best results with clear, high-contrast text
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
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 rounded-lg text-sm border-none"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="eng">English</option>
                <option value="ind">Indonesian</option>
              </select>
            </div>
          )}

          {isProcessing && (
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                  style={{ color: "var(--color-primary-600)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Processing... {progress}%
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--color-primary-600)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Extracted Text
              </label>
              {ocrText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors border-none cursor-pointer"
                    style={{
                      backgroundColor: copySuccess
                        ? "rgba(34, 197, 94, 0.1)"
                        : "var(--bg-tertiary)",
                      color: copySuccess ? "#22c55e" : "var(--text-secondary)",
                    }}
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors border-none cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              )}
            </div>

            <div
              className="rounded-xl border p-4 min-h-[300px]"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
              }}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-[280px]">
                  <Loader2
                    size={32}
                    className="animate-spin mb-3"
                    style={{ color: "var(--color-primary-600)" }}
                  />
                  <p
                    className="text-sm m-0"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Extracting text from image...
                  </p>
                  {progress > 0 && (
                    <p
                      className="text-xs mt-2 m-0"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {progress}% complete
                    </p>
                  )}
                </div>
              ) : ocrText ? (
                <pre
                  className="text-sm whitespace-pre-wrap m-0"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "monospace",
                  }}
                >
                  {ocrText}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-[280px]">
                  <FileText
                    size={48}
                    style={{ color: "var(--text-tertiary)" }}
                    className="mb-3 opacity-40"
                  />
                  <p
                    className="text-sm m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Upload an image to extract text
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
