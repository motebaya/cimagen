import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditHistory } from "../useEditHistory.js";
import { useBeforeUnload } from "../useBeforeUnload.js";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  loadTemplateConfig,
  renderPokemonCard,
  ResizeMethod,
} from "../../utils/pokemonCardRenderer.js";
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
    } catch {}
  }
  input.click();
}

export default function usePokemonCardCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [resizeMethod, setResizeMethod] = useState(ResizeMethod.AUTO);
  const [templates, setTemplates] = useState([]);
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
    useEditHistory("pokemoncard");
  useBeforeUnload(isDirty);

  useEffect(() => {
    loadTemplateConfig(`${import.meta.env.BASE_URL}images/pocard/template.json`)
      .then(setTemplates)
      .catch((err) => {
        console.error(err);
        setError("Failed to load card templates.");
      });
  }, []);

  const renderCanvases = useCallback(async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !imageSrc ||
      !templates.length ||
      !previewCanvasRef.current ||
      !exportCanvasRef.current
    )
      return;
    setIsRendering(true);
    setError(null);
    try {
      const solidFontPath = `${import.meta.env.BASE_URL}fonts/pocard/solid.ttf`;
      const descFontPath = `${import.meta.env.BASE_URL}fonts/pocard/desc.ttf`;
      const assetsBasePath = `${import.meta.env.BASE_URL}images/pocard`;
      const canvas = await renderPokemonCard(
        title,
        description,
        imageSrc,
        templateIndex,
        resizeMethod,
        templates,
        solidFontPath,
        descFontPath,
        assetsBasePath,
      );
      [previewCanvasRef.current, exportCanvasRef.current].forEach((target) => {
        const ctx = target.getContext("2d");
        target.width = canvas.width;
        target.height = canvas.height;
        ctx.clearRect(0, 0, target.width, target.height);
        ctx.drawImage(canvas, 0, 0);
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate card. Please try again.");
    } finally {
      setIsRendering(false);
    }
  }, [title, description, imageSrc, templateIndex, resizeMethod, templates]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!title.trim() || !description.trim() || !imageSrc || !templates.length)
      return undefined;
    debounceRef.current = setTimeout(renderCanvases, 220);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [
    renderCanvases,
    title,
    description,
    imageSrc,
    templateIndex,
    resizeMethod,
    templates,
  ]);

  useEffect(() => {
    if (title || description || imageSrc) setIsDirty(true);
  }, [title, description, imageSrc, templateIndex, resizeMethod]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExport = async (format) => {
    if (
      !title.trim() ||
      !description.trim() ||
      !imageSrc ||
      exportingFormats[format] ||
      !exportCanvasRef.current
    )
      return;
    setExportingFormats((c) => ({ ...c, [format]: true }));
    setError(null);
    try {
      await downloadCanvas(
        exportCanvasRef.current,
        `pokemon_card_${title.replace(/\s+/g, "_")}`,
        format,
        format === "webp" ? 0.9 : 0.92,
      );
      saveEntry(
        {
          title,
          description:
            description.slice(0, 50) + (description.length > 50 ? "..." : ""),
          templateIndex,
          resizeMethod,
        },
        exportCanvasRef.current.toDataURL("image/webp", 0.2),
      );
      setIsDirty(false);
    } catch (exportError) {
      console.error(exportError);
      setError(
        exportError.message || `Failed to export ${format.toUpperCase()} card.`,
      );
    } finally {
      setExportingFormats((c) => ({ ...c, [format]: false }));
    }
  };

  const handleRestore = (entry) => {
    setTitle(entry.state.title || "");
    setDescription(entry.state.description || "");
    setTemplateIndex(entry.state.templateIndex || 0);
    setResizeMethod(entry.state.resizeMethod || ResizeMethod.AUTO);
  };

  return {
    exportCanvasRef,
    exportCard: {
      disabled: !title.trim() || !description.trim() || !imageSrc,
      exportMetadata: [
        ["Template", `${templateIndex + 1}`],
        ["Resize", resizeMethod],
        ["Title", title || "-"],
        ["Image", imageFilename || "-"],
      ],
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
      fileInputRef,
      hasContent: Boolean(title.trim() && description.trim() && imageSrc),
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
      description,
      onDescriptionChange: setDescription,
      onResizeMethodChange: setResizeMethod,
      onTemplateIndexChange: setTemplateIndex,
      onTitleChange: setTitle,
      resizeMethod,
      templates,
      title,
      templateIndex,
    },
  };
}
