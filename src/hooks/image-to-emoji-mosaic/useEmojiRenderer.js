import { useEffect, useMemo, useRef, useState } from "react";
import {
  createEmojiMosaic,
  renderEmojiMosaicCanvas,
} from "../../utils/image-to-emoji-mosaic/index.js";

export default function useEmojiRenderer({
  imageSrc,
  settings,
  backgroundValue,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mosaic, setMosaic] = useState(null);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const renderSettings = useMemo(
    () => ({
      ...settings,
      background: backgroundValue,
    }),
    [backgroundValue, settings],
  );

  useEffect(() => {
    if (!imageSrc) {
      setMosaic(null);
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
        const nextMosaic = await createEmojiMosaic(imageSrc, renderSettings);
        if (!active) return;
        setMosaic(nextMosaic);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(
            processingError.message || "Failed to generate emoji mosaic.",
          );
          setMosaic(null);
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
  }, [imageSrc, renderSettings]);

  const previewCanvas = useMemo(() => {
    if (!mosaic) {
      return null;
    }

    return renderEmojiMosaicCanvas(mosaic, {
      fontSize: settings.tileSize,
      lineHeight: settings.lineHeight,
      background: backgroundValue,
      padding: 24,
    });
  }, [backgroundValue, mosaic, settings.lineHeight, settings.tileSize]);

  return {
    error,
    isProcessing,
    mosaic,
    previewCanvas,
    setError,
  };
}
