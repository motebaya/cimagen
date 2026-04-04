import { useEffect, useMemo, useRef, useState } from "react";
import {
  BLUR_EFFECT_OPTIONS,
  DEFAULT_FACE_BLUR_SETTINGS,
  EXPORT_FORMATS,
  FACE_MASK_SHAPE_OPTIONS,
  PREVIEW_MAX_DIMENSION,
} from "../../utils/face-blur/faceBlurConstants.js";
import {
  detectFaces,
  drawCanvasSurface,
  fitCanvasToMaxDimension,
  readFileAsDataUrl,
  syncFaceActivity,
} from "../../utils/face-blur/index.js";
import { renderFaceBlurPreview } from "../../utils/face-blur/blurPipeline.js";
import { sourceToCanvas } from "../../utils/canvasUtils.js";
import useBeforeAfterSlider from "./useBeforeAfterSlider.js";
import useFaceBlurExport from "./useFaceBlurExport.js";
import useFaceDetectionModels from "./useFaceDetectionModels.js";
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
      // Fall back to click when showPicker is unavailable.
    }
  }

  input.click();
}

export default function useFaceBlur() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [faces, setFaces] = useState([]);
  const [detectionInfo, setDetectionInfo] = useState(null);
  const [previewSourceCanvas, setPreviewSourceCanvas] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_FACE_BLUR_SETTINGS);

  const imageInputRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const renderDebounceRef = useRef(null);

  const modelState = useFaceDetectionModels();
  const comparisonSlider = useBeforeAfterSlider(50);
  const { isExporting, exportImage } = useFaceBlurExport({
    imageSrc,
    faces,
    settings,
    onError: setError,
  });

  useEffect(() => {
    if (!imageSrc || !modelState.selectedModel) {
      setFaces([]);
      setPreviewSourceCanvas(null);
      setDetectionInfo(null);
      return undefined;
    }

    let active = true;
    setIsDetecting(true);
    setError(null);

    detectFaces(imageSrc, {
      modelId: modelState.selectedModel.id,
      previewMaxDimension: PREVIEW_MAX_DIMENSION,
      detectionSensitivity: settings.detectionSensitivity,
      maxDetectedFaces:
        modelState.selectedModel.maxDetectedFaces || settings.maxDetectedFaces,
    })
      .then((result) => {
        if (!active) return;
        setPreviewSourceCanvas(result.previewCanvas);
        setFaces((current) => syncFaceActivity(current, result.faces));
        setDetectionInfo({
          backend: result.backend,
          model: result.model,
          note: result.note,
          warning: result.warning,
        });
      })
      .catch((detectionError) => {
        console.error(detectionError);
        if (active) {
          setError(detectionError.message || "Face detection failed.");
          setFaces([]);
          setDetectionInfo(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsDetecting(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    imageSrc,
    modelState.selectedModel,
    settings.detectionSensitivity,
    settings.maxDetectedFaces,
  ]);

  useEffect(() => {
    if (!imageSrc) {
      if (originalCanvasRef.current) {
        const context = originalCanvasRef.current.getContext("2d");
        context.clearRect(
          0,
          0,
          originalCanvasRef.current.width,
          originalCanvasRef.current.height,
        );
      }
      if (processedCanvasRef.current) {
        const context = processedCanvasRef.current.getContext("2d");
        context.clearRect(
          0,
          0,
          processedCanvasRef.current.width,
          processedCanvasRef.current.height,
        );
      }
      return undefined;
    }

    if (renderDebounceRef.current) {
      clearTimeout(renderDebounceRef.current);
    }

    let active = true;
    renderDebounceRef.current = setTimeout(async () => {
      setIsRendering(true);

      try {
        const baseCanvas =
          previewSourceCanvas ||
          fitCanvasToMaxDimension(
            await sourceToCanvas(imageSrc),
            PREVIEW_MAX_DIMENSION,
          );
        if (!active) return;

        drawCanvasSurface(originalCanvasRef.current, baseCanvas);
        const processedCanvas =
          renderFaceBlurPreview(baseCanvas, faces, settings) || baseCanvas;
        drawCanvasSurface(processedCanvasRef.current, processedCanvas);
      } catch (renderError) {
        console.error(renderError);
        if (active) {
          setError(
            renderError.message || "Failed to render face blur preview.",
          );
        }
      } finally {
        if (active) {
          setIsRendering(false);
        }
      }
    }, 120);

    return () => {
      active = false;
      if (renderDebounceRef.current) {
        clearTimeout(renderDebounceRef.current);
      }
    };
  }, [imageSrc, previewSourceCanvas, faces, settings]);

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
      setFaces([]);
      setDetectionInfo(null);
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setFaces([]);
    setPreviewSourceCanvas(null);
    setDetectionInfo(null);
    setError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const toggleFace = (faceId) => {
    setFaces((current) =>
      current.map((face) =>
        face.id === faceId ? { ...face, active: !face.active } : face,
      ),
    );
  };

  const setAllFacesActive = (active) => {
    setFaces((current) => current.map((face) => ({ ...face, active })));
  };

  const resultSummary = useMemo(
    () => [
      ["Detected", faces.length],
      ["Blurred", faces.filter((face) => face.active).length],
      ["Method", settings.effect],
      ["Detector", detectionInfo?.model || "-"],
    ],
    [detectionInfo?.model, faces, settings.effect],
  );

  const crowdedHint = useMemo(() => {
    if (faces.length < 5 || modelState.selectedTier === "heavy") {
      return null;
    }

    return "Detected faces: crowded mode recommended for stronger small-face coverage.";
  }, [faces.length, modelState.selectedTier]);

  return {
    error,
    previewCard: {
      comparisonSlider,
      faces,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageInputRef,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isBusy: isDetecting || isRendering,
      originalCanvasRef,
      processedCanvasRef,
      showBoxes: settings.showBoxes,
      onFileSelect: handleFileSelect,
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(imageInputRef.current),
      onRemoveImage: removeImage,
      onToggleFace: toggleFace,
    },
    settingsCard: {
      activeFaceCount: faces.filter((face) => face.active).length,
      crowdedHint,
      faceCount: faces.length,
      hasImage: Boolean(imageSrc),
      modelState,
      effectOptions: BLUR_EFFECT_OPTIONS,
      shapeOptions: FACE_MASK_SHAPE_OPTIONS,
      settings,
      onSetAllFacesActive: setAllFacesActive,
      onUpdateSetting: updateSetting,
    },
    resultDetailsCard: {
      crowdedHint,
      detectionInfo,
      exportFormats: EXPORT_FORMATS,
      faces,
      isExporting,
      resultSummary,
      onExport: exportImage,
    },
  };
}
