import { useMemo, useRef, useState } from "react";
import {
  METADATA_METHOD_OPTIONS,
  METADATA_IMAGE_ACCEPT_ATTRIBUTE,
  buildBasicMetadataItems,
  buildExportMetadata,
  buildMetadataTreeText,
  buildPreviewBadges,
  downloadCleanImage,
  downloadMetadataJson,
  downloadMetadataText,
} from "../../utils/metadata-viewer/index.js";
import useMetadataCopy from "./useMetadataCopy.js";
import useMetadataExtraction from "./useMetadataExtraction.js";

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

export default function useMetadataViewer() {
  const [actionError, setActionError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [method, setMethod] = useState(METADATA_METHOD_OPTIONS[0].value);
  const fileInputRef = useRef(null);

  const extraction = useMetadataExtraction({ file: imageFile, method });
  const copy = useMetadataCopy({ onError: setActionError });

  const hasImage = Boolean(imageFile);
  const error = fileError || actionError || extraction.error;

  const basicDetails = useMemo(
    () => buildBasicMetadataItems(imageFile),
    [imageFile],
  );
  const previewBadges = useMemo(
    () =>
      buildPreviewBadges({
        metadataResult: extraction.result,
        methodOption: extraction.methodOption,
      }),
    [extraction.methodOption, extraction.result],
  );
  const exportMetadata = useMemo(
    () =>
      buildExportMetadata({
        metadataResult: extraction.result,
        methodOption: extraction.methodOption,
      }),
    [extraction.methodOption, extraction.result],
  );

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError("Image is too large. Please use an image under 20MB.");
      return;
    }

    setActionError(null);
    setFileError(null);
    setImageFile(file);
    setImageFilename(file.name);
    setImageSrc(null);
    setIsDragging(false);

    const reader = new FileReader();
    reader.onload = (event) => setImageSrc(event.target?.result || null);
    reader.onerror = () =>
      setFileError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  };

  const handleMethodChange = (nextMethod) => {
    setActionError(null);
    setFileError(null);
    setMethod(nextMethod);
  };

  const handleRemoveImage = () => {
    setActionError(null);
    setFileError(null);
    setImageFile(null);
    setImageFilename("");
    setImageSrc(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyJson = () => {
    setActionError(null);
    return copy.copyText(
      "export-json",
      JSON.stringify(extraction.result?.data || {}, null, 2),
    );
  };

  const handleCopyText = () => {
    setActionError(null);
    return copy.copyText("export-text", buildMetadataTreeText(extraction.rows));
  };

  const handleCopyValue = (nodeId, value) => {
    setActionError(null);
    return copy.copyText(`row:${nodeId}`, value);
  };

  const handleDownloadJson = () => {
    if (!extraction.result?.data) {
      return;
    }

    setActionError(null);

    try {
      downloadMetadataJson(extraction.result.data, imageFilename);
    } catch {
      setActionError("Failed to download metadata JSON. Please try again.");
    }
  };

  const handleDownloadText = () => {
    if (!extraction.rows.length) {
      return;
    }

    setActionError(null);

    try {
      downloadMetadataText(extraction.rows, imageFilename);
    } catch {
      setActionError("Failed to download parsed metadata. Please try again.");
    }
  };

  const handleDownloadClean = async () => {
    if (!imageFile) {
      return;
    }

    setActionError(null);

    try {
      await downloadCleanImage(imageFile, imageFilename);
    } catch {
      setActionError("Failed to remove metadata. Please try again.");
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (!extraction.result?.gps) {
      return;
    }

    const { latitude, longitude } = extraction.result.gps;
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return {
    error,
    exportCard: {
      copiedKey: copy.copiedKey,
      exportMetadata,
      hasImage,
      hasMetadata: extraction.hasMetadata,
      onCopyJson: handleCopyJson,
      onCopyText: handleCopyText,
      onDownloadClean: handleDownloadClean,
      onDownloadJson: handleDownloadJson,
      onDownloadText: handleDownloadText,
    },
    locationCard: {
      gps: extraction.result?.gps || null,
      onOpenInGoogleMaps: handleOpenInGoogleMaps,
    },
    previewCard: {
      badges: previewBadges,
      basicDetails,
      fileInputRef,
      hasImage,
      imageFilename,
      imageSrc,
      inputAccept: METADATA_IMAGE_ACCEPT_ATTRIBUTE,
      isDragging,
      isExtracting: extraction.isExtracting,
      methodLabel: extraction.methodOption.label,
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
      onFileSelect: handleFileSelect,
      onImageInputChange: (event) => {
        handleFileSelect(event.target.files?.[0] || null);
        event.target.value = "";
      },
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: handleRemoveImage,
    },
    resultCard: {
      copiedKey: copy.copiedKey,
      fieldCount: extraction.result?.fieldCount || 0,
      hasImage,
      hasMetadata: extraction.hasMetadata,
      hasCamera: extraction.result?.hasCamera || false,
      hasGPS: extraction.result?.hasGPS || false,
      isExtracting: extraction.isExtracting,
      methodLabel: extraction.methodOption.label,
      onCopyValue: handleCopyValue,
      rows: extraction.rows,
    },
    settingsCard: {
      isExtracting: extraction.isExtracting,
      method,
      methodOption: extraction.methodOption,
      methodOptions: METADATA_METHOD_OPTIONS,
      onMethodChange: handleMethodChange,
    },
  };
}
