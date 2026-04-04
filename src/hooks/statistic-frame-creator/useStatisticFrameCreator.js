import { useCallback, useEffect, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderStatisticFrame } from "../../utils/statisticFrameRenderer.js";
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

function buildExportName(imageFilename) {
  const base = imageFilename
    ? imageFilename.replace(/\.[^.]+$/, "")
    : "statistic-frame";
  return `statistic-frame-${base}`;
}

export default function useStatisticFrameCreator() {
  const [topText, setTopText] = useState("287621 FRAMES");
  const [bottomText, setBottomText] = useState("SUCCESSFULLY UPLOADED!");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [previewSize, setPreviewSize] = useState(null);
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
    useEditHistory("statistic-frame");
  useBeforeUnload(isDirty);

  const renderCanvases = useCallback(async () => {
    if (!imageSrc || !previewCanvasRef.current || !exportCanvasRef.current) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      await Promise.all([
        renderStatisticFrame(
          previewCanvasRef.current,
          imageSrc,
          topText,
          bottomText,
        ),
        renderStatisticFrame(
          exportCanvasRef.current,
          imageSrc,
          topText,
          bottomText,
        ),
      ]);
      setPreviewSize({
        width: previewCanvasRef.current.width,
        height: previewCanvasRef.current.height,
      });
    } catch (renderError) {
      console.error(renderError);
      setError(renderError.message || "Failed to render statistic frame.");
    } finally {
      setIsRendering(false);
    }
  }, [bottomText, imageSrc, topText]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!imageSrc) {
      setPreviewSize(null);
      return undefined;
    }

    debounceRef.current = setTimeout(() => {
      renderCanvases();
    }, 180);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [imageSrc, renderCanvases]);

  useEffect(() => {
    if (imageSrc && (topText.trim() || bottomText.trim())) {
      setIsDirty(true);
    }
  }, [bottomText, imageSrc, topText]);

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
    reader.onload = (event) => {
      setImageSrc(event.target?.result || null);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setPreviewSize(null);
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
        buildExportName(imageFilename),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      const previewDataUrl = exportCanvasRef.current.toDataURL(
        "image/webp",
        0.2,
      );
      saveEntry({ topText, bottomText, imageFilename }, previewDataUrl);
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError(
        exportError.message ||
          `Failed to export ${format.toUpperCase()} frame.`,
      );
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  const handleRestore = (entry) => {
    if (!entry.state) {
      return;
    }

    setTopText(entry.state.topText || "");
    setBottomText(entry.state.bottomText || "");
    setError(null);
  };

  return {
    exportCard: {
      disabled: !imageSrc,
      exportMetadata: [
        ["Image", imageFilename || "-"],
        [
          "Aspect",
          previewSize ? `${previewSize.width}:${previewSize.height}` : "-",
        ],
        ["Top", topText || "-"],
        ["Bottom", bottomText || "-"],
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
    pageState: {
      error,
    },
    previewCard: {
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
      onDragLeave: () => setIsDragging(false),
      onDragOver: (event) => {
        event.preventDefault();
        setIsDragging(true);
      },
      onDrop: (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFileSelect(event.dataTransfer.files?.[0] || null);
      },
      onFileSelect: handleFileSelect,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      previewCanvasRef,
      previewSize,
      fileInputRef,
    },
    settingsCard: {
      bottomText,
      onBottomTextChange: setBottomText,
      onTopTextChange: setTopText,
      topText,
    },
  };
}
