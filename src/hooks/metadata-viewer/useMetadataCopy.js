import { useEffect, useRef, useState } from "react";

export default function useMetadataCopy({ onError, timeout = 1800 } = {}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyText = async (key, value) => {
    if (value == null) {
      return false;
    }

    if (!navigator.clipboard?.writeText) {
      onError?.("Clipboard is not available in this browser.");
      return false;
    }

    try {
      await navigator.clipboard.writeText(String(value));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setCopiedKey(key);
      timeoutRef.current = setTimeout(() => {
        setCopiedKey(null);
      }, timeout);
      return true;
    } catch {
      onError?.("Failed to copy metadata. Please try again.");
      return false;
    }
  };

  return {
    copiedKey,
    copyText,
  };
}
