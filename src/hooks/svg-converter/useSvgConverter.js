import { useEffect, useRef, useState } from "react";
import { convertToSvg } from "../../utils/svgConverter.js";
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

export default function useSvgConverter() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [svgOutput, setSvgOutput] = useState(null);
  const [sourceCanvas, setSourceCanvas] = useState(null);
  const [mode, setMode] = useState("logo");
  const [colors, setColors] = useState(8);
  const [smoothing, setSmoothing] = useState(2);
  const [detail, setDetail] = useState(5);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true);
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!sourceCanvas) {
      setSvgOutput(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setIsProcessing(true);
      try {
        setSvgOutput(
          convertToSvg(sourceCanvas, {
            mode,
            colors,
            smoothing,
            detail,
            width,
            height,
            preserveAspectRatio,
          }),
        );
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to convert image. Please try again.");
        setSvgOutput(null);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [
    sourceCanvas,
    mode,
    colors,
    smoothing,
    detail,
    width,
    height,
    preserveAspectRatio,
  ]);
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
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(e.target?.result || null);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        setSourceCanvas(canvas);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = e.target?.result || "";
    };
    reader.onerror = () =>
      setError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setSourceCanvas(null);
    setSvgOutput(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleExport = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageFilename.replace(/\.[^/.]+$/, "")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return {
    exportCard: {
      disabled: !svgOutput,
      exportMetadata: [
        ["Mode", mode],
        ["Colors", colors],
        ["Detail", detail],
        ["Output", svgOutput ? `${width}×${height}` : "-"],
      ],
      isProcessing,
      onExport: handleExport,
    },
    pageState: { error },
    previewCard: {
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      svgOutput,
      onImageInputChange: (e) => {
        handleFileSelect(e.target.files?.[0] || null);
        e.target.value = "";
      },
      onDragLeave: (e) => {
        e.preventDefault();
        setIsDragging(false);
      },
      onDragOver: (e) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDrop: (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files?.[0] || null);
      },
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      fileInputRef,
    },
    settingsCard: {
      colors,
      detail,
      height,
      mode,
      preserveAspectRatio,
      smoothing,
      width,
      onColorsChange: setColors,
      onDetailChange: setDetail,
      onHeightChange: setHeight,
      onModeChange: setMode,
      onPreserveAspectRatioChange: setPreserveAspectRatio,
      onSmoothingChange: setSmoothing,
      onWidthChange: setWidth,
    },
  };
}
