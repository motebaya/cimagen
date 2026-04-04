import { useEffect, useRef, useState } from "react";
import {
  renderHtmlMarkupCapture,
  renderUrlCapture,
} from "../../utils/html-to-image/index.js";

export default function useHtmlRenderer({
  sourceMode,
  markup,
  urlInput,
  renderOptions,
}) {
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const hasInput = sourceMode === "html" ? markup.trim() : urlInput.trim();
    if (!hasInput) {
      setResult(null);
      setError(null);
      setIsRendering(false);
      return undefined;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    let active = true;
    debounceRef.current = setTimeout(async () => {
      setIsRendering(true);
      setError(null);

      try {
        const capture =
          sourceMode === "html"
            ? await renderHtmlMarkupCapture(markup, renderOptions)
            : await renderUrlCapture(urlInput, renderOptions);

        if (!active) return;
        setResult({
          ...capture,
          assetIssues: capture.assetIssues || [],
          viewportWidth: renderOptions.width,
          viewportHeight: renderOptions.height,
          fullPage: renderOptions.fullPage,
          scaleFactor: renderOptions.scaleFactor,
          sourceMode,
        });
      } catch (renderError) {
        console.error(renderError);
        if (active) {
          setError(renderError.message || "Failed to render HTML preview.");
          setResult(null);
        }
      } finally {
        if (active) {
          setIsRendering(false);
        }
      }
    }, 260);

    return () => {
      active = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [markup, renderOptions, sourceMode, urlInput]);

  return {
    error,
    isRendering,
    result,
    setError,
  };
}
