import { useEffect, useRef, useState } from "react";
import {
  generateAppIcons,
  generatePreviewIcons,
} from "../../utils/appIconGenerator.js";
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

export default function useAppIconGenerator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceCanvas, setSourceCanvas] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [androidName, setAndroidName] = useState("ic_launcher");
  const [appName, setAppName] = useState("[App Name]");
  const [badgeEnabled, setBadgeEnabled] = useState(false);
  const [badgeText, setBadgeText] = useState("NEW");
  const [badgeColor, setBadgeColor] = useState("#ff0000");
  const [previewIcons, setPreviewIcons] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!sourceCanvas) {
      setPreviewIcons(null);
      return;
    }

    const badge = badgeEnabled
      ? { enabled: true, text: badgeText, color: badgeColor }
      : null;

    setPreviewIcons(
      generatePreviewIcons(sourceCanvas, zoom, backgroundColor, badge),
    );
  }, [
    sourceCanvas,
    zoom,
    backgroundColor,
    badgeEnabled,
    badgeText,
    badgeColor,
  ]);

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
      const img = new Image();

      img.onload = () => {
        setImageSrc(event.target?.result || null);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        setSourceCanvas(canvas);
      };

      img.src = event.target?.result || "";
    };
    reader.onerror = () =>
      setError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setSourceCanvas(null);
    setPreviewIcons(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    if (!sourceCanvas || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const badge = badgeEnabled
        ? { enabled: true, text: badgeText, color: badgeColor }
        : null;
      const zipBlob = await generateAppIcons(sourceCanvas, {
        zoom,
        backgroundColor,
        androidName,
        badge,
      });
      const url = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `app-icons-${Date.now()}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate icons. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    exportCard: {
      disabled: !sourceCanvas,
      exportMetadata: [
        ["Android", androidName],
        ["App", appName],
        ["Badge", badgeEnabled ? badgeText : "Off"],
        ["Background", backgroundColor],
      ],
      isProcessing,
      onExport: handleExport,
    },
    pageState: { error },
    previewCard: {
      appName,
      fileInputRef,
      hasImage: Boolean(imageSrc),
      imageFilename,
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
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      previewIcons,
    },
    settingsCard: {
      androidName,
      appName,
      backgroundColor,
      badgeColor,
      badgeEnabled,
      badgeText,
      onAndroidNameChange: setAndroidName,
      onAppNameChange: setAppName,
      onBackgroundColorChange: setBackgroundColor,
      onBadgeColorChange: setBadgeColor,
      onBadgeEnabledChange: setBadgeEnabled,
      onBadgeTextChange: setBadgeText,
      onZoomChange: setZoom,
      zoom,
    },
  };
}
