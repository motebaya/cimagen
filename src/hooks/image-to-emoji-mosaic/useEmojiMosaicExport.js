import { useEffect, useState } from "react";
import {
  downloadEmojiImage,
  downloadEmojiJson,
  downloadEmojiText,
} from "../../utils/image-to-emoji-mosaic/index.js";

export default function useEmojiMosaicExport({
  backgroundValue,
  mosaic,
  onError,
  settings,
}) {
  const [copyState, setCopyState] = useState(false);
  const [exportingFormats, setExportingFormats] = useState({});

  useEffect(() => {
    if (!copyState) {
      return undefined;
    }

    const timeout = setTimeout(() => setCopyState(false), 1500);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copyText = async () => {
    if (!mosaic?.text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(mosaic.text);
      setCopyState(true);
    } catch (copyError) {
      console.error(copyError);
      onError?.(
        "Clipboard access failed. You can still download the TXT export.",
      );
    }
  };

  const downloadTxt = () => {
    if (!mosaic) {
      return;
    }

    downloadEmojiText(mosaic);
  };

  const downloadJson = () => {
    if (!mosaic) {
      return;
    }

    downloadEmojiJson(mosaic);
  };

  const downloadImage = async (format) => {
    if (!mosaic || exportingFormats[format]) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));
    try {
      await downloadEmojiImage(
        mosaic,
        {
          fontSize: settings.tileSize,
          lineHeight: settings.lineHeight,
          background: backgroundValue,
          padding: 24,
        },
        format,
      );
    } catch (exportError) {
      console.error(exportError);
      onError?.(
        exportError.message ||
          `Failed to export ${format.toUpperCase()} mosaic.`,
      );
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  return {
    copyState,
    copyText,
    downloadImage,
    downloadJson,
    downloadTxt,
    exportingFormats,
  };
}
