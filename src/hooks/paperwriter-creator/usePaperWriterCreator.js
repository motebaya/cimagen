import { useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderPaperWriter } from "../../utils/paperWriterRenderer.js";

export default function usePaperWriterCreator() {
  const [text, setText] = useState("");
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [exportingState, setExportingState] = useState({
    current: false,
    all: false,
  });
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("paperwriter");
  useBeforeUnload(isDirty);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setPages([]);
      setCurrentPage(0);
      return undefined;
    }

    debounceRef.current = setTimeout(async () => {
      setIsRendering(true);
      setError(null);
      try {
        const fontPath = `${import.meta.env.BASE_URL}fonts/IndieFlower.ttf`;
        const templatePath = `${import.meta.env.BASE_URL}images/before.jpg`;
        const canvases = await renderPaperWriter(text, fontPath, templatePath);
        setPages(canvases);
        setCurrentPage(0);
      } catch (renderError) {
        console.error(renderError);
        setError("Failed to generate pages. Please try again.");
        setPages([]);
      } finally {
        setIsRendering(false);
      }
    }, 220);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text]);

  useEffect(() => {
    if (text) setIsDirty(true);
  }, [text]);

  const downloadCurrent = async () => {
    const canvas = pages[currentPage];
    if (!canvas || exportingState.current) return;
    setExportingState((current) => ({ ...current, current: true }));
    try {
      await downloadCanvas(
        canvas,
        `handwritten_page_${currentPage + 1}`,
        "png",
        0.92,
      );
      saveEntry(
        {
          text: text.slice(0, 100) + (text.length > 100 ? "..." : ""),
          pageCount: pages.length,
          timestamp: Date.now(),
        },
        canvas.toDataURL("image/webp", 0.2),
      );
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError("Failed to export current page.");
    } finally {
      setExportingState((current) => ({ ...current, current: false }));
    }
  };

  const downloadAll = async () => {
    if (!pages.length || exportingState.all) return;
    setExportingState((current) => ({ ...current, all: true }));
    try {
      for (let index = 0; index < pages.length; index += 1) {
        await downloadCanvas(
          pages[index],
          `handwritten_page_${index + 1}`,
          "png",
          0.92,
        );
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError("Failed to export all pages.");
    } finally {
      setExportingState((current) => ({ ...current, all: false }));
    }
  };

  const handleRestore = (entry) => {
    setText(entry.state.text || "");
  };

  return {
    exportCard: {
      disabled: !pages.length,
      exportMetadata: [
        ["Pages", pages.length || "-"],
        ["Current", pages.length ? `${currentPage + 1}` : "-"],
        ["Characters", text.length],
        ["Ready", pages.length ? "Yes" : "Enter text"],
      ],
      exportingState,
      onDownloadAll: downloadAll,
      onDownloadCurrent: downloadCurrent,
    },
    historyPanel: {
      history,
      onClear: clearHistory,
      onDelete: deleteEntry,
      onRestore: handleRestore,
    },
    pageState: { error },
    previewCard: {
      currentPage,
      hasPages: pages.length > 0,
      isRendering,
      onNextPage: () =>
        setCurrentPage((current) => Math.min(pages.length - 1, current + 1)),
      onPreviousPage: () =>
        setCurrentPage((current) => Math.max(0, current - 1)),
      pageCount: pages.length,
      pages,
    },
    settingsCard: {
      onTextChange: setText,
      text,
    },
  };
}
