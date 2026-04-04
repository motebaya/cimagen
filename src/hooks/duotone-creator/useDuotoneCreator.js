import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { DUOTONE_FILTERS, renderDuotone } from "../../utils/duotoneRenderer.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";

function openFilePicker(input) {
  if (!input) return;
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      // Fall through to click.
    }
  }
  input.click();
}

function getExportFilename(imageFilename, activeFilter) {
  const base = imageFilename
    ? imageFilename.replace(/\.[^.]+$/, "")
    : "duotone";
  return `duotone_${activeFilter}_${base}`;
}

export default function useDuotoneCreator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [activeFilter, setActiveFilter] = useState("original");
  const [isRendering, setIsRendering] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [exportingFormats, setExportingFormats] = useState({});

  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const { history, saveEntry, deleteEntry, clearHistory } =
    useEditHistory("duotone");
  useBeforeUnload(isDirty);

  const currentFilter = useMemo(
    () =>
      DUOTONE_FILTERS.find((entry) => entry.id === activeFilter) ||
      DUOTONE_FILTERS[0],
    [activeFilter],
  );

  const renderCanvases = useCallback(async () => {
    if (!previewCanvasRef.current || !exportCanvasRef.current || !imageSrc) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      await Promise.all([
        renderDuotone(previewCanvasRef.current, imageSrc, {
          classic: currentFilter.classic,
          reverse: currentFilter.reverse,
        }),
        renderDuotone(exportCanvasRef.current, imageSrc, {
          classic: currentFilter.classic,
          reverse: currentFilter.reverse,
        }),
      ]);
    } catch (renderError) {
      console.error(renderError);
      setError(renderError.message || "Failed to render duotone preview.");
    } finally {
      setIsRendering(false);
    }
  }, [currentFilter, imageSrc]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!imageSrc) {
      return undefined;
    }

    debounceRef.current = setTimeout(() => {
      renderCanvases();
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [imageSrc, renderCanvases]);

  useEffect(() => {
    if (imageSrc) {
      setIsDirty(true);
    }
  }, [imageSrc, activeFilter]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!isValidImage(file)) {
      setError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }
    if (!isValidSize(file, 20)) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }
    setError(null);
    setImageFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setImageSrc(event.target?.result || null);
    reader.onerror = () =>
      setError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = async (format) => {
    if (!imageSrc || exportingFormats[format] || !exportCanvasRef.current) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));
    setError(null);

    try {
      await downloadCanvas(
        exportCanvasRef.current,
        getExportFilename(imageFilename, activeFilter),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      const previewDataUrl = exportCanvasRef.current.toDataURL(
        "image/webp",
        0.2,
      );
      saveEntry({ filter: activeFilter, imageFilename }, previewDataUrl);
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError(
        exportError.message ||
          `Failed to export ${format.toUpperCase()} duotone.`,
      );
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  const handleRestore = (entry) => {
    if (!entry.state) return;
    setActiveFilter(entry.state.filter || "original");
    setError(null);
  };

  return {
    exportCard: {
      disabled: !imageSrc,
      exportMetadata: [
        ["Filter", currentFilter.label],
        ["Image", imageFilename || "-"],
        ["Classic", currentFilter.classic ? "Yes" : "No"],
        ["Reverse", currentFilter.reverse ? "Yes" : "No"],
      ],
      exportingFormats,
      onExport: handleExport,
    },
    hiddenExportCanvasRef: exportCanvasRef,
    historyPanel: {
      history,
      onClear: clearHistory,
      onDelete: deleteEntry,
      onRestore: handleRestore,
    },
    pageState: { error },
    previewCard: {
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isRendering,
      onImageInputChange: (event) => {
        handleFileSelect(event.target.files?.[0] || null);
        event.target.value = "";
      },
      onDragLeave: (event) => {
        event.preventDefault();
        setIsDragging(false);
      },
      onDragOver: (event) => {
        event.preventDefault();
        setIsDragging(true);
      },
      onDrop: (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files?.[0] || null);
      },
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      previewCanvasRef,
    },
    settingsCard: {
      activeFilter,
      filters: DUOTONE_FILTERS,
      onFilterChange: setActiveFilter,
    },
  };
}
