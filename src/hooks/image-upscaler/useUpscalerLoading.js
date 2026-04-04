import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDuration } from "../../utils/image-upscaler/index.js";

export default function useUpscalerLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      return undefined;
    }

    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startedAtRef.current);
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingLabel = useMemo(() => formatDuration(elapsedMs), [elapsedMs]);

  const startLoading = useCallback((nextStatus) => {
    startedAtRef.current = performance.now();
    setElapsedMs(0);
    setStatus(nextStatus || "Preparing upscaler");
    setIsLoading(true);
  }, []);

  const updateLoadingStatus = useCallback((nextStatus) => {
    setStatus(nextStatus);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setStatus("");
    setElapsedMs(0);
  }, []);

  return {
    elapsedMs,
    isLoading,
    loadingLabel,
    startLoading,
    status,
    stopLoading,
    updateLoadingStatus,
  };
}
