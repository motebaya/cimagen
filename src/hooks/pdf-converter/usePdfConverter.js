import { useEffect, useMemo, useRef, useState } from "react";
import {
  getImageAcceptAttribute,
  validateImageFiles,
} from "../../utils/fileValidation.js";
import {
  BACKGROUND_OPTIONS,
  buildPdfExportMetadata,
  convertImagesToPdf,
  createPdfImageEntries,
  DEFAULT_PDF_SETTINGS,
  ensurePdfFilename,
  generatePdfPreviews,
  LAYOUT_OPTIONS,
  ORIENTATION_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../utils/pdf-converter/index.js";

function openFilePicker(input) {
  if (!input) {
    return;
  }

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

export default function usePdfConverter() {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_PDF_SETTINGS);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!images.length) {
      setPreviewUrls([]);
      return;
    }

    const previews = generatePdfPreviews(images, settings);
    setPreviewUrls(previews);
  }, [images, settings]);

  const exportMetadata = useMemo(
    () => buildPdfExportMetadata({ images, settings }),
    [images, settings],
  );

  const handleFilesSelect = async (files) => {
    if (!files?.length) {
      return;
    }

    const validation = validateImageFiles(files);

    if (!validation.valid) {
      setError(validation.errors.join(" "));
      return;
    }

    setError(null);

    try {
      const nextImages = await createPdfImageEntries(Array.from(files));
      setImages((currentImages) => [...currentImages, ...nextImages]);
    } catch (loadingError) {
      console.error(loadingError);
      setError("Failed to load one or more images. Please try again.");
    }
  };

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const rotateImage = (id) => {
    setImages((currentImages) =>
      currentImages.map((image) =>
        image.id === id
          ? { ...image, rotation: (image.rotation + 90) % 360 }
          : image,
      ),
    );
  };

  const removeImage = (id) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.id !== id),
    );
  };

  const clearImages = () => {
    setImages([]);
    setDraggedIndex(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    if (!images.length) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const pdfBlob = await convertImagesToPdf(images, settings);
      const url = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = ensurePdfFilename(settings.filename);
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (processingError) {
      console.error(processingError);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    error,
    exportCard: {
      disabled: !images.length || isProcessing,
      exportMetadata,
      hasImages: images.length > 0,
      isProcessing,
      onExport: handleExport,
    },
    previewCard: {
      draggedIndex,
      fileInputRef,
      hasImages: images.length > 0,
      images,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isProcessing,
      onAddImages: () => openFilePicker(fileInputRef.current),
      onClearAll: clearImages,
      onDragEnd: () => setDraggedIndex(null),
      onDragEnterPage: (index) => {
        if (draggedIndex === null || draggedIndex === index) {
          return;
        }

        setImages((currentImages) => {
          const nextImages = [...currentImages];
          const [draggedItem] = nextImages.splice(draggedIndex, 1);
          nextImages.splice(index, 0, draggedItem);
          return nextImages;
        });
        setDraggedIndex(index);
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
        handleFilesSelect(event.dataTransfer.files);
      },
      onFilesInputChange: (event) => {
        handleFilesSelect(event.target.files);
        event.target.value = "";
      },
      onRemoveImage: removeImage,
      onRotateImage: rotateImage,
      onStartDragPage: (index) => setDraggedIndex(index),
      previewUrls,
      queueCount: images.length,
    },
    settingsCard: {
      backgroundColor: settings.backgroundColor,
      backgroundOptions: BACKGROUND_OPTIONS,
      filename: settings.filename,
      layout: settings.layout,
      layoutOptions: LAYOUT_OPTIONS,
      margin: settings.margin,
      onUpdateSetting: updateSetting,
      orientation: settings.orientation,
      orientationOptions: ORIENTATION_OPTIONS,
      pageSize: settings.pageSize,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
    },
  };
}
