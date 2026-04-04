import { useMemo, useRef, useState } from "react";
import {
  DEFAULT_EMOJI_MOSAIC_SETTINGS,
  EMOJI_BACKGROUND_OPTIONS,
  EMOJI_EXPORT_FORMATS,
  EMOJI_MATCH_MODE_OPTIONS,
  EMOJI_PREVIEW_MODE_OPTIONS,
  resolveBackgroundValue,
} from "../../utils/image-to-emoji-mosaic/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import useEmojiMosaicExport from "./useEmojiMosaicExport.js";
import useEmojiPalette from "./useEmojiPalette.js";
import useEmojiPreviewMode from "./useEmojiPreviewMode.js";
import useEmojiRenderer from "./useEmojiRenderer.js";

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

export default function useImageToEmojiMosaic() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [settings, setSettings] = useState(DEFAULT_EMOJI_MOSAIC_SETTINGS);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const { previewMode, setPreviewMode } = useEmojiPreviewMode("mosaic");
  const { presetOptions } = useEmojiPalette();
  const backgroundValue = useMemo(
    () => resolveBackgroundValue(settings),
    [settings],
  );
  const renderer = useEmojiRenderer({ imageSrc, settings, backgroundValue });
  const exportActions = useEmojiMosaicExport({
    backgroundValue,
    mosaic: renderer.mosaic,
    onError: renderer.setError,
    settings,
  });

  const error = fileError || renderer.error;

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

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

  const exportMetadata = useMemo(() => {
    if (!renderer.mosaic) {
      return [
        ["Grid", "-"],
        ["Emoji Count", "-"],
        ["Dataset", "-"],
        ["Background", settings.background],
      ];
    }

    return [
      ["Grid", `${renderer.mosaic.columns} x ${renderer.mosaic.rowCount}`],
      ["Emoji Count", renderer.mosaic.emojiCount],
      ["Dataset", renderer.mosaic.datasetSize],
      ["Background", backgroundValue],
    ];
  }, [backgroundValue, renderer.mosaic, settings.background]);

  return {
    error,
    exportCard: {
      copyState: exportActions.copyState,
      exportFormats: EMOJI_EXPORT_FORMATS,
      exportMetadata,
      exportingFormats: exportActions.exportingFormats,
      hasMosaic: Boolean(renderer.mosaic),
      onCopyText: exportActions.copyText,
      onDownloadImage: exportActions.downloadImage,
      onDownloadJson: exportActions.downloadJson,
      onDownloadTxt: exportActions.downloadTxt,
    },
    previewCard: {
      background: backgroundValue,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isProcessing: renderer.isProcessing,
      mosaic: renderer.mosaic,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onPreviewModeChange: setPreviewMode,
      onRemoveImage: removeImage,
      previewCanvas: renderer.previewCanvas,
      previewMode,
      previewModeOptions: EMOJI_PREVIEW_MODE_OPTIONS,
    },
    settingsCard: {
      liveGridSummary: renderer.mosaic
        ? `${renderer.mosaic.columns} x ${renderer.mosaic.rowCount}`
        : `${settings.columns} x ${settings.preserveAspectRatio ? "auto" : settings.rows}`,
      liveEmojiCount: renderer.mosaic?.emojiCount || null,
      backgroundOptions: EMOJI_BACKGROUND_OPTIONS,
      matchModeOptions: EMOJI_MATCH_MODE_OPTIONS,
      presetOptions,
      settings,
      onUpdateSetting: updateSetting,
    },
  };
}
