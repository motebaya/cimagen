import { useEffect, useMemo, useRef, useState } from "react";
import { sourceToCanvas } from "../../utils/canvasUtils.js";
import {
  createPixelArt,
  createPixelPreviewOriginalCanvas,
  drawCanvasSurface,
  PIXEL_PREVIEW_MAX_EDGE,
  renderPixelArtCanvas,
} from "../../utils/image-to-pixel/index.js";

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

export default function usePixelPreview({
  backgroundValue,
  imageSrc,
  settings,
}) {
  const [pixelArt, setPixelArt] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewMeta, setPreviewMeta] = useState(null);
  const originalCanvasRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const debounceRef = useRef(null);
  const comparisonSlider = useBeforeAfterSlider(50);

  const previewScale = useMemo(() => {
    if (!pixelArt) {
      return 8;
    }

    return Math.max(
      2,
      Math.min(18, Math.floor(520 / Math.max(pixelArt.width, pixelArt.height))),
    );
  }, [pixelArt]);

  useEffect(() => {
    if (!imageSrc) {
      setPixelArt(null);
      setPreviewMeta(null);
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
        const result = await createPixelArt(imageSrc, {
          pixelSize: settings.pixelSize,
          colorCount: settings.colorCount,
          palette: settings.palette,
          customPalette: settings.customPaletteText.split(/[\n,]/),
          dithering: settings.dithering,
          sharpen: settings.sharpen,
          blur: settings.blur,
          contrast: settings.contrast,
          outline: settings.outline,
          background: backgroundValue,
        });

        const processedCanvas = renderPixelArtCanvas(result, {
          scale: previewScale,
          background: backgroundValue,
          showGrid: settings.showGrid,
          smoothing: false,
        });

        const sourceCanvas = await sourceToCanvas(imageSrc);
        const originalCanvas = createPixelPreviewOriginalCanvas(
          sourceCanvas,
          processedCanvas,
        );

        if (!active) return;

        drawCanvasSurface(originalCanvasRef.current, originalCanvas);
        drawCanvasSurface(processedCanvasRef.current, processedCanvas);
        setPixelArt(result);
        setPreviewMeta({
          width: processedCanvas.width,
          height: processedCanvas.height,
          sourceWidth: sourceCanvas.width,
          sourceHeight: sourceCanvas.height,
          previewScale,
        });
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(
            processingError.message || "Failed to generate pixel preview.",
          );
          setPixelArt(null);
          setPreviewMeta(null);
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
  }, [backgroundValue, imageSrc, previewScale, settings]);

  return {
    comparisonSlider,
    error,
    isProcessing,
    originalCanvasRef,
    pixelArt,
    previewMeta,
    processedCanvasRef,
    setError,
  };
}
