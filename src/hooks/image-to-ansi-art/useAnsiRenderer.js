import { useEffect, useRef, useState } from "react";
import { createAnsiArt } from "../../utils/image-to-ansi-art/index.js";

export default function useAnsiRenderer({ imageSrc, renderSettings }) {
  const [ansiResult, setAnsiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) {
      setAnsiResult(null);
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
        const nextResult = await createAnsiArt(imageSrc, renderSettings);
        if (!active) return;
        setAnsiResult(nextResult);
      } catch (processingError) {
        console.error(processingError);
        if (active) {
          setError(processingError.message || "Failed to generate ANSI art.");
          setAnsiResult(null);
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

  return {
    ansiResult,
    error,
    isProcessing,
    setError,
  };
}
