import { useEffect, useMemo, useRef, useState } from "react";
import { extractMetadata } from "../../utils/metadataExtractor.js";
import {
  getMetadataMethodOption,
  normalizeMetadataTree,
} from "../../utils/metadata-viewer/index.js";

export default function useMetadataExtraction({ file, method }) {
  const [error, setError] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!file) {
      setError(null);
      setIsExtracting(false);
      setResult(null);
      return;
    }

    let isActive = true;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setIsExtracting(true);
    setError(null);
    setResult(null);

    (async () => {
      try {
        const nextResult = await extractMetadata(file, method);

        if (!isActive || requestRef.current !== requestId) {
          return;
        }

        setResult(nextResult);
        setError(
          nextResult.success
            ? null
            : nextResult.error || "Failed to extract metadata.",
        );
      } catch (extractionError) {
        console.error(extractionError);

        if (!isActive || requestRef.current !== requestId) {
          return;
        }

        setResult(null);
        setError("Failed to extract metadata. Please try again.");
      } finally {
        if (isActive && requestRef.current === requestId) {
          setIsExtracting(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [file, method]);

  const rows = useMemo(
    () => normalizeMetadataTree(result?.data || null),
    [result?.data],
  );

  return {
    error,
    hasMetadata: rows.length > 0,
    isExtracting,
    methodOption: getMetadataMethodOption(method),
    result,
    rows,
  };
}
