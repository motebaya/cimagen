import { useEffect, useState } from "react";
import {
  downloadAsciiImage,
  downloadAsciiText,
} from "../../utils/image-to-ascii/index.js";

export default function useAsciiExport({
  asciiResult,
  backgroundValue,
  settings,
  textColor,
}) {
  const [copyState, setCopyState] = useState(false);
  const [exportingFormats, setExportingFormats] = useState({});

  useEffect(() => {
    if (!copyState) {
      return undefined;
    }

    const timeout = setTimeout(() => setCopyState(false), 1400);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copyText = async () => {
    if (!asciiResult?.text) {
      return;
    }

    await navigator.clipboard.writeText(asciiResult.text);
    setCopyState(true);
  };

  const downloadText = () => {
    if (!asciiResult?.text) {
      return;
    }

    downloadAsciiText(asciiResult.text);
  };

  const downloadImage = async (format) => {
    if (!asciiResult || exportingFormats[format]) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));
    try {
      await downloadAsciiImage(asciiResult, format, {
        fontSize: settings.fontSize + 5,
        lineHeight: settings.lineHeight,
        padding: 26,
        colorful: settings.colorful,
        backgroundColor: backgroundValue,
        textColor,
      });
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  return {
    copyState,
    copyText,
    downloadImage,
    downloadText,
    exportingFormats,
  };
}
