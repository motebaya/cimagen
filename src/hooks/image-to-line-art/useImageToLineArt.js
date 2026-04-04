import { useMemo, useRef, useState } from "react";
import {
  DEFAULT_LINE_ART_SETTINGS,
  LINE_ART_BACKGROUND_OPTIONS,
  LINE_ART_EXPORT_FORMATS,
  LINE_ART_MODE_OPTIONS,
  LINE_ART_OUTPUT_SCALE_OPTIONS,
  LINE_ART_QUICK_MODES,
  LINE_ART_THICKNESS_OPTIONS,
  resolveBackgroundValue,
} from "../../utils/image-to-line-art/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import useLineArtExport from "./useLineArtExport.js";
import useLineArtPreview from "./useLineArtPreview.js";
import useLineArtQuickModes from "./useLineArtQuickModes.js";

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

export default function useImageToLineArt() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [settings, setSettings] = useState(DEFAULT_LINE_ART_SETTINGS);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const backgroundValue = useMemo(
    () => resolveBackgroundValue(settings),
    [settings],
  );
  const preview = useLineArtPreview({ backgroundValue, imageSrc, settings });
  const quickModes = useLineArtQuickModes(setSettings);
  const exportActions = useLineArtExport({
    backgroundValue,
    imageSrc,
    onError: preview.setError,
    settings,
  });

  const error = fileError || preview.error;

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
    setImageSrc(null);
    setImageFilename("");
    setFileError(null);
    preview.setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const exportMetadata = useMemo(() => {
    if (!preview.lineArtResult) {
      return [
        ["Preview", "-"],
        ["Coverage", "-"],
        ["Mode", settings.mode],
        ["Scale", `${settings.outputScale}x`],
      ];
    }

    return [
      [
        "Preview",
        `${preview.lineArtResult.width} x ${preview.lineArtResult.height}`,
      ],
      ["Coverage", `${(preview.lineArtResult.coverage * 100).toFixed(1)}%`],
      ["Mode", settings.mode],
      ["Scale", `${settings.outputScale}x`],
    ];
  }, [preview.lineArtResult, settings.mode, settings.outputScale]);

  return {
    error,
    exportCard: {
      exportFormats: LINE_ART_EXPORT_FORMATS,
      exportMetadata,
      exportingFormats: exportActions.exportingFormats,
      hasImage: Boolean(imageSrc),
      onExport: exportActions.exportLineArt,
    },
    previewCard: {
      background: backgroundValue,
      comparisonSlider: preview.comparisonSlider,
      coverage: preview.lineArtResult?.coverage || null,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isProcessing: preview.isProcessing,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      originalCanvasRef: preview.originalCanvasRef,
      processedCanvasRef: preview.processedCanvasRef,
    },
    settingsCard: {
      edgeCoverage: preview.lineArtResult?.coverage || null,
      activeQuickMode: quickModes.activeQuickMode,
      backgroundOptions: LINE_ART_BACKGROUND_OPTIONS,
      modeOptions: LINE_ART_MODE_OPTIONS,
      outputScaleOptions: LINE_ART_OUTPUT_SCALE_OPTIONS,
      quickModes: LINE_ART_QUICK_MODES,
      settings,
      thicknessOptions: LINE_ART_THICKNESS_OPTIONS,
      onApplyQuickMode: quickModes.applyQuickMode,
      onUpdateSetting: quickModes.updateSetting,
    },
  };
}
