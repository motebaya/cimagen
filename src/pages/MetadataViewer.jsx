import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
  Copy,
  Download,
  MapPin,
  Camera,
  FileX,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";
import {
  extractMetadata,
  MetadataMethod,
  formatMetadataAsText,
  removeMetadata,
  downloadMetadataAsText,
} from "../utils/metadataExtractor.js";

export default function MetadataViewer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [method, setMethod] = useState(MetadataMethod.EXIFR);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImageFilename(file.name);
    setMetadata(null);
    setCopySuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);

    // Auto-extract metadata
    await handleExtract(file, method);
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

  const handleExtract = async (file = imageFile, extractMethod = method) => {
    if (!file) return;

    setIsExtracting(true);
    setError(null);

    try {
      const result = await extractMetadata(file, extractMethod);

      if (!result.success) {
        setError(result.error || "Failed to extract metadata.");
        setMetadata(null);
      } else {
        setMetadata(result);
      }
    } catch (err) {
      console.error("Extraction error:", err);
      setError("Failed to extract metadata. Please try again.");
      setMetadata(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleMethodChange = async (newMethod) => {
    setMethod(newMethod);
    if (imageFile) {
      await handleExtract(imageFile, newMethod);
    }
  };

  const handleCopyJSON = () => {
    if (!metadata?.data) return;
    const json = JSON.stringify(metadata.data, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess("json");
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  const handleCopyText = () => {
    if (!metadata?.data) return;
    const text = formatMetadataAsText(metadata.data);
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess("text");
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  const handleDownloadMetadata = () => {
    if (!metadata?.data) return;
    const baseFilename = imageFilename.replace(/\.[^/.]+$/, "");
    downloadMetadataAsText(metadata.data, baseFilename);
  };

  const handleDownloadClean = async () => {
    if (!imageFile) return;

    try {
      const cleanBlob = await removeMetadata(imageFile);
      const url = URL.createObjectURL(cleanBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clean_${imageFilename}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Clean download error:", err);
      setError("Failed to remove metadata. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setImageFile(null);
    setImageFilename("");
    setMetadata(null);
    setError(null);
    setCopySuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasMetadata = metadata && Object.keys(metadata.data).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top bar */}
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

      {/* Title */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Image Metadata Viewer
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Extract and view EXIF metadata from your images
        </p>
      </div>

      {/* Error banner */}
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
        {/* Upload & Controls */}
        <div className="space-y-6">
          {/* Image upload */}
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
                    JPEG, PNG, WEBP supported (max 20MB)
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
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Extraction method */}
          {imageSrc && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Extraction Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMethodChange(MetadataMethod.EXIFR)}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor:
                      method === MetadataMethod.EXIFR
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color:
                      method === MetadataMethod.EXIFR
                        ? "#fff"
                        : "var(--text-primary)",
                  }}
                >
                  exifr (Modern)
                </button>
                <button
                  onClick={() => handleMethodChange(MetadataMethod.EXIF_JS)}
                  disabled={isExtracting}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor:
                      method === MetadataMethod.EXIF_JS
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color:
                      method === MetadataMethod.EXIF_JS
                        ? "#fff"
                        : "var(--text-primary)",
                  }}
                >
                  exif-js (Legacy)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Display & Actions */}
        <div className="space-y-6">
          <div>
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Metadata
            </p>
            <div
              className="rounded-xl border overflow-hidden relative"
              style={{
                borderColor: "var(--border-color)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              {isExtracting ? (
                <div
                  className="flex flex-col items-center justify-center py-20"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <Loader2
                    size={32}
                    className="animate-spin mb-3"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <p
                    className="text-sm m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Extracting metadata...
                  </p>
                </div>
              ) : hasMetadata ? (
                <div
                  className="p-4 max-h-[400px] overflow-y-auto"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <pre
                    className="text-xs m-0 whitespace-pre-wrap break-words"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(metadata.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-20"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  <ImageIcon
                    size={48}
                    style={{ color: "var(--text-tertiary)" }}
                    className="mb-3 opacity-40"
                  />
                  <p
                    className="text-sm m-0"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {imageSrc
                      ? "No metadata found"
                      : "Upload an image to view metadata"}
                  </p>
                </div>
              )}
            </div>

            {imageSrc && (
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Metadata extracted using{" "}
                {method === MetadataMethod.EXIFR ? "exifr" : "exif-js"}
              </p>
            )}
          </div>

          {/* Metadata info */}
          {hasMetadata && (
            <div
              className="p-4 rounded-xl animate-fade-in"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} style={{ color: "var(--text-secondary)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Metadata Found
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className="px-2 py-1 rounded"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {Object.keys(metadata.data).length} fields
                </span>
                {metadata.hasGPS && (
                  <span
                    className="px-2 py-1 rounded flex items-center gap-1"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      color: "#22c55e",
                    }}
                  >
                    <MapPin size={12} />
                    GPS
                  </span>
                )}
                {metadata.hasCamera && (
                  <span
                    className="px-2 py-1 rounded flex items-center gap-1"
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                    }}
                  >
                    <Camera size={12} />
                    Camera
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {hasMetadata && (
            <div className="space-y-2">
              <button
                onClick={handleCopyJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor:
                    copySuccess === "json" ? "#22c55e" : "var(--bg-tertiary)",
                  color:
                    copySuccess === "json" ? "#fff" : "var(--text-primary)",
                }}
              >
                {copySuccess === "json" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copySuccess === "json" ? "Copied!" : "Copy as JSON"}
              </button>
              <button
                onClick={handleCopyText}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor:
                    copySuccess === "text" ? "#22c55e" : "var(--bg-tertiary)",
                  color:
                    copySuccess === "text" ? "#fff" : "var(--text-primary)",
                }}
              >
                {copySuccess === "text" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copySuccess === "text" ? "Copied!" : "Copy as Text"}
              </button>
              <button
                onClick={handleDownloadMetadata}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <Download size={16} />
                Download Metadata
              </button>
              <button
                onClick={handleDownloadClean}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                <FileX size={16} />
                Download Without Metadata
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
