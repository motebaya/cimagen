import { useMemo, useRef, useState } from "react";
import {
  ANSI_BACKGROUND_OPTIONS,
  ANSI_CHARSET_PRESET_OPTIONS,
  ANSI_COLOR_MODE_OPTIONS,
  ANSI_COLUMN_PRESETS,
  ANSI_OUTPUT_FORMAT_OPTIONS,
  ANSI_PREVIEW_MODE_OPTIONS,
  ANSI_RENDER_MODE_OPTIONS,
  DEFAULT_ANSI_SETTINGS,
  getBlockCharacterOptions,
  resolveBackgroundValue,
} from "../../utils/image-to-ansi-art/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import useAnsiExport from "./useAnsiExport.js";
import useAnsiPreviewMode from "./useAnsiPreviewMode.js";
import useAnsiRenderer from "./useAnsiRenderer.js";
import useAnsiTerminalTheme from "./useAnsiTerminalTheme.js";

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

export default function useImageToAnsiArt() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [settings, setSettings] = useState(DEFAULT_ANSI_SETTINGS);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const { previewMode, setPreviewMode } = useAnsiPreviewMode("ansi");
  const { terminalTheme } = useAnsiTerminalTheme(settings.terminalTheme);

  const backgroundValue = useMemo(
    () => resolveBackgroundValue(settings),
    [settings],
  );
  const renderSettings = useMemo(
    () => ({
      ...settings,
      background: backgroundValue,
    }),
    [backgroundValue, settings],
  );

  const renderer = useAnsiRenderer({ imageSrc, renderSettings });

  const exportActions = useAnsiExport({
    ansiResult: renderer.ansiResult,
    fontSize: settings.fontSize,
    lineHeight: settings.lineHeight,
    terminalTheme,
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
    if (!renderer.ansiResult) {
      return [
        ["Cells", "-"],
        ["Rows", "-"],
        ["Characters", "-"],
        ["Format", settings.outputFormat],
      ];
    }

    return [
      ["Cells", renderer.ansiResult.columns],
      ["Rows", renderer.ansiResult.rows],
      ["Characters", renderer.ansiResult.characterCount],
      ["Format", settings.outputFormat],
      ["Charset", renderer.ansiResult.charsetPreset],
    ];
  }, [renderer.ansiResult, settings.outputFormat]);

  return {
    error,
    exportCard: {
      ansiResult: renderer.ansiResult,
      copyState: exportActions.copyState,
      exportMetadata,
      onCopyText: exportActions.copyText,
      onDownloadPreviewImage: exportActions.downloadPreviewImage,
      onDownloadText: exportActions.downloadText,
    },
    previewCard: {
      ansiResult: renderer.ansiResult,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isProcessing: renderer.isProcessing,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onPreviewModeChange: setPreviewMode,
      onRemoveImage: removeImage,
      previewMode,
      previewModeOptions: ANSI_PREVIEW_MODE_OPTIONS,
      settings,
      terminalTheme,
    },
    settingsCard: {
      backgroundOptions: ANSI_BACKGROUND_OPTIONS,
      blockCharacterOptions: getBlockCharacterOptions(),
      charsetPresetOptions: ANSI_CHARSET_PRESET_OPTIONS,
      colorModeOptions: ANSI_COLOR_MODE_OPTIONS,
      columnPresets: ANSI_COLUMN_PRESETS,
      outputFormatOptions: ANSI_OUTPUT_FORMAT_OPTIONS,
      renderModeOptions: ANSI_RENDER_MODE_OPTIONS,
      settings,
      onUpdateSetting: updateSetting,
    },
  };
}
