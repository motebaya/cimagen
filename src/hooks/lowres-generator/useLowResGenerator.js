import { useMemo, useRef, useState } from "react";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import useLowResPreview from "./useLowResPreview.js";

const DEFAULT_LOW_RES_SETTINGS = {
  level: 5,
  addJpegArtifacts: true,
  addBlur: true,
  reduceColors: false,
};

const LOW_RES_EXPORT_FORMATS = [
  ["jpg", "JPG"],
  ["png", "PNG"],
  ["webp", "WEBP"],
];

function openFilePicker(input) {
  if (!input) {
    return;
  }

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

function getBaseFilename(filename) {
  return filename.replace(/\.[^/.]+$/, "") || "lowres-image";
}

function formatEnabledEffects(settings) {
  const labels = [];

  if (settings.addJpegArtifacts) {
    labels.push("JPEG");
  }

  if (settings.addBlur) {
    labels.push("Blur");
  }

  if (settings.reduceColors) {
    labels.push("Color reduction");
  }

  return labels.length ? labels.join(", ") : "None";
}

export default function useLowResGenerator() {
  const [exportingFormats, setExportingFormats] = useState({});
  const [fileError, setFileError] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_LOW_RES_SETTINGS);
  const fileInputRef = useRef(null);
  const preview = useLowResPreview({ imageSrc, settings });

  const error = fileError || preview.error;
  const hasImage = Boolean(imageSrc);
  const hasProcessedPreview = Boolean(preview.processedCanvas);

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

    if (!isValidImage(file)) {
      setFileError(
        "Please select a valid image file (JPEG, PNG, WebP, GIF, BMP, or SVG).",
      );
      return;
    }

    if (!isValidSize(file, 20)) {
      setFileError("Image is too large. Please use an image under 20MB.");
      return;
    }

    setFileError(null);
    preview.setError(null);
    setImageFilename(file.name);

    const reader = new FileReader();
    reader.onload = (event) => setImageSrc(event.target?.result || null);
    reader.onerror = () =>
      setFileError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setFileError(null);
    setImageFilename("");
    setImageSrc(null);
    preview.setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = (format) => {
    if (!preview.processedCanvas) {
      return;
    }

    const extension = format === "jpg" ? "jpg" : format;
    const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
    const quality = format === "png" ? undefined : 0.92;

    setExportingFormats((currentState) => ({
      ...currentState,
      [format]: true,
    }));

    preview.processedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          setFileError("Failed to export image. Please try again.");
          setExportingFormats((currentState) => ({
            ...currentState,
            [format]: false,
          }));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `lowres-${getBaseFilename(imageFilename)}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);

        setExportingFormats((currentState) => ({
          ...currentState,
          [format]: false,
        }));
      },
      mimeType,
      quality,
    );
  };

  const exportMetadata = useMemo(() => {
    return [
      [
        "Status",
        !hasImage
          ? "Waiting"
          : preview.isProcessing
            ? "Processing"
            : hasProcessedPreview
              ? "Ready"
              : "Pending",
      ],
      [
        "Output",
        preview.previewDimensions
          ? `${preview.previewDimensions.width} x ${preview.previewDimensions.height}`
          : "-",
      ],
      ["Level", settings.level],
      ["Effects", formatEnabledEffects(settings)],
    ];
  }, [
    hasImage,
    hasProcessedPreview,
    preview.isProcessing,
    preview.previewDimensions,
    settings,
  ]);

  return {
    error,
    exportCard: {
      disabled: !hasImage || !hasProcessedPreview || preview.isProcessing,
      exportFormats: LOW_RES_EXPORT_FORMATS,
      exportMetadata,
      exportingFormats,
      hasImage,
      hasPreview: hasProcessedPreview,
      isProcessing: preview.isProcessing,
      onExport: handleExport,
    },
    previewCard: {
      comparisonSlider: preview.comparisonSlider,
      fileInputRef,
      hasImage,
      hasPreview: hasProcessedPreview,
      imageFilename,
      inputAccept: getImageAcceptAttribute(),
      isProcessing: preview.isProcessing,
      level: settings.level,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      originalCanvasRef: preview.originalCanvasRef,
      processedCanvasRef: preview.processedCanvasRef,
    },
    settingsCard: {
      previewDimensions: preview.previewDimensions,
      settings,
      onUpdateSetting: updateSetting,
    },
  };
}
