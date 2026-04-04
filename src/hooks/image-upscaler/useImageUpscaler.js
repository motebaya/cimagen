import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_UPSCALER_SETTINGS,
  PREVIEW_MAX_DIMENSIONS,
  UPSCALE_EXPORT_FORMATS,
  drawCanvasSurface,
  formatDuration,
  readFileAsDataUrl,
  resizeCanvas,
  upscaleImage,
} from "../../utils/image-upscaler/index.js";
import useBeforeAfterSlider from "./useBeforeAfterSlider.js";
import useUpscalerExport from "./useUpscalerExport.js";
import useUpscalerLoading from "./useUpscalerLoading.js";
import useUpscalerModels from "./useUpscalerModels.js";
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
      // Fall back to click if showPicker is unavailable.
    }
  }

  input.click();
}

export default function useImageUpscaler() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [error, setError] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_UPSCALER_SETTINGS);
  const fileInputRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const resultCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const comparisonSlider = useBeforeAfterSlider(50);
  const loadingState = useUpscalerLoading();
  const modelState = useUpscalerModels();
  const { exportUpscaledImage, exportingFormats } = useUpscalerExport({
    imageSrc,
    selectedModel: modelState.selectedModel,
    settings,
    onError: setError,
  });

  useEffect(() => {
    if (!modelState.selectedModel) {
      return;
    }

    if (!modelState.selectedModel.scaleOptions.includes(settings.scale)) {
      setSettings((current) => ({
        ...current,
        scale: modelState.selectedModel.scaleOptions[0],
      }));
    }
  }, [modelState.selectedModel, settings.scale]);

  useEffect(() => {
    if (!imageSrc || !modelState.selectedModel) {
      setPreviewResult(null);
      return undefined;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    let active = true;
    debounceRef.current = setTimeout(async () => {
      loadingState.startLoading("Loading model");
      setError(null);

      try {
        const result = await upscaleImage(imageSrc, {
          ...settings,
          modelId: modelState.selectedModel.id,
          previewMaxDimension:
            modelState.selectedModel.previewMaxDimension ||
            PREVIEW_MAX_DIMENSIONS.balanced,
          onStatus: loadingState.updateLoadingStatus,
        });

        if (!active) return;
        const comparisonCanvas = resizeCanvas(
          result.inputCanvas,
          result.canvas.width,
          result.canvas.height,
          {
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          },
        );
        drawCanvasSurface(originalCanvasRef.current, comparisonCanvas);
        drawCanvasSurface(resultCanvasRef.current, result.canvas);
        setPreviewResult(result);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(
            processingError.message || "Failed to build upscale preview.",
          );
          setPreviewResult(null);
        }
      } finally {
        if (active) {
          loadingState.stopLoading();
        }
      }
    }, 160);

    return () => {
      active = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    imageSrc,
    loadingState.startLoading,
    loadingState.stopLoading,
    loadingState.updateLoadingStatus,
    modelState.selectedModel,
    settings,
  ]);

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

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setPreviewResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resultSummary = useMemo(() => {
    if (!previewResult || !modelState.selectedModel) {
      return [
        ["Source", "-"],
        ["Output", "-"],
        ["Model", modelState.selectedModel?.label || "-"],
        ["Preview time", "-"],
      ];
    }

    return [
      [
        "Source",
        `${previewResult.sourceWidth} x ${previewResult.sourceHeight}`,
      ],
      [
        "Output",
        `${previewResult.expectedOutputWidth} x ${previewResult.expectedOutputHeight}`,
      ],
      ["Model", previewResult.model],
      ["Preview time", formatDuration(previewResult.processingTimeMs)],
    ];
  }, [modelState.selectedModel, previewResult]);

  const performanceWarning = useMemo(() => {
    const sourceWidth = previewResult?.sourceWidth || 0;
    const sourceHeight = previewResult?.sourceHeight || 0;
    const isLargeSource = sourceWidth * sourceHeight >= 1800 * 1200;

    if (
      modelState.selectedModel?.tier === "heavy" &&
      settings.scale === 4 &&
      isLargeSource
    ) {
      return "Heavy 4x on large images can use substantial memory and take longer. If the browser feels slow, try Quality 2x first.";
    }

    return null;
  }, [
    modelState.selectedModel?.tier,
    previewResult?.sourceHeight,
    previewResult?.sourceWidth,
    settings.scale,
  ]);

  return {
    error,
    previewCard: {
      comparisonSlider,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      inputAccept: getImageAcceptAttribute(),
      isBusy: loadingState.isLoading,
      loadingElapsed: loadingState.loadingLabel,
      loadingStatus: loadingState.status,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      originalCanvasRef,
      processedCanvasRef: resultCanvasRef,
    },
    resultDetailsCard: {
      exportFormats: UPSCALE_EXPORT_FORMATS,
      hasImage: Boolean(imageSrc),
      exportingFormats,
      onExport: exportUpscaledImage,
      resultSummary,
      selectedModel: modelState.selectedModel,
      upscaleScale: settings.scale,
    },
    settingsCard: {
      hasImage: Boolean(imageSrc),
      modelState,
      performanceWarning,
      settings,
      onUpdateSetting: updateSetting,
    },
  };
}
