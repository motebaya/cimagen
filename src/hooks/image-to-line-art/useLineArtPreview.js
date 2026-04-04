import { useEffect, useRef, useState } from "react";
import { sourceToCanvas } from "../../utils/canvasUtils.js";
import {
  createLineArt,
  drawCanvasSurface,
  LINE_ART_PREVIEW_MAX_DIMENSION,
  renderLineArtCanvas,
  renderScaledSourceCanvas,
} from "../../utils/image-to-line-art/index.js";

function useBeforeAfterSlider(initialPosition = 50) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(initialPosition);

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return;

    const nextPosition = Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100),
    );
    setPosition(nextPosition);
  };

  return {
    containerRef,
    position,
    sliderHandlers: {
      onPointerDown: (event) => {
        draggingRef.current = true;
        updateFromClientX(event.clientX);
        event.currentTarget.setPointerCapture?.(event.pointerId);
      },
      onPointerMove: (event) => {
        if (!draggingRef.current) return;
        updateFromClientX(event.clientX);
      },
      onPointerUp: (event) => {
        draggingRef.current = false;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      },
      onPointerCancel: (event) => {
        draggingRef.current = false;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      },
    },
  };
}

export default function useLineArtPreview({
  backgroundValue,
  imageSrc,
  settings,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lineArtResult, setLineArtResult] = useState(null);
  const [error, setError] = useState(null);
  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const debounceRef = useRef(null);
  const comparisonSlider = useBeforeAfterSlider(50);

  useEffect(() => {
    if (!imageSrc) {
      setLineArtResult(null);
      setError(null);
      setIsProcessing(false);
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
        const result = await createLineArt(imageSrc, {
          ...settings,
          background: backgroundValue,
          maxDimension: LINE_ART_PREVIEW_MAX_DIMENSION,
        });
        const processedCanvas = renderLineArtCanvas(result, {
          background: backgroundValue,
          customBackground: settings.customBackground,
          invert: settings.invert,
        });
        const sourceCanvas = await sourceToCanvas(imageSrc);
        const originalCanvas = renderScaledSourceCanvas(
          sourceCanvas,
          processedCanvas.width,
          processedCanvas.height,
        );

        if (!active) return;

        drawCanvasSurface(originalCanvasRef.current, originalCanvas);
        drawCanvasSurface(processedCanvasRef.current, processedCanvas);
        setLineArtResult(result);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(processingError.message || "Failed to generate line art.");
          setLineArtResult(null);
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
  }, [backgroundValue, imageSrc, settings]);

  return {
    comparisonSlider,
    error,
    isProcessing,
    lineArtResult,
    originalCanvasRef,
    processedCanvasRef,
    setError,
  };
}
