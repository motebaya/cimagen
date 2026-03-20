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
  Smartphone,
  Apple,
} from "lucide-react";
import {
  generateAppIcons,
  generatePreviewIcons,
} from "../utils/appIconGenerator.js";
import { isValidImage, isValidSize } from "../utils/fileValidation.js";

const BASE = import.meta.env.BASE_URL;

export default function AppIconGenerator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceCanvas, setSourceCanvas] = useState(null);

  // Settings
  const [zoom, setZoom] = useState(1.0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [androidName, setAndroidName] = useState("ic_launcher");
  const [appName, setAppName] = useState("App name");
  const [badgeEnabled, setBadgeEnabled] = useState(false);
  const [badgeText, setBadgeText] = useState("NEW");
  const [badgeColor, setBadgeColor] = useState("#ff0000");

  // Preview icons
  const [previewIcons, setPreviewIcons] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sourceCanvas) {
      updatePreview();
    }
  }, [
    sourceCanvas,
    zoom,
    backgroundColor,
    badgeEnabled,
    badgeText,
    badgeColor,
  ]);

  const updatePreview = () => {
    const badge = badgeEnabled
      ? { enabled: true, text: badgeText, color: badgeColor }
      : null;
    const icons = generatePreviewIcons(
      sourceCanvas,
      zoom,
      backgroundColor,
      badge,
    );
    setPreviewIcons(icons);
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
    setPreviewIcons(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async () => {
    if (!sourceCanvas) return;

    setIsProcessing(true);
    setError(null);

    try {
      const badge = badgeEnabled
        ? { enabled: true, text: badgeText, color: badgeColor }
        : null;
      const zipBlob = await generateAppIcons(sourceCanvas, {
        zoom,
        backgroundColor,
        androidName,
        badge,
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `app-icons-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate icons. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fade-in"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      <div className="flex items-center justify-between mb-6">
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

      <div className="mb-6">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          App Icon Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Generate Android and iOS app icons with proper directory structure
        </p>
      </div>

      {error && (
        <div
          className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Settings */}
        <div className="lg:col-span-5 space-y-4">
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
                    PNG, JPEG, WebP supported (max 20MB)
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
                  Image Scale
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
                <div
                  className="flex justify-between text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <span>zoom</span>
                  <span>normal</span>
                  <span>padding</span>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer border"
                    style={{ borderColor: "var(--border-color)" }}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 rounded-lg text-sm border-none"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  App Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="App name"
                  className="w-full px-3 py-2 rounded-lg text-sm border-none"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Android File Name
                </label>
                <input
                  type="text"
                  value={androidName}
                  onChange={(e) => setAndroidName(e.target.value)}
                  placeholder="ic_launcher"
                  className="w-full px-3 py-2 rounded-lg text-sm border-none"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "1rem",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Badge Strip
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={badgeEnabled}
                      onChange={(e) => setBadgeEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {badgeEnabled && (
                  <div className="space-y-3">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        maxLength="10"
                        className="w-full px-3 py-2 rounded-lg text-sm border-none"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Badge Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={badgeColor}
                          onChange={(e) => setBadgeColor(e.target.value)}
                          className="w-16 h-10 rounded-lg cursor-pointer border"
                          style={{ borderColor: "var(--border-color)" }}
                        />
                        <input
                          type="text"
                          value={badgeColor}
                          onChange={(e) => setBadgeColor(e.target.value)}
                          placeholder="#ff0000"
                          className="flex-1 px-3 py-2 rounded-lg text-sm border-none"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-7 space-y-4">
          {sourceCanvas && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Download ZIP
                    </>
                  )}
                </button>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Icon Variants
                </label>
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-tertiary)",
                  }}
                >
                  {previewIcons && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <canvas
                          ref={(el) => {
                            if (el && previewIcons.round) {
                              el.width = 192;
                              el.height = 192;
                              const ctx = el.getContext("2d");
                              ctx.drawImage(previewIcons.round, 0, 0);
                            }
                          }}
                          className="w-24 h-24 mx-auto rounded-full"
                          style={{ border: "1px solid var(--border-color)" }}
                        />
                        <p
                          className="text-xs mt-2 m-0"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Round
                        </p>
                      </div>
                      <div className="text-center">
                        <canvas
                          ref={(el) => {
                            if (el && previewIcons.squircle) {
                              el.width = 192;
                              el.height = 192;
                              const ctx = el.getContext("2d");
                              ctx.drawImage(previewIcons.squircle, 0, 0);
                            }
                          }}
                          className="w-24 h-24 mx-auto"
                          style={{
                            border: "1px solid var(--border-color)",
                            borderRadius: "20%",
                          }}
                        />
                        <p
                          className="text-xs mt-2 m-0"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Squircle
                        </p>
                      </div>
                      <div className="text-center">
                        <canvas
                          ref={(el) => {
                            if (el && previewIcons.legacy) {
                              el.width = 192;
                              el.height = 192;
                              const ctx = el.getContext("2d");
                              ctx.drawImage(previewIcons.legacy, 0, 0);
                            }
                          }}
                          className="w-24 h-24 mx-auto rounded-lg"
                          style={{ border: "1px solid var(--border-color)" }}
                        />
                        <p
                          className="text-xs mt-2 m-0"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Legacy
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Device Preview
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-tertiary)",
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ height: "200px" }}
                    >
                      <img
                        src={`${BASE}images/android_preview.png`}
                        alt="Android Preview"
                        className="w-full h-auto"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          clipPath: "inset(0 0 40% 0)",
                        }}
                      />
                      {previewIcons && (
                        <div
                          style={{
                            position: "absolute",
                            top: "30%",
                            left: "15%",
                          }}
                        >
                          <canvas
                            ref={(el) => {
                              if (el && previewIcons.round) {
                                el.width = 96;
                                el.height = 96;
                                const ctx = el.getContext("2d");
                                ctx.drawImage(previewIcons.round, 0, 0, 96, 96);
                              }
                            }}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                            }}
                          />
                          <p
                            className="text-xs text-center mt-1 m-0"
                            style={{
                              color: "#ffffff",
                              fontSize: "9px",
                              width: "48px",
                            }}
                          >
                            {appName}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Smartphone
                        size={12}
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      <p
                        className="text-xs m-0"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Android
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-tertiary)",
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ height: "200px" }}
                    >
                      <img
                        src={`${BASE}images/iphone_preview.png`}
                        alt="iPhone Preview"
                        className="w-full h-auto"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          clipPath: "inset(0 0 40% 0)",
                        }}
                      />
                      {previewIcons && (
                        <div
                          style={{
                            position: "absolute",
                            top: "30%",
                            left: "15%",
                          }}
                        >
                          <canvas
                            ref={(el) => {
                              if (el && previewIcons.squircle) {
                                el.width = 96;
                                el.height = 96;
                                const ctx = el.getContext("2d");
                                ctx.drawImage(
                                  previewIcons.squircle,
                                  0,
                                  0,
                                  96,
                                  96,
                                );
                              }
                            }}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "20%",
                            }}
                          />
                          <p
                            className="text-xs text-center mt-1 m-0"
                            style={{
                              color: "#ffffff",
                              fontSize: "9px",
                              width: "48px",
                            }}
                          >
                            {appName}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Apple
                        size={12}
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      <p
                        className="text-xs m-0"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        iPhone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
