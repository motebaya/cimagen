import { useEffect, useState } from "react";
import {
  downloadAnsiPreviewImage,
  downloadAnsiText,
  getAnsiClipboardText,
} from "../../utils/image-to-ansi-art/index.js";

export default function useAnsiExport({
  ansiResult,
  fontSize,
  lineHeight,
  terminalTheme,
}) {
  const [copyState, setCopyState] = useState(null);

  useEffect(() => {
    if (!copyState) {
      return undefined;
    }

    const timeout = setTimeout(() => setCopyState(null), 1500);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copyText = async (mode) => {
    if (!ansiResult) {
      return;
    }

    const value = getAnsiClipboardText(ansiResult, mode);
    await navigator.clipboard.writeText(value);
    setCopyState(mode);
  };

  const downloadText = (extension) => {
    if (!ansiResult) {
      return;
    }

    downloadAnsiText(ansiResult, extension);
  };

  const downloadPreviewImage = async () => {
    if (!ansiResult) {
      return;
    }

    await downloadAnsiPreviewImage(ansiResult, {
      fontSize,
      lineHeight,
      themeBackground: terminalTheme.background,
      themeText: terminalTheme.text,
    });
  };

  return {
    copyState,
    copyText,
    downloadPreviewImage,
    downloadText,
  };
}
