import { useMemo, useRef, useState } from "react";
import {
  ASCII_BACKGROUND_OPTIONS,
  ASCII_EXPORT_FORMATS,
  ASCII_PREVIEW_MODE_OPTIONS,
  getCharsetPresetOptions,
  getTextColorForBackground,
  resolveBackgroundValue,
} from "../../utils/image-to-ascii/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import useAsciiExport from "./useAsciiExport.js";
import useAsciiPreviewMode from "./useAsciiPreviewMode.js";
import useAsciiRenderer from "./useAsciiRenderer.js";
import useAsciiSettings from "./useAsciiSettings.js";

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

export default function useImageToAscii() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { settings, updateCharset, updateCharsetPreset, updateSetting } =
    useAsciiSettings();
  const renderer = useAsciiRenderer({ imageSrc, settings });
  const { previewMode, setPreviewMode } = useAsciiPreviewMode("ascii");
  const backgroundValue = useMemo(
    () =>
      resolveBackgroundValue(settings.background, settings.customBackground),
    [settings.background, settings.customBackground],
  );
  const textColor = useMemo(
    () => getTextColorForBackground(backgroundValue),
    [backgroundValue],
  );
  const exportActions = useAsciiExport({
    asciiResult: renderer.asciiResult,
    backgroundValue,
    settings,
    textColor,
  });

  const error = fileError || renderer.error;

  const handleFileSelect = (file) => {
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

    setFileError(null);
    renderer.setError(null);
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
    setImageSrc(null);
    setImageFilename("");
    setFileError(null);
    renderer.setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    error,
    exportCard: {
      asciiMeta: renderer.asciiMeta,
      copyState: exportActions.copyState,
      exportFormats: ASCII_EXPORT_FORMATS,
      exportingFormats: exportActions.exportingFormats,
      hasResult: Boolean(renderer.asciiResult),
      onCopyText: exportActions.copyText,
      onDownloadImage: exportActions.downloadImage,
      onDownloadText: exportActions.downloadText,
      settings,
    },
    previewCard: {
      asciiMeta: renderer.asciiMeta,
      asciiResult: renderer.asciiResult,
      backgroundValue,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isProcessing: renderer.isProcessing,
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
      onPreviewModeChange: setPreviewMode,
      onRemoveImage: removeImage,
      previewMode,
      previewModeOptions: ASCII_PREVIEW_MODE_OPTIONS,
      settings,
      textColor,
    },
    settingsCard: {
      backgroundOptions: ASCII_BACKGROUND_OPTIONS,
      charsetOptions: getCharsetPresetOptions(),
      finalAsciiSize: renderer.asciiMeta
        ? `${renderer.asciiMeta.columns} x ${renderer.asciiMeta.lines}`
        : null,
      settings,
      onUpdateCharset: updateCharset,
      onUpdateCharsetPreset: updateCharsetPreset,
      onUpdateSetting: updateSetting,
    },
  };
}
