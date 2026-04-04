import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  HEIGHT,
  WIDTH,
  renderThumbnail,
} from "../../utils/thumbnailRenderer.js";

const PRESET_COLORS = [
  { color: "#020617", label: "Slate 950" },
  { color: "#0f172a", label: "Slate 900" },
  { color: "#111827", label: "Gray 900" },
  { color: "#1e1b4b", label: "Indigo 950" },
  { color: "#1a1a2e", label: "Navy" },
  { color: "#18181b", label: "Zinc 900" },
  { color: "#0b132b", label: "Oxford" },
];

function slugify(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "thumbnail"
  );
}

export default function useThumbnailCreator() {
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState(PRESET_COLORS[0].color);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [exportingFormats, setExportingFormats] = useState({});
  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("thumbnail");
  useBeforeUnload(isDirty);

  const renderCanvases = useCallback(async () => {
    if (!previewCanvasRef.current || !exportCanvasRef.current) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      await Promise.all([
        renderThumbnail(previewCanvasRef.current, text, bgColor),
        renderThumbnail(exportCanvasRef.current, text, bgColor),
      ]);
    } catch (renderError) {
      console.error(renderError);
      setError(renderError.message || "Failed to render thumbnail preview.");
    } finally {
      setIsRendering(false);
    }
  }, [bgColor, text]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      renderCanvases();
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [renderCanvases]);

  useEffect(() => {
    if (text.trim().length > 0 || bgColor !== PRESET_COLORS[0].color) {
      setIsDirty(true);
    }
  }, [bgColor, text]);

  const handleExport = async (format) => {
    if (!text.trim() || exportingFormats[format] || !exportCanvasRef.current) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));
    setError(null);

    try {
      await downloadCanvas(
        exportCanvasRef.current,
        slugify(text),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      const previewDataUrl = exportCanvasRef.current.toDataURL(
        "image/webp",
        0.3,
      );
      saveEntry({ text, bgColor }, previewDataUrl);
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError(
        exportError.message ||
          `Failed to export ${format.toUpperCase()} thumbnail.`,
      );
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  const handleRestore = (entry) => {
    if (!entry.state) {
      return;
    }

    setText(entry.state.text || "");
    setBgColor(entry.state.bgColor || PRESET_COLORS[0].color);
    setError(null);
  };

  const exportMetadata = useMemo(
    () => [
      ["Size", `${WIDTH} x ${HEIGHT}`],
      ["Text", text.trim() ? `${text.trim().length} chars` : "-"],
      ["Background", bgColor],
      ["Ready", text.trim() ? "Yes" : "Enter text"],
    ],
    [bgColor, text],
  );

  return {
    error,
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
    previewCard: {
      isRendering,
      previewCanvasRef,
    },
    settingsCard: {
      bgColor,
      onBackgroundChange: setBgColor,
      onTextChange: setText,
      presetColors: PRESET_COLORS,
      text,
    },
    hiddenExportCanvasRef: exportCanvasRef,
  };
}
