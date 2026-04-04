import { useCallback, useEffect, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderWasted } from "../../utils/wastedRenderer.js";
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

function getFilename(imageFilename) {
  return `wasted_${(imageFilename || "image").replace(/\.[^/.]+$/, "")}`;
}

export default function useWastedCreator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
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
    useEditHistory("wasted");
  useBeforeUnload(isDirty);

  const renderCanvases = useCallback(async () => {
    if (!imageSrc || !previewCanvasRef.current || !exportCanvasRef.current)
      return;

    setIsRendering(true);
    setError(null);

    try {
      const fontPath = `${import.meta.env.BASE_URL}fonts/pricedown-bl.ttf`;
      const canvas = await renderWasted(imageSrc, fontPath);
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
  }, [imageSrc]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!imageSrc) return undefined;
    debounceRef.current = setTimeout(renderCanvases, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [imageSrc, renderCanvases]);

  useEffect(() => {
    if (imageSrc) {
      setIsDirty(true);
    }
  }, [imageSrc]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExport = async (format) => {
    if (!imageSrc || exportingFormats[format] || !exportCanvasRef.current)
      return;
    setExportingFormats((current) => ({ ...current, [format]: true }));
    setError(null);
    try {
      await downloadCanvas(
        exportCanvasRef.current,
        getFilename(imageFilename),
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      saveEntry(
        { imageFilename },
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

  return {
    exportCanvasRef,
    exportCard: {
      disabled: !imageSrc,
      exportMetadata: [
        ["Image", imageFilename || "-"],
        ["Overlay", "WASTED"],
        ["Style", "GTA"],
        ["Ready", imageSrc ? "Yes" : "Upload image"],
      ],
      exportingFormats,
      onExport: handleExport,
    },
    historyPanel: {
      history,
      onClear: clearHistory,
      onDelete: deleteEntry,
      onRestore: () => {},
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
  };
}
