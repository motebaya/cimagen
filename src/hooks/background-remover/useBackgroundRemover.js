import { useEffect, useMemo, useRef, useState } from "react";
import {
  BACKGROUND_MODE_OPTIONS,
  DEFAULT_BACKGROUND_REMOVAL_SETTINGS,
  EXPORT_FORMATS,
  PREVIEW_MAX_DIMENSION,
  PREVIEW_SEGMENTATION_DIMENSION,
} from "../../utils/background-remover/backgroundRemovalConstants.js";
import {
  drawCanvasSurface,
  loadImageElement,
  readFileAsDataUrl,
} from "../../utils/background-remover/backgroundRemovalHelpers.js";
import { removeBackground } from "../../utils/background-remover/removalPipeline.js";
import useBackgroundRemovalExport from "./useBackgroundRemovalExport.js";
import useBackgroundRemovalModels from "./useBackgroundRemovalModels.js";
import useImageComparisonSlider from "./useImageComparisonSlider.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";

function openFilePicker(input) {
  if (!input) return;

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      // Fall back to click if the browser blocks showPicker.
    }
  }

  input.click();
}

export default function useBackgroundRemover() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [backgroundImageSrc, setBackgroundImageSrc] = useState(null);
  const [backgroundFilename, setBackgroundFilename] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_BACKGROUND_REMOVAL_SETTINGS);

  const imageInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const resultCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const modelState = useBackgroundRemovalModels();
  const comparisonSlider = useImageComparisonSlider(50);

  const { isExporting, exportImage } = useBackgroundRemovalExport({
    imageSrc,
    backgroundImageSrc,
    settings,
    selectedModelId: modelState.selectedModel?.id,
    onError: setError,
  });

  useEffect(() => {
    if (!imageSrc || !modelState.selectedModel) {
      setResult(null);
      return undefined;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    let active = true;
    debounceRef.current = setTimeout(async () => {
      setIsProcessing(true);
      setError(null);

      try {
        const backgroundImage =
          settings.backgroundMode === "image" && backgroundImageSrc
            ? await loadImageElement(
                backgroundImageSrc,
                "Failed to load replacement background.",
              )
            : null;

        const preview = await removeBackground(imageSrc, {
          ...settings,
          modelId: modelState.selectedModel.id,
          backgroundImage,
          previewMaxDimension: PREVIEW_MAX_DIMENSION,
          outputMaxDimension: PREVIEW_MAX_DIMENSION,
          segmentationMaxDimension:
            modelState.selectedModel.segmentationMaxDimension ||
            PREVIEW_SEGMENTATION_DIMENSION,
        });

        if (!active) return;
        drawCanvasSurface(originalCanvasRef.current, preview.originalCanvas);
        drawCanvasSurface(resultCanvasRef.current, preview.canvas);
        setResult(preview);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(processingError.message || "Failed to remove background.");
        }
      } finally {
        if (active) {
          setIsProcessing(false);
        }
      }
    }, 180);

    return () => {
      active = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [imageSrc, backgroundImageSrc, modelState.selectedModel, settings]);

  const inputAccept = getImageAcceptAttribute();

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    if (!isValidSize(file, 20)) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setError(null);
      setImageFilename(file.name);
      setImageSrc(dataUrl);
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleBackgroundImage = async (file) => {
    if (!file) return;

    if (!isValidImage(file)) {
      setError("Please select a valid replacement background image.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setError(null);
      setBackgroundFilename(file.name);
      setBackgroundImageSrc(dataUrl);
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const handleBackgroundInputChange = (event) => {
    handleBackgroundImage(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setResult(null);
    setError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const clearBackgroundReplacement = () => {
    setBackgroundImageSrc(null);
    setBackgroundFilename("");
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  };

  const resultSummary = useMemo(() => {
    if (!result) return null;

    return [
      ["Model", result.model],
      ["Runtime", `${result.backend} / ${result.runtime}`],
      ["Preview", `${result.width} x ${result.height}`],
      ["Output", settings.backgroundMode],
    ];
  }, [result, settings.backgroundMode]);

  return {
    error,
    comparisonPreview: {
      inputAccept,
      imageInputRef,
      imageFilename,
      imageSrc,
      isProcessing,
      originalCanvasRef,
      resultCanvasRef,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(imageInputRef.current),
      onRemoveImage: removeImage,
      comparisonSlider,
    },
    settingsPanel: {
      backgroundFilename,
      backgroundImageSrc,
      backgroundInputRef,
      backgroundModes: BACKGROUND_MODE_OPTIONS,
      exportFormats: EXPORT_FORMATS,
      hasImage: Boolean(imageSrc),
      inputAccept,
      isExporting,
      modelState,
      result,
      resultSummary,
      settings,
      onBackgroundInputChange: handleBackgroundInputChange,
      onClearBackgroundReplacement: clearBackgroundReplacement,
      onExport: exportImage,
      onOpenBackgroundPicker: () => openFilePicker(backgroundInputRef.current),
      onUpdateSetting: updateSetting,
    },
  };
}
