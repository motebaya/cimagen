import { useMemo, useRef, useState } from "react";
import { convertToIco } from "../../utils/icoConverter.js";
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

export default function useIcoConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedCanvas, setCroppedCanvas] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([
    16, 32, 48, 64, 128, 256,
  ]);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const availableSizes = [16, 32, 48, 64, 128, 256];

  const performCrop = (x, y, size) => {
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageRef.current, x, y, size, size, 0, 0, size, size);
    setCroppedCanvas(canvas);
  };

  const initializeCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    const x = (img.naturalWidth - size) / 2;
    const y = (img.naturalHeight - size) / 2;
    performCrop(x, y, size);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!isValidImage(file)) {
      setError(
        "Please select a valid image file (JPEG, PNG, WebP, GIF, BMP, or SVG).",
      );
      return;
    }
    if (!isValidSize(file, 20)) {
      setError("Image is too large. Please use an image under 20MB.");
      return;
    }
    setError(null);
    setImageFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result || null);
    reader.onerror = () =>
      setError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setCroppedCanvas(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((value) => value !== size)
        : [...prev, size].sort((a, b) => a - b),
    );
  };

  const handleExport = async () => {
    if (!croppedCanvas || selectedSizes.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      const baseFilename = imageFilename.replace(/\.[^/.]+$/, "");
      for (const size of selectedSizes) {
        const icoBlob = await convertToIco(croppedCanvas, [size]);
        const url = URL.createObjectURL(icoBlob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${baseFilename}_${size}x${size}.ico`;
        anchor.click();
        URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    } catch (exportError) {
      console.error(exportError);
      setError("Failed to convert image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportMetadata = useMemo(
    () => [
      ["Source", imageFilename || "-"],
      [
        "Crop",
        croppedCanvas
          ? `${croppedCanvas.width} x ${croppedCanvas.height}`
          : "-",
      ],
      ["Sizes", selectedSizes.length],
      ["Format", "ICO"],
    ],
    [croppedCanvas, imageFilename, selectedSizes.length],
  );

  return {
    exportCard: {
      disabled: !croppedCanvas || selectedSizes.length === 0,
      exportMetadata,
      isProcessing,
      onExport: handleExport,
    },
    pageState: { error },
    previewCard: {
      croppedCanvas,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageRef,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
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
      onImageInputChange: (event) => {
        handleFileSelect(event.target.files?.[0] || null);
        event.target.value = "";
      },
      onImageLoad: initializeCrop,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      selectedSizes,
    },
    settingsCard: {
      availableSizes,
      selectedSizes,
      toggleSize,
    },
  };
}
