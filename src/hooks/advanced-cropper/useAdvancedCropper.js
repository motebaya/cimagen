import { useEffect, useMemo, useRef, useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import {
  CROP_ASPECT_PRESETS,
  CROP_SHAPE_OPTIONS,
  DEFAULT_CROP_SETTINGS,
  EXPORT_FORMATS,
  PREVIEW_MAX_HEIGHT,
  PREVIEW_MAX_WIDTH,
  drawCanvasSurface,
  renderCropPreview,
  exportCroppedImage,
} from "../../utils/advanced-cropper/index.js";
import { clamp, isNearlyEqual } from "../../utils/advanced-cropper/cropMath.js";
import useCropInteractions from "./useCropInteractions.js";
import useCropZoom from "./useCropZoom.js";

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function openFilePicker(input) {
  if (!input) return;

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      // Fall back to click when showPicker is unavailable.
    }
  }

  input.click();
}

export default function useAdvancedCropper() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_CROP_SETTINGS);
  const [previewWidth, setPreviewWidth] = useState(PREVIEW_MAX_WIDTH);

  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewFrameRef = useRef(null);

  const selectedAspect = useMemo(
    () =>
      CROP_ASPECT_PRESETS.find((preset) => preset.key === settings.aspectKey) ||
      CROP_ASPECT_PRESETS[1],
    [settings.aspectKey],
  );

  const { setZoom, adjustZoom } = useCropZoom(setSettings);

  useEffect(() => {
    const node = previewFrameRef.current;
    if (!node) {
      return undefined;
    }

    const updateWidth = () => {
      const nextWidth = Math.min(
        PREVIEW_MAX_WIDTH,
        Math.max(320, Math.floor(node.clientWidth)),
      );
      setPreviewWidth((current) =>
        current === nextWidth ? current : nextWidth,
      );
    };

    updateWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!imageSrc) {
      setPreviewInfo(null);
      setIsProcessing(false);
      return undefined;
    }

    let active = true;

    const render = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        const preview = await renderCropPreview(imageSrc, {
          previewWidth,
          previewHeight: PREVIEW_MAX_HEIGHT,
          aspectRatio: selectedAspect.ratio,
          shape: settings.shape,
          zoom: settings.zoom,
          rotation: settings.rotation,
          offsetX: settings.offsetX,
          offsetY: settings.offsetY,
          flipX: settings.flipX,
          flipY: settings.flipY,
          polygonSides: settings.polygonSides,
          showGrid: settings.showGrid,
          showSafeArea: settings.showSafeArea,
          transparentBackground: settings.transparentBackground,
          backgroundColor: settings.backgroundColor,
          previewBackgroundColor: "#f8fafc",
        });

        if (!active) return;
        drawCanvasSurface(previewCanvasRef.current, preview.canvas);
        setPreviewInfo(preview);

        if (
          !isNearlyEqual(preview.appliedOffsets.offsetX, settings.offsetX) ||
          !isNearlyEqual(preview.appliedOffsets.offsetY, settings.offsetY)
        ) {
          setSettings((current) => {
            if (
              isNearlyEqual(current.offsetX, preview.appliedOffsets.offsetX) &&
              isNearlyEqual(current.offsetY, preview.appliedOffsets.offsetY)
            ) {
              return current;
            }

            return {
              ...current,
              offsetX: preview.appliedOffsets.offsetX,
              offsetY: preview.appliedOffsets.offsetY,
            };
          });
        }
      } catch (renderError) {
        console.error(renderError);
        if (active) {
          setError(renderError.message || "Failed to render crop preview.");
        }
      } finally {
        if (active) {
          setIsProcessing(false);
        }
      }
    };

    render();

    return () => {
      active = false;
    };
  }, [imageSrc, previewWidth, selectedAspect.ratio, settings]);

  const updateSetting = (key, value) => {
    if (key === "zoom") {
      setZoom(value);
      return;
    }

    setSettings((current) => ({ ...current, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const updateOffsets = (offsetXDelta, offsetYDelta) => {
    setSettings((current) => ({
      ...current,
      offsetX: clamp(
        current.offsetX + offsetXDelta,
        -(previewInfo?.offsetLimits?.offsetX ?? Infinity),
        previewInfo?.offsetLimits?.offsetX ?? Infinity,
      ),
      offsetY: clamp(
        current.offsetY + offsetYDelta,
        -(previewInfo?.offsetLimits?.offsetY ?? Infinity),
        previewInfo?.offsetLimits?.offsetY ?? Infinity,
      ),
    }));
  };

  const interactionHandlers = useCropInteractions({
    previewCanvasRef,
    previewInfo,
    adjustZoom,
    updateOffsets,
  });

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    if (!isValidSize(file, 20)) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }

    setError(null);
    setImageFilename(file.name);

    const reader = new FileReader();
    reader.onload = (event) => setImageSrc(event.target?.result || null);
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setPreviewInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const centerImage = () => {
    setSettings((current) => ({ ...current, offsetX: 0, offsetY: 0 }));
  };

  const resetTransforms = () => {
    setSettings((current) => ({
      ...current,
      zoom: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      flipX: false,
      flipY: false,
    }));
  };

  const handleExport = async (format) => {
    if (!imageSrc || isExporting) return;

    setIsExporting(true);
    setError(null);

    try {
      const canvas = await exportCroppedImage(imageSrc, {
        aspectRatio: selectedAspect.ratio,
        shape: settings.shape,
        zoom: settings.zoom,
        rotation: settings.rotation,
        offsetX: settings.offsetX,
        offsetY: settings.offsetY,
        flipX: settings.flipX,
        flipY: settings.flipY,
        polygonSides: settings.polygonSides,
        transparentBackground: settings.transparentBackground,
        backgroundColor: settings.backgroundColor,
        outputWidth: settings.outputWidth,
        scaleMultiplier: settings.scaleMultiplier,
      });
      await downloadCanvas(
        canvas,
        `crop_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (exportError) {
      console.error(exportError);
      setError(exportError.message || "Failed to export cropped image.");
    } finally {
      setIsExporting(false);
    }
  };

  const openImagePicker = () => {
    openFilePicker(fileInputRef.current);
  };

  return {
    error,
    previewCard: {
      fileInputRef,
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isProcessing,
      previewCanvasRef,
      previewFrameRef,
      onFileInputChange: handleFileInputChange,
      onFileSelect: handleFileSelect,
      onOpenImagePicker: openImagePicker,
      onRemoveImage: removeImage,
      interactionHandlers,
    },
    cropTypeCard: {
      presets: CROP_ASPECT_PRESETS,
      selectedAspectKey: settings.aspectKey,
      onSelectAspect: (aspectKey) => updateSetting("aspectKey", aspectKey),
    },
    settingsCard: {
      hasImage: Boolean(imageSrc),
      settings,
      shapeOptions: CROP_SHAPE_OPTIONS,
      onUpdateSetting: updateSetting,
      onToggleSetting: toggleSetting,
      onCenterImage: centerImage,
      onResetTransforms: resetTransforms,
    },
    exportCard: {
      exportFormats: EXPORT_FORMATS,
      hasImage: Boolean(imageSrc),
      isExporting,
      onExport: handleExport,
    },
  };
}
