import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Upload,
  X,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import {
  renderPokemonCard,
  ResizeMethod,
  loadTemplateConfig,
} from "../utils/pokemonCardRenderer.js";
import ExportControls from "../components/ExportControls.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import { useEditHistory } from "../hooks/useEditHistory.js";
import { useBeforeUnload } from "../hooks/useBeforeUnload.js";

export default function PokemonCardCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [resizeMethod, setResizeMethod] = useState(ResizeMethod.AUTO);
  const [templates, setTemplates] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("pokemoncard");

  useBeforeUnload(isDirty);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const configPath = `${import.meta.env.BASE_URL}images/pocard/template.json`;
        const config = await loadTemplateConfig(configPath);
        setTemplates(config);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load card templates.");
      }
    };
    loadTemplates();
  }, []);

  // Live preview with debounce
  const updatePreview = useCallback(() => {
    if (
      !previewCanvasRef.current ||
      !title.trim() ||
      !description.trim() ||
      !imageSrc ||
      templates.length === 0
    )
      return;
    setPreviewLoading(true);

    const solidFontPath = `${import.meta.env.BASE_URL}fonts/pocard/solid.ttf`;
    const descFontPath = `${import.meta.env.BASE_URL}fonts/pocard/desc.ttf`;
    const assetsBasePath = `${import.meta.env.BASE_URL}images/pocard`;

    renderPokemonCard(
      title,
      description,
      imageSrc,
      templateIndex,
      resizeMethod,
      templates,
      solidFontPath,
      descFontPath,
      assetsBasePath,
    )
      .then((canvas) => {
        if (previewCanvasRef.current) {
          const ctx = previewCanvasRef.current.getContext("2d");
          previewCanvasRef.current.width = canvas.width;
          previewCanvasRef.current.height = canvas.height;
          ctx.drawImage(canvas, 0, 0);
        }
      })
      .catch((err) => {
        console.error("Preview error:", err);
      })
      .finally(() => {
        setPreviewLoading(false);
      });
  }, [title, description, imageSrc, templateIndex, resizeMethod, templates]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(updatePreview, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [updatePreview]);

  useEffect(() => {
    if (title || description || imageSrc) {
      setIsDirty(true);
    }
  }, [title, description, imageSrc, templateIndex, resizeMethod]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }
    setError(null);
    setImageFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setHasGenerated(false);
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

  const handleGenerate = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !imageSrc ||
      templates.length === 0 ||
      isGenerating
    )
      return;
    setIsGenerating(true);
    setError(null);

    try {
      const solidFontPath = `${import.meta.env.BASE_URL}fonts/pocard/solid.ttf`;
      const descFontPath = `${import.meta.env.BASE_URL}fonts/pocard/desc.ttf`;
      const assetsBasePath = `${import.meta.env.BASE_URL}images/pocard`;

      const canvas = await renderPokemonCard(
        title,
        description,
        imageSrc,
        templateIndex,
        resizeMethod,
        templates,
        solidFontPath,
        descFontPath,
        assetsBasePath,
      );

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = canvas.width;
        canvasRef.current.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
      }

      setHasGenerated(true);
      setIsDirty(false);

      const previewDataUrl = canvasRef.current.toDataURL("image/webp", 0.2);
      saveEntry(
        {
          title,
          description:
            description.slice(0, 50) + (description.length > 50 ? "..." : ""),
          templateIndex,
          resizeMethod,
        },
        previewDataUrl,
      );
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate card. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestore = (entry) => {
    setTitle(entry.state.title || "");
    setDescription(entry.state.description || "");
    setTemplateIndex(entry.state.templateIndex || 0);
    setResizeMethod(entry.state.resizeMethod || ResizeMethod.AUTO);
    setHasGenerated(false);
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setHasGenerated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
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
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onDelete={deleteEntry}
          onClear={clearHistory}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Pokémon Card Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Create custom Pokémon-style trading cards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
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

          {/* Image upload */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Card Image
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
                    PNG, JPG, WEBP supported (max 20MB)
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

          {/* Card Title */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Card Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title..."
              className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary-500)";
                e.target.style.boxShadow = "0 0 0 3px rgba(92, 124, 250, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter card description..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none focus:outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary-500)";
                e.target.style.boxShadow = "0 0 0 3px rgba(92, 124, 250, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Template Selection */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Card Template
            </label>
            <div className="grid grid-cols-4 gap-2">
              {templates.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTemplateIndex(idx)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                  style={{
                    backgroundColor:
                      templateIndex === idx
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color:
                      templateIndex === idx ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Resize Method */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Image Resize Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: ResizeMethod.AUTO, label: "Auto" },
                { value: ResizeMethod.SCALE, label: "Scale" },
                { value: ResizeMethod.CROP, label: "Crop" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setResizeMethod(method.value)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer"
                  style={{
                    backgroundColor:
                      resizeMethod === method.value
                        ? "var(--color-primary-600)"
                        : "var(--bg-tertiary)",
                    color:
                      resizeMethod === method.value
                        ? "#fff"
                        : "var(--text-primary)",
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <p
              className="text-xs mt-2 m-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              Auto: Smart crop with border detection
            </p>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={
              !title.trim() || !description.trim() || !imageSrc || isGenerating
            }
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
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Create Image
              </>
            )}
          </button>

          {/* Export controls */}
          {hasGenerated && (
            <div
              className="pt-4 border-t animate-fade-in"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Export
              </p>
              <ExportControls
                canvasRef={canvasRef}
                filename={`pokemon_card_${title.replace(/\s+/g, "_")}`}
                disabled={!hasGenerated}
              />
            </div>
          )}
        </div>

        {/* Preview */}
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
            {title.trim() && description.trim() && imageSrc ? (
              <>
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-auto block"
                />
                {previewLoading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <Loader2
                      size={24}
                      className="animate-spin"
                      style={{ color: "#fff" }}
                    />
                  </div>
                )}
              </>
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
                  Fill in all fields to see preview
                </p>
              </div>
            )}
          </div>

          {/* Hidden canvas for high-quality export */}
          <canvas ref={canvasRef} className="hidden" />

          {title.trim() && description.trim() && imageSrc && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              Preview updates automatically as you type
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
