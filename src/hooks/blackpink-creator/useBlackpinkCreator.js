import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderBlackpink } from "../../utils/blackpinkRenderer.js";

function buildFilename(text) {
  return `blackpink_${(text || "logo").slice(0, 20).replace(/\s+/g, "_")}`;
}

export default function useBlackpinkCreator() {
  const [text, setText] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [exportingFormats, setExportingFormats] = useState({});
  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("blackpink");
  useBeforeUnload(isDirty);

  const renderCanvases = useCallback(async () => {
    if (!text.trim() || !previewCanvasRef.current || !exportCanvasRef.current) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      const fontPath = `${import.meta.env.BASE_URL}fonts/blackpink.otf`;
      const canvas = await renderBlackpink(text, fontPath);

      [previewCanvasRef.current, exportCanvasRef.current].forEach((target) => {
        const ctx = target.getContext("2d");
        target.width = canvas.width;
        target.height = canvas.height;
        ctx.clearRect(0, 0, target.width, target.height);
        ctx.drawImage(canvas, 0, 0);
      });
    } catch (renderError) {
      console.error(renderError);
      setError(
        renderError.message || "Failed to generate image. Please try again.",
      );
    } finally {
      setIsRendering(false);
    }
  }, [text]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      return undefined;
    }
    debounceRef.current = setTimeout(renderCanvases, 180);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [renderCanvases, text]);

  useEffect(() => {
    if (text) {
      setIsDirty(true);
    }
  }, [text]);

  const handleExport = async (format) => {
    if (!text.trim() || exportingFormats[format] || !exportCanvasRef.current)
      return;

    setExportingFormats((current) => ({ ...current, [format]: true }));
    setError(null);

    try {
      await downloadCanvas(
        exportCanvasRef.current,
        buildFilename(text),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      saveEntry({ text }, exportCanvasRef.current.toDataURL("image/webp", 0.2));
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError(
        exportError.message ||
          `Failed to export ${format.toUpperCase()} image.`,
      );
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  const handleRestore = (entry) => {
    setText(entry.state.text || "");
    setError(null);
  };

  const exportMetadata = useMemo(
    () => [
      ["Text", text.trim() ? `${text.trim().length} chars` : "-"],
      [
        "Canvas",
        previewCanvasRef.current
          ? `${previewCanvasRef.current.width} x ${previewCanvasRef.current.height}`
          : "-",
      ],
      ["Ready", text.trim() ? "Yes" : "Enter text"],
      ["Style", "Blackpink"],
    ],
    [text],
  );

  return {
    exportCanvasRef,
    exportCard: {
      disabled: !text.trim(),
      exportMetadata,
      exportingFormats,
      onExport: handleExport,
    },
    historyPanel: {
      history,
      onClear: clearHistory,
      onDelete: deleteEntry,
      onRestore: handleRestore,
    },
    pageState: { error },
    previewCard: {
      hasContent: Boolean(text.trim()),
      isRendering,
      previewCanvasRef,
    },
    settingsCard: {
      onTextChange: setText,
      text,
    },
  };
}
