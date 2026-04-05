import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Download,
  ImageIcon,
  Layers3,
  Loader2,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import CreatorCheckbox from "../components/creator/CreatorCheckbox.jsx";
import CreatorSelect from "../components/creator/CreatorSelect.jsx";
import CreatorUploadDropzone from "../components/creator/CreatorUploadDropzone.jsx";
import WatermarkImageStrip from "../components/watermark/WatermarkImageStrip.jsx";
import WatermarkSelectionOverlay from "../components/watermark/WatermarkSelectionOverlay.jsx";
import WatermarkTemplatePreview from "../components/watermark/WatermarkTemplatePreview.jsx";
import SEO from "../components/SEO.jsx";
import { downloadBlob, downloadCanvas } from "../utils/exportImage.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../utils/fileValidation.js";
import {
  createImageLayer,
  createTextLayer,
  drawCanvas,
  getColorInputValue,
  getTimestamp,
  nudgeRangeInput,
} from "../utils/watermark/editorLayerUtils.js";
import { exportBatchWatermark } from "../utils/watermark/batchWatermark.js";
import {
  exportWatermarkedCanvas,
  renderWatermarkLayers,
} from "../utils/watermark/watermarkRenderer.js";
import { getWatermarkTemplateGroups } from "../utils/watermark/watermarkTemplates.js";

