import { useMemo, useRef, useState } from "react";
import {
  COLOR_COUNT_OPTIONS,
  HIDDEN_INPUT_STYLE,
  OUTPUT_SCALE_OPTIONS,
  PALETTE_PRESET_OPTIONS,
  PIXEL_BACKGROUND_OPTIONS,
  PIXEL_DITHERING_OPTIONS,
  PIXEL_OUTLINE_OPTIONS,
  PIXEL_SIZE_OPTIONS,
  resolveBackgroundValue,
  readFileAsDataUrl,
} from "../../utils/image-to-pixel/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import usePixelExport from "./usePixelExport.js";
import usePixelPalette from "./usePixelPalette.js";
import usePixelPreview from "./usePixelPreview.js";
import usePixelSettings from "./usePixelSettings.js";

function openFilePicker(input) {
  if (!input) return;

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      // Fall through to click.
    }
  }

  input.click();
}

export default function useImageToPixel() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { settings, updateSetting } = usePixelSettings();
  const backgroundValue = useMemo(
    () =>
      resolveBackgroundValue(settings.background, settings.customBackground),
    [settings.background, settings.customBackground],
  );
  const preview = usePixelPreview({ backgroundValue, imageSrc, settings });
  const exportActions = usePixelExport({
    backgroundValue,
    onError: preview.setError,
    pixelArt: preview.pixelArt,
    settings,
  });
  const paletteCard = usePixelPalette();
  const error = fileError || preview.error;

  const handleFileSelect = async (file) => {
    if (!file) {
      return;
    }

    if (!isValidImage(file)) {
      setFileError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    if (!isValidSize(file, 20)) {
      setFileError("Image is too large. Please use an image under 20MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFileError(null);
      preview.setError(null);
      setImageFilename(file.name);
      setImageSrc(dataUrl);
    } catch (readError) {
      setFileError(readError.message);
    }
  };

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setFileError(null);
    preview.setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    error,
    exportCard: {
      exportFormats: [
        { id: "png", label: "PNG" },
        { id: "pixel-png", label: "Pixel PNG" },
        { id: "svg", label: "SVG" },
        { id: "json", label: "JSON" },
      ],
      exportingFormats: exportActions.exportingFormats,
      hasPixelArt: Boolean(preview.pixelArt),
      metadata: [
        [
          "Pixels",
          preview.pixelArt
            ? `${preview.pixelArt.width} x ${preview.pixelArt.height}`
            : "-",
        ],
        ["Scale", `${settings.outputScale}x`],
        ["Palette", preview.pixelArt?.palette.length || "-"],
        ["Grid", settings.showGrid ? "On" : "Off"],
      ],
      onExport: exportActions.exportFormat,
    },
    paletteCard: {
      isExpanded: paletteCard.isExpanded,
      palette: preview.pixelArt?.palette || [],
      paletteName: settings.palette,
      toggleExpanded: paletteCard.toggleExpanded,
    },
    previewCard: {
      background: backgroundValue,
      comparisonSlider: preview.comparisonSlider,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isProcessing: preview.isProcessing,
      onDragLeave: () => setIsDragging(false),
      onDragOver: (event) => {
        event.preventDefault();
        setIsDragging(true);
      },
      onDrop: (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files?.[0] || null);
      },
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      originalCanvasRef: preview.originalCanvasRef,
      pixelArt: preview.pixelArt,
      previewMeta: preview.previewMeta,
      processedCanvasRef: preview.processedCanvasRef,
    },
    settingsCard: {
      finalPixelDimensions: preview.pixelArt
        ? `${preview.pixelArt.width} x ${preview.pixelArt.height}`
        : null,
      colorCountOptions: COLOR_COUNT_OPTIONS,
      ditheringOptions: PIXEL_DITHERING_OPTIONS,
      outputScaleOptions: OUTPUT_SCALE_OPTIONS.map((value) => ({
        value,
        label: `${value}x`,
        description: "Export multiplier",
      })),
      paletteOptions: PALETTE_PRESET_OPTIONS,
      pixelSizeOptions: PIXEL_SIZE_OPTIONS,
      backgroundOptions: PIXEL_BACKGROUND_OPTIONS,
      outlineOptions: PIXEL_OUTLINE_OPTIONS,
      settings,
      onUpdateSetting: updateSetting,
    },
  };
}
