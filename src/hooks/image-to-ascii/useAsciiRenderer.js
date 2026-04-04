import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildAsciiMetadata,
  imageToAscii,
} from "../../utils/image-to-ascii/index.js";

export default function useAsciiRenderer({ imageSrc, settings }) {
  const [asciiResult, setAsciiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const renderOptions = useMemo(
    () => ({
      size: [settings.width, settings.height],
      scale: [settings.scaleX, settings.scaleY],
      brightness: settings.brightness,
      contrast: settings.contrast,
      sharpness: settings.sharpness,
      fixScaling: settings.fixScaling,
      invert: settings.invert,
      sortChars: settings.sortChars,
      colorful: settings.colorful,
      charset: settings.charset,
    }),
    [settings],
  );

  useEffect(() => {
    if (!imageSrc) {
      setAsciiResult(null);
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
        const result = await imageToAscii(imageSrc, renderOptions);
        if (!active) return;
        setAsciiResult(result);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(
            processingError.message || "Failed to generate ASCII output.",
          );
          setAsciiResult(null);
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
  }, [imageSrc, renderOptions]);

  return {
    asciiMeta: buildAsciiMetadata(asciiResult),
    asciiResult,
    error,
    isProcessing,
    setError,
  };
}
