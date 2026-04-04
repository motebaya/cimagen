import { useEffect, useRef, useState } from "react";
import { sourceToCanvas } from "../../utils/canvasUtils.js";
import { degradeImage } from "../../utils/imageDegradation.js";
import useBeforeAfterSlider from "./useBeforeAfterSlider.js";

function clearCanvasSurface(surface) {
  if (!surface) {
    return;
  }

  const context = surface.getContext("2d");
  context?.clearRect(0, 0, surface.width, surface.height);
  surface.width = 0;
  surface.height = 0;
}

function drawCanvasSurface(surface, source) {
  if (!surface || !source) {
    return;
  }

  surface.width = source.width;
  surface.height = source.height;
  const context = surface.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, surface.width, surface.height);
  context.drawImage(source, 0, 0);
}

export default function useLowResPreview({ imageSrc, settings }) {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewDimensions, setPreviewDimensions] = useState(null);
  const [sourceCanvas, setSourceCanvas] = useState(null);
  const [processedCanvas, setProcessedCanvas] = useState(null);
  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const debounceRef = useRef(null);
  const comparisonSlider = useBeforeAfterSlider(50);

  useEffect(() => {
    if (!sourceCanvas || !processedCanvas) {
      clearCanvasSurface(originalCanvasRef.current);
      clearCanvasSurface(processedCanvasRef.current);
      return;
    }

    drawCanvasSurface(originalCanvasRef.current, sourceCanvas);
    drawCanvasSurface(processedCanvasRef.current, processedCanvas);
  }, [processedCanvas, sourceCanvas]);

  useEffect(() => {
    if (!imageSrc) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      clearCanvasSurface(originalCanvasRef.current);
      clearCanvasSurface(processedCanvasRef.current);
      setError(null);
      setIsProcessing(false);
      setPreviewDimensions(null);
      setSourceCanvas(null);
      setProcessedCanvas(null);
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
        const sourceCanvas = await sourceToCanvas(imageSrc);
        const degradedCanvas = await degradeImage(sourceCanvas, settings);

        if (!active) {
          return;
        }

        setSourceCanvas(sourceCanvas);
        setPreviewDimensions({
          width: degradedCanvas.width,
          height: degradedCanvas.height,
        });
        setProcessedCanvas(degradedCanvas);
      } catch (processingError) {
        console.error(processingError);

        if (!active) {
          return;
        }

        clearCanvasSurface(originalCanvasRef.current);
        clearCanvasSurface(processedCanvasRef.current);
        setPreviewDimensions(null);
        setSourceCanvas(null);
        setProcessedCanvas(null);
        setError(
          processingError.message ||
            "Failed to generate low-resolution preview.",
        );
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
  }, [imageSrc, settings]);

  return {
    comparisonSlider,
    error,
    isProcessing,
    originalCanvasRef,
    previewDimensions,
    processedCanvas,
    processedCanvasRef,
    setError,
  };
}