export default function WatermarkTool() {
  const [imageItems, setImageItems] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [rendered, setRendered] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [selectionVisible, setSelectionVisible] = useState(true);
  const [guides, setGuides] = useState(null);
  const [previewMaxDimension, setPreviewMaxDimension] = useState(980);
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);
  const [scaleMultiplier, setScaleMultiplier] = useState(1);
  const [filePrefix, setFilePrefix] = useState("watermark");
  const [layers, setLayers] = useState([createTextLayer()]);

  const imageInputRef = useRef(null);
  const watermarkInputRef = useRef(null);
  const previewAreaRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const watermarkCanvasRef = useRef(null);
  const previewStripRef = useRef(null);
  const stripDragRef = useRef(null);

  const activeImage = useMemo(
    () =>
      imageItems.find((item) => item.id === activeImageId) ||
      imageItems[0] ||
      null,
    [imageItems, activeImageId],
  );
  const imageSrc = activeImage?.src || null;
  const imageFilename = activeImage?.name || "";

  const selectedLayer = useMemo(
    () =>
      layers.find((layer) => layer.id === selectedLayerId) || layers[0] || null,
    [layers, selectedLayerId],
  );
  const templateGroups = useMemo(() => getWatermarkTemplateGroups(), []);

  const selectedBound = useMemo(
    () =>
      rendered?.bounds?.find((bound) => bound.id === selectedLayer?.id) || null,
    [rendered, selectedLayer],
  );

  useEffect(() => {
    if (!selectedLayerId && layers[0]) {
      setSelectedLayerId(layers[0].id);
    }
  }, [layers, selectedLayerId]);

  useEffect(() => {
    if (selectedLayerId) {
      setSelectionVisible(true);
    }
  }, [selectedLayerId]);

  useEffect(() => {
    const handlePointerDownOutside = (event) => {
      if (!previewAreaRef.current?.contains(event.target)) {
        setSelectionVisible(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDownOutside);
    return () =>
      window.removeEventListener("mousedown", handlePointerDownOutside);
  }, []);

  useEffect(() => {
    const node = previewAreaRef.current;

    if (!node) {
      return undefined;
    }

    const updatePreviewMaxDimension = () => {
      const nextDimension = Math.max(280, Math.floor(node.clientWidth - 24));

      setPreviewMaxDimension((current) =>
        current === nextDimension ? current : nextDimension,
      );
    };

    updatePreviewMaxDimension();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updatePreviewMaxDimension);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updatePreviewMaxDimension);
    return () => window.removeEventListener("resize", updatePreviewMaxDimension);
  }, []);

  useEffect(() => {
    if (!imageSrc) {
      setRendered(null);
      return;
    }

    let active = true;
    setIsRendering(true);
    setError(null);

    renderWatermarkLayers(imageSrc, layers, {
      previewMaxDimension,
      selectedLayerId,
      hideSelectedLayer: selectionVisible,
      showGrid,
    })
      .then((result) => {
        if (!active) return;
        drawCanvas(baseCanvasRef.current, result.baseLayer);
        drawCanvas(watermarkCanvasRef.current, result.watermarkLayer);
        setRendered(result);
      })
      .catch((renderError) => {
        console.error(renderError);
        if (active) {
          setError(
            renderError.message || "Failed to render watermark preview.",
          );
        }
      })
      .finally(() => {
        if (active) setIsRendering(false);
      });

    return () => {
      active = false;
    };
  }, [
    imageSrc,
    layers,
    previewMaxDimension,
    selectedLayerId,
    selectionVisible,
    showGrid,
  ]);

  const updateLayer = (layerId, patch) => {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === layerId ? { ...layer, ...patch } : layer,
      ),
    );
  };

  const handleBaseImage = (file) => {
    handleBaseImages(file ? [file] : []);
  };

  const handleBaseImages = (files) => {
    const validFiles = files.filter(Boolean);
    if (!validFiles.length) return;
    for (const file of validFiles) {
      if (!isValidImage(file)) {
        setError("Please select a valid image file (PNG, JPG, or WEBP).");
        return;
      }
      if (!isValidSize(file, 20)) {
        setError("Image is too large. Please use an image under 20MB.");
        return;
      }
    }

    setError(null);
    Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) =>
              resolve({
                id: `image-${Math.random().toString(36).slice(2, 9)}`,
                src: event.target.result,
                name: file.name,
                size: file.size,
                file,
              });
            reader.onerror = () =>
              reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then((items) => {
        setImageItems(items);
        setActiveImageId(items[0]?.id || null);
      })
      .catch((readError) =>
        setError(readError.message || "Failed to read selected image files."),
      );
  };

  const handleWatermarkImage = (file) => {
    if (!file || !selectedLayer) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const nextLayer = createImageLayer(event.target.result);
      setLayers((current) => [...current, nextLayer]);
      setSelectedLayerId(nextLayer.id);
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewPointerDown = ({ stageX, stageY, clickedOnEmpty }) => {
    if (!rendered?.bounds?.length) {
      setSelectionVisible(false);
      return;
    }

    const hit = [...rendered.bounds]
      .reverse()
      .find(
        (bound) =>
          stageX >= bound.x &&
          stageX <= bound.x + bound.width &&
          stageY >= bound.y &&
          stageY <= bound.y + bound.height,
      );

    if (hit) {
      setSelectedLayerId(hit.id);
      setSelectionVisible(true);
      return;
    }

    if (clickedOnEmpty) {
      setSelectionVisible(false);
    }
  };

  const handleSelectionTransform = ({ type, node }) => {
    if (!selectedLayer || !rendered?.selectedBound || selectedLayer.lock) {
      return;
    }

    const baseBound = rendered.selectedBound;

    if (type === "dragMove" || type === "dragEnd") {
      const nextCenterX = node.x() + node.width() / 2;
      const nextCenterY = node.y() + node.height() / 2;
      const nextGuides = {};
      const centerX = rendered.baseLayer.width / 2;
      const centerY = rendered.baseLayer.height / 2;
      let normalizedX = nextCenterX / rendered.baseLayer.width;
      let normalizedY = nextCenterY / rendered.baseLayer.height;

      if (Math.abs(nextCenterX - centerX) < 14) {
        normalizedX = 0.5;
        nextGuides.vertical = centerX;
      }
      if (Math.abs(nextCenterY - centerY) < 14) {
        normalizedY = 0.5;
        nextGuides.horizontal = centerY;
      }

      setGuides(Object.keys(nextGuides).length ? nextGuides : null);

      if (type === "dragEnd") {
        updateLayer(selectedLayer.id, { x: normalizedX, y: normalizedY });
        setGuides(null);
      }
      return;
    }

    if (type === "transform" || type === "transformEnd") {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const nextScale = Math.max(
        0.1,
        (selectedLayer.scale || 1) * Math.max(scaleX, scaleY),
      );
      const nextRotation = (selectedLayer.rotation || 0) + node.rotation();
      const nextCenterX = node.x() + (baseBound.width * scaleX) / 2;
      const nextCenterY = node.y() + (baseBound.height * scaleY) / 2;
      if (type === "transformEnd") {
        updateLayer(selectedLayer.id, {
          scale: nextScale,
          rotation: nextRotation,
          x: nextCenterX / rendered.baseLayer.width,
          y: nextCenterY / rendered.baseLayer.height,
        });
        setGuides(null);
        node.scaleX(1);
        node.scaleY(1);
        node.rotation(0);
      }
    }
  };

  const applyTemplate = (template) => {
    const layer = createTextLayer(template);
    setLayers((current) => [...current, layer]);
    setSelectedLayerId(layer.id);
    setSelectionVisible(true);
  };

  const handleStripWheel = (event) => {
    if (!previewStripRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    previewStripRef.current.scrollLeft +=
      Math.abs(event.deltaY) > Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;
  };

  const handleStripPointerDown = (event) => {
    if (!previewStripRef.current) return;
    stripDragRef.current = {
      startX: event.clientX,
      startScrollLeft: previewStripRef.current.scrollLeft,
    };
    previewStripRef.current.style.cursor = "grabbing";
  };

  const handleStripPointerMove = (event) => {
    if (!stripDragRef.current || !previewStripRef.current) return;
    const deltaX = event.clientX - stripDragRef.current.startX;
    previewStripRef.current.scrollLeft =
      stripDragRef.current.startScrollLeft - deltaX;
  };

  const handleStripPointerUp = () => {
    stripDragRef.current = null;
    if (previewStripRef.current) {
      previewStripRef.current.style.cursor = "grab";
    }
  };

  const handleRangeWheel = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "range") {
      return;
    }
    event.preventDefault();
    nudgeRangeInput(target, event.deltaY < 0 ? 1 : -1);
  };

  const duplicateLayer = () => {
    if (!selectedLayer) return;
    const duplicate = {
      ...selectedLayer,
      id: `layer-${Math.random().toString(36).slice(2, 9)}`,
      x: Math.min(0.95, (selectedLayer.x || 0.5) + 0.04),
      y: Math.min(0.95, (selectedLayer.y || 0.5) + 0.04),
    };
    setLayers((current) => [...current, duplicate]);
    setSelectedLayerId(duplicate.id);
    setSelectionVisible(true);
  };

  const exportSingle = async () => {
    if (!imageSrc) return;
    setIsExporting(true);
    try {
      const base = await exportWatermarkedCanvas(imageSrc, layers);
      const scaled = document.createElement("canvas");
      scaled.width = Math.round(base.width * scaleMultiplier);
      scaled.height = Math.round(base.height * scaleMultiplier);
      const context = scaled.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.drawImage(base, 0, 0, scaled.width, scaled.height);
      await downloadCanvas(
        scaled,
        `${filePrefix}_${getTimestamp()}`,
        format,
        quality,
      );
    } catch (exportError) {
      console.error(exportError);
      setError(exportError.message || "Failed to export watermarked image.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportBatch = async () => {
    if (!imageItems.length) return;
    setIsExporting(true);
    try {
      const blob = await exportBatchWatermark(
        imageItems.map((item) => item.file),
        layers,
        {
          format,
          quality,
          prefix: filePrefix,
        },
      );
      downloadBlob(blob, `${filePrefix}_${getTimestamp()}.zip`);
    } catch (exportError) {
      console.error(exportError);
      setError(exportError.message || "Failed to export batch watermark ZIP.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <SEO pageKey="watermark-tool" />
      <div
        className="watermark-editor w-full px-3 sm:px-5 lg:px-6 py-6 animate-fade-in"
        style={{ maxWidth: "1840px", margin: "0 auto" }}
        onWheelCapture={handleRangeWheel}
      >
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(event) =>
              (event.currentTarget.style.color = "var(--color-primary-500)")
            }
            onMouseLeave={(event) =>
              (event.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayers([createTextLayer()])}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button
              onClick={exportSingle}
              disabled={!imageSrc || isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}{" "}
              Export
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Image Watermark Tool
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            A wider offline watermark editor with text, image, template, tiled,
            and batch workflows plus draggable layer positioning.
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

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_680px] gap-6 items-start">
          <div className="space-y-4">
            <div
              ref={previewAreaRef}
              className="rounded-xl border p-3"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              {!imageSrc ? (
                <CreatorUploadDropzone
                  isDragging={isDragging}
                  desktopMinHeightClass="sm:min-h-[520px]"
                  dragIcon={Upload}
                  idleIcon={Upload}
                  onOpenImagePicker={() => imageInputRef.current?.click()}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleBaseImages(Array.from(event.dataTransfer.files || []));
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  title="Upload one or many base images to start editing"
                  description="PNG, JPG, WEBP supported. Multiple images enable batch workflow."
                />
              ) : (
                <div className="relative max-w-full flex justify-center">
                  <div className="relative inline-block mx-auto">
                    <canvas
                      ref={baseCanvasRef}
                      className="block absolute inset-0 w-full h-full"
                    />
                    <canvas
                      ref={watermarkCanvasRef}
                      className="block relative max-w-full h-auto"
                    />
                    <WatermarkSelectionOverlay
                      width={rendered?.baseLayer?.width || 0}
                      height={rendered?.baseLayer?.height || 0}
                      selectedBound={selectedBound}
                      selectedPreview={rendered?.selectedLayerCanvas || null}
                      guides={guides}
                      visible={selectionVisible && !selectedLayer?.lock}
                      showGrid={showGrid}
                      onTransform={handleSelectionTransform}
                      onBackgroundMouseDown={handlePreviewPointerDown}
                    />
                  </div>
                  {isRendering && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(15,23,42,0.16)" }}
                    >
                      <Loader2
                        size={24}
                        className="animate-spin"
                        style={{ color: "#fff" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {imageSrc && (
              <>
                <WatermarkImageStrip
                  items={imageItems}
                  activeImageId={activeImageId}
                  onSelect={setActiveImageId}
                  containerRef={previewStripRef}
                  onWheel={handleStripWheel}
                  onMouseDown={handleStripPointerDown}
                  onMouseMove={handleStripPointerMove}
                  onMouseUp={handleStripPointerUp}
                />

                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon
                        size={14}
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      <span
                        className="text-sm truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {imageFilename}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowGrid((value) => !value)}
                        className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Layers3 size={14} />
                          <span>{showGrid ? "Hide Grid" : "Show Grid"}</span>
                        </span>
                      </button>
                      <button
                        onClick={duplicateLayer}
                        disabled={!selectedLayer}
                        className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border disabled:opacity-50"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Copy size={14} />
                          <span>Duplicate Layer</span>
                        </span>
                      </button>
                      <button
                        onClick={exportSingle}
                        disabled={isExporting}
                        className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border-none text-white disabled:opacity-50"
                        style={{ backgroundColor: "var(--color-primary-600)" }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Download size={14} />
                          <span>{isExporting ? "Exporting..." : "Export Image"}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div
                className="rounded-xl border p-4 space-y-4"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-bg)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {!imageSrc && (
                  <div
                    className="rounded-lg border px-3 py-3 text-sm"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Upload a base image to enable watermark templates, layer controls, and editing tools.
                  </div>
                )}

                <fieldset disabled={!imageSrc} className={!imageSrc ? "space-y-4 opacity-60" : "space-y-4"}>
                  <div>
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Watermark Type
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const layer = createTextLayer();
                          setLayers((current) => [...current, layer]);
                          setSelectedLayerId(layer.id);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Type size={16} />
                        Text Layer
                      </button>
                      <button
                        onClick={() => watermarkInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Upload size={16} />
                        Image Layer
                      </button>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Templates
                    </p>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                      {Object.entries(templateGroups).map(
                        ([category, templates]) => (
                          <div key={category}>
                            <p
                              className="text-xs font-semibold mb-2"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              {category}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {templates.map((template) => (
                                <button
                                  key={template.id}
                                  onClick={() => applyTemplate(template)}
                                  className="rounded-lg overflow-hidden cursor-pointer border text-left transition-all"
                                  style={{
                                    borderColor: "var(--border-color)",
                                    backgroundColor: "var(--bg-tertiary)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  <WatermarkTemplatePreview
                                    template={template}
                                  />
                                  <div className="px-3 py-2">
                                    <div className="text-[11px] font-semibold">
                                      {template.label}
                                    </div>
                                    <div
                                      className="text-[10px] mt-1"
                                      style={{ color: "var(--text-tertiary)" }}
                                    >
                                      {template.type}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Layers
                    </p>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {layers.map((layer) => (
                        <div
                          key={layer.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedLayerId(layer.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedLayerId(layer.id);
                            }
                          }}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left cursor-pointer border"
                          style={{
                            borderColor:
                              selectedLayerId === layer.id
                                ? "var(--color-primary-500)"
                                : "var(--border-color)",
                            backgroundColor:
                              selectedLayerId === layer.id
                                ? "rgba(92,124,250,0.06)"
                                : "var(--bg-secondary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span className="min-w-0 truncate text-sm flex items-center gap-2">
                            <Layers3 size={14} />
                            {layer.type === "image"
                              ? "Image watermark"
                              : layer.templateLabel ||
                                layer.text ||
                                "Text layer"}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                updateLayer(layer.id, { lock: !layer.lock });
                              }}
                              className="border-none bg-transparent cursor-pointer"
                              style={{
                                color: layer.lock
                                  ? "var(--color-primary-600)"
                                  : "var(--text-tertiary)",
                              }}
                            >
                              <Lock size={14} />
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setLayers((current) =>
                                  current.filter(
                                    (entry) => entry.id !== layer.id,
                                  ),
                                );
                              }}
                              className="border-none bg-transparent cursor-pointer"
                              style={{ color: "#ef4444" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedLayer && (
                    <fieldset
                      disabled={selectedLayer.lock}
                      className={`space-y-4 ${selectedLayer.lock ? "opacity-60" : ""}`}
                    >
                      {selectedLayer.type !== "image" && (
                        <div className="space-y-4">
                          <div>
                            <p
                              className="text-sm font-medium mb-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Layer Settings
                            </p>
                            {selectedLayer.type === "stamp-circle-banner" ? (
                              <p
                                className="text-xs m-0"
                                style={{ color: "var(--text-tertiary)" }}
                              >
                                This stamp uses 3 separate text regions: top,
                                middle, and bottom.
                              </p>
                            ) : (
                              <textarea
                                rows="3"
                                value={selectedLayer.text}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    text: event.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-lg border outline-none resize-y"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                  color: "var(--text-primary)",
                                }}
                              />
                            )}
                          </div>
                          {selectedLayer.secondaryText !== undefined && (
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {selectedLayer.type === "stamp-circle-banner"
                                  ? "Middle Text"
                                  : "Secondary Text"}
                              </label>
                              <input
                                type="text"
                                value={selectedLayer.secondaryText || ""}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    secondaryText: event.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-lg border outline-none"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                  color: "var(--text-primary)",
                                }}
                              />
                            </div>
                          )}
                          {selectedLayer.type === "stamp-circle-banner" && (
                            <>
                              <div>
                                <label
                                  className="block text-sm font-medium mb-2"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Top Text
                                </label>
                                <input
                                  type="text"
                                  value={selectedLayer.text || ""}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      text: event.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 rounded-lg border outline-none"
                                  style={{
                                    borderColor: "var(--border-color)",
                                    backgroundColor: "var(--input-bg)",
                                    color: "var(--text-primary)",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  className="block text-sm font-medium mb-2"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Bottom Text
                                </label>
                                <input
                                  type="text"
                                  value={selectedLayer.tertiaryText || ""}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      tertiaryText: event.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 rounded-lg border outline-none"
                                  style={{
                                    borderColor: "var(--border-color)",
                                    backgroundColor: "var(--input-bg)",
                                    color: "var(--text-primary)",
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Font Size
                              </label>
                              <input
                                type="range"
                                min="16"
                                max="96"
                                step="1"
                                value={selectedLayer.fontSize}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    fontSize: Number(event.target.value),
                                  })
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Opacity
                              </label>
                              <input
                                type="range"
                                min="0.05"
                                max="1"
                                step="0.01"
                                value={selectedLayer.opacity}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    opacity: Number(event.target.value),
                                  })
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Text Color
                              </label>
                              <input
                                type="color"
                                value={getColorInputValue(
                                  selectedLayer.textColor ||
                                    selectedLayer.color,
                                  "#ffffff",
                                )}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    textColor: event.target.value,
                                    color: event.target.value,
                                  })
                                }
                                className="w-full h-10 rounded-lg border outline-none"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                }}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Stroke Color
                              </label>
                              <input
                                type="color"
                                value={getColorInputValue(
                                  selectedLayer.strokeColor,
                                  "#000000",
                                )}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    strokeColor: event.target.value,
                                  })
                                }
                                className="w-full h-10 rounded-lg border outline-none"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Background Color
                              </label>
                              <input
                                type="color"
                                value={getColorInputValue(
                                  selectedLayer.backgroundColor,
                                  "#ffffff",
                                )}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    backgroundColor: event.target.value,
                                  })
                                }
                                className="w-full h-10 rounded-lg border outline-none"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                }}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Accent / Border
                              </label>
                              <input
                                type="color"
                                value={getColorInputValue(
                                  selectedLayer.accentColor ||
                                    selectedLayer.borderColor ||
                                    selectedLayer.stampColor,
                                  "#5c7cfa",
                                )}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    accentColor: event.target.value,
                                    borderColor: event.target.value,
                                    stampColor: event.target.value,
                                  })
                                }
                                className="w-full h-10 rounded-lg border outline-none"
                                style={{
                                  borderColor: "var(--border-color)",
                                  backgroundColor: "var(--input-bg)",
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <CreatorCheckbox
                              checked={selectedLayer.tiled}
                              compact
                              label="Tiled watermark"
                              onChange={(value) =>
                                updateLayer(selectedLayer.id, {
                                  tiled: value,
                                })
                              }
                            />
                            <CreatorSelect
                              value={selectedLayer.pattern || "diagonal"}
                              options={[
                                { value: "grid", label: "Grid" },
                                { value: "diagonal", label: "Diagonal" },
                                { value: "brick", label: "Brick" },
                              ]}
                              onChange={(value) =>
                                updateLayer(selectedLayer.id, {
                                  pattern: value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <label
                              className="block text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Rotation
                              <input
                                type="range"
                                min="-45"
                                max="45"
                                step="1"
                                value={selectedLayer.rotation || 0}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    rotation: Number(event.target.value),
                                  })
                                }
                                className="w-full mt-2"
                              />
                            </label>
                            <label
                              className="block text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Tile Spacing
                              <input
                                type="range"
                                min="48"
                                max="180"
                                step="2"
                                value={selectedLayer.spacing || 110}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    spacing: Number(event.target.value),
                                  })
                                }
                                className="w-full mt-2"
                              />
                            </label>
                          </div>
                          {selectedLayer.templateCategory === "Stamp" && (
                            <div className="grid grid-cols-2 gap-4">
                              <label
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Border Thickness
                                <input
                                  type="range"
                                  min="1"
                                  max="12"
                                  step="1"
                                  value={selectedLayer.borderWidth || 4}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      borderWidth: Number(event.target.value),
                                    })
                                  }
                                  className="w-full mt-2"
                                />
                              </label>
                              <label
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Distress Level
                                <input
                                  type="range"
                                  min="0"
                                  max="0.6"
                                  step="0.02"
                                  value={selectedLayer.distressLevel || 0}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      distressLevel: Number(event.target.value),
                                    })
                                  }
                                  className="w-full mt-2"
                                />
                              </label>
                              <CreatorCheckbox
                                checked={selectedLayer.doubleBorder || false}
                                compact
                                label="Double border"
                                onChange={(value) =>
                                  updateLayer(selectedLayer.id, {
                                    doubleBorder: value,
                                  })
                                }
                              />
                              <CreatorCheckbox
                                checked={selectedLayer.distressed || false}
                                compact
                                label="Distressed texture"
                                onChange={(value) =>
                                  updateLayer(selectedLayer.id, {
                                    distressed: value,
                                  })
                                }
                              />
                            </div>
                          )}
                          {(selectedLayer.templateCategory === "Social Media" ||
                            selectedLayer.templateCategory === "Pattern") && (
                            <div className="grid grid-cols-2 gap-4">
                              <label
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Density
                                <input
                                  type="range"
                                  min="0.5"
                                  max="2"
                                  step="0.1"
                                  value={selectedLayer.density || 1}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      density: Number(event.target.value),
                                    })
                                  }
                                  className="w-full mt-2"
                                />
                              </label>
                              <label
                                className="block text-sm font-medium"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Icon Size
                                <input
                                  type="range"
                                  min="0.4"
                                  max="2"
                                  step="0.05"
                                  value={selectedLayer.iconScale || 1}
                                  onChange={(event) =>
                                    updateLayer(selectedLayer.id, {
                                      iconScale: Number(event.target.value),
                                    })
                                  }
                                  className="w-full mt-2"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedLayer.type === "image" && (
                        <div className="space-y-4">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Image Settings
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <label
                              className="block text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Scale
                              <input
                                type="range"
                                min="0.2"
                                max="3"
                                step="0.05"
                                value={selectedLayer.scale || 1}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    scale: Number(event.target.value),
                                  })
                                }
                                className="w-full mt-2"
                              />
                            </label>
                            <label
                              className="block text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Opacity
                              <input
                                type="range"
                                min="0.05"
                                max="1"
                                step="0.01"
                                value={selectedLayer.opacity || 1}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    opacity: Number(event.target.value),
                                  })
                                }
                                className="w-full mt-2"
                              />
                            </label>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <label
                              className="block text-sm font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Rotation
                              <input
                                type="range"
                                min="-45"
                                max="45"
                                step="1"
                                value={selectedLayer.rotation || 0}
                                onChange={(event) =>
                                  updateLayer(selectedLayer.id, {
                                    rotation: Number(event.target.value),
                                  })
                                }
                                className="w-full mt-2"
                              />
                            </label>
                            <CreatorSelect
                              label="Blend Mode"
                              value={selectedLayer.blendMode || "source-over"}
                              options={[
                                { value: "source-over", label: "Normal" },
                                { value: "multiply", label: "Multiply" },
                                { value: "overlay", label: "Overlay" },
                                { value: "soft-light", label: "Soft Light" },
                                { value: "hard-light", label: "Hard Light" },
                                { value: "screen", label: "Screen" },
                                { value: "darken", label: "Darken" },
                                { value: "lighten", label: "Lighten" },
                              ]}
                              onChange={(value) =>
                                updateLayer(selectedLayer.id, {
                                  blendMode: value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <CreatorCheckbox
                              checked={selectedLayer.flipX || false}
                              compact
                              label="Flip horizontal"
                              onChange={(value) =>
                                updateLayer(selectedLayer.id, {
                                  flipX: value,
                                })
                              }
                            />
                            <CreatorCheckbox
                              checked={selectedLayer.flipY || false}
                              compact
                              label="Flip vertical"
                              onChange={(value) =>
                                updateLayer(selectedLayer.id, {
                                  flipY: value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Position X
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={selectedLayer.x || 0.5}
                            onChange={(event) =>
                              updateLayer(selectedLayer.id, {
                                x: Number(event.target.value),
                              })
                            }
                            className="w-full mt-2"
                          />
                        </label>
                        <label
                          className="block text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Position Y
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={selectedLayer.y || 0.5}
                            onChange={(event) =>
                              updateLayer(selectedLayer.id, {
                                y: Number(event.target.value),
                              })
                            }
                            className="w-full mt-2"
                          />
                        </label>
                      </div>
                    </fieldset>
                  )}
                </fieldset>
              </div>

              <div
                className="rounded-xl border p-4 space-y-4"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-bg)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Batch / Export
                </p>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Plus size={16} /> Add images
                </button>
                <p
                  className="text-xs m-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {imageItems.length
                    ? `${imageItems.length} uploaded image${imageItems.length > 1 ? "s" : ""}`
                    : "No images selected yet"}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Format
                    </label>
                    <CreatorSelect
                      value={format}
                      options={[
                        { value: "png", label: "PNG" },
                        { value: "jpg", label: "JPG" },
                        { value: "webp", label: "WEBP" },
                      ]}
                      onChange={setFormat}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Scale
                    </label>
                    <CreatorSelect
                      value={scaleMultiplier}
                      options={[
                        { value: 1, label: "1x" },
                        { value: 2, label: "2x" },
                        { value: 4, label: "4x" },
                      ]}
                      onChange={(value) => setScaleMultiplier(Number(value))}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Quality
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.01"
                    value={quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Rename Prefix
                  </label>
                  <input
                    type="text"
                    value={filePrefix}
                    onChange={(event) => setFilePrefix(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--input-bg)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportSingle}
                    disabled={!imageSrc || isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--color-primary-600)" }}
                  >
                    {isExporting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}{" "}
                    Export Image
                  </button>
                  <button
                    onClick={exportBatch}
                    disabled={imageItems.length < 2 || isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Copy size={16} /> Export ZIP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={watermarkInputRef}
          type="file"
          accept={getImageAcceptAttribute()}
          className="hidden"
          onChange={(event) => handleWatermarkImage(event.target.files[0])}
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept={getImageAcceptAttribute()}
          className="hidden"
          onChange={(event) =>
            handleBaseImages(Array.from(event.target.files || []))
          }
        />
      </div>
    </>
  );
}
