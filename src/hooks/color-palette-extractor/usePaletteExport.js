import { useState } from "react";
import { downloadPaletteText } from "../../utils/color-palette-extractor/index.js";

export default function usePaletteExport({ onError }) {
  const [copyState, setCopyState] = useState(null);

  const copyText = async (value, label) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyState(label);
      setTimeout(() => setCopyState(null), 1500);
    } catch (copyError) {
      console.error(copyError);
      onError?.("Clipboard access failed. You can still download the export.");
    }
  };

  const downloadText = (value, extension) => {
    if (!value) {
      return;
    }

    downloadPaletteText(value, extension);
  };

  return {
    copyState,
    copyText,
    downloadText,
  };
}
