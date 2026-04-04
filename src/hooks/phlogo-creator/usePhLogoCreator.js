import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderPhLogo } from "../../utils/phLogoRenderer.js";

function buildFilename(text1, text2) {
  return `phlogo_${(text1 || "left").replace(/\s+/g, "_")}_${(text2 || "right").replace(/\s+/g, "_")}`;
}

export default function usePhLogoCreator() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [exportingFormats, setExportingFormats] = useState({});
  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("phlogo");
  useBeforeUnload(isDirty);

  const renderCanvases = useCallback(async () => {
    if (
      !text1.trim() ||
      !text2.trim() ||
      !previewCanvasRef.current ||
      !exportCanvasRef.current
    )
      return;

    setIsRendering(true);
    setError(null);

    try {
      const fontPath = `${import.meta.env.BASE_URL}fonts/expressway-rg.ttf`;
      const canvas = await renderPhLogo(text1, text2, fontPath);
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
  }, [text1, text2]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text1.trim() || !text2.trim()) return undefined;
    debounceRef.current = setTimeout(renderCanvases, 180);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [renderCanvases, text1, text2]);

  useEffect(() => {
    if (text1 || text2) setIsDirty(true);
  }, [text1, text2]);

  const handleExport = async (format) => {
    if (
      !text1.trim() ||
      !text2.trim() ||
      exportingFormats[format] ||
      !exportCanvasRef.current
    )
      return;
    setExportingFormats((current) => ({ ...current, [format]: true }));
    setError(null);

    try {
      await downloadCanvas(
        exportCanvasRef.current,
        buildFilename(text1, text2),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      saveEntry(
        { text1, text2 },
        exportCanvasRef.current.toDataURL("image/webp", 0.2),
      );
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
    setText1(entry.state.text1 || "");
    setText2(entry.state.text2 || "");
  };

  const exportMetadata = useMemo(
    () => [
      ["Left", text1 || "-"],
      ["Right", text2 || "-"],
      ["Ready", text1.trim() && text2.trim() ? "Yes" : "Enter both texts"],
      ["Style", "PH Logo"],
    ],
    [text1, text2],
  );

  return {
    exportCanvasRef,
    exportCard: {
      disabled: !text1.trim() || !text2.trim(),
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
      hasContent: Boolean(text1.trim() && text2.trim()),
      isRendering,
      previewCanvasRef,
    },
    settingsCard: {
      onText1Change: setText1,
      onText2Change: setText2,
      text1,
      text2,
    },
  };
}
