import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPaletteCssVariables,
  buildPaletteHexList,
  buildPaletteJson,
  createColorId,
  createPaletteWorker,
  DEFAULT_PALETTE_SETTINGS,
  sampleImagePixels,
  sortPaletteColors,
  PALETTE_SORT_OPTIONS,
} from "../../utils/color-palette-extractor/index.js";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import usePaletteExport from "./usePaletteExport.js";
import usePaletteImageOverlay from "./usePaletteImageOverlay.js";
import usePaletteSelection from "./usePaletteSelection.js";

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

export default function useColorPaletteExtractor() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawResult, setRawResult] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_PALETTE_SETTINGS);

  const fileInputRef = useRef(null);
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const imageMetaRef = useRef({ width: 0, height: 0 });
  const sampledPixelsRef = useRef([]);

  useEffect(() => {
    workerRef.current = createPaletteWorker();

    workerRef.current.onmessage = (event) => {
      const { id, error: workerError, ...payload } = event.data;

      if (id !== requestIdRef.current) {
        return;
      }

      if (workerError) {
        setError(workerError);
        setRawResult(null);
      } else {
        setError(null);
        setRawResult(payload);
      }

      setIsProcessing(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!imageSrc || !workerRef.current) {
      setRawResult(null);
      return;
    }

    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;
    setIsProcessing(true);
    setError(null);

    sampleImagePixels(imageSrc, settings.sampleLimit)
      .then(({ width, height, pixels }) => {
        imageMetaRef.current = { width, height };
        sampledPixelsRef.current = pixels;
        workerRef.current?.postMessage({
          id: nextRequestId,
          pixels,
          colorCount: settings.colorCount,
        });
      })
      .catch((processingError) => {
        console.error(processingError);
        setIsProcessing(false);
        setRawResult(null);
        setError(processingError.message || "Failed to extract palette.");
      });
  }, [imageSrc, settings.colorCount, settings.sampleLimit]);

  const result = useMemo(() => {
    if (!rawResult) {
      return null;
    }

    const sortedPalette = sortPaletteColors(
      rawResult.palette,
      settings.sortMode,
    ).map((color, index) => ({
      ...color,
      id: createColorId(color, index),
    }));

    return {
      ...rawResult,
      palette: sortedPalette,
    };
  }, [rawResult, settings.sortMode]);

  const selection = usePaletteSelection(result?.palette || []);
  const overlay = usePaletteImageOverlay({
    palette: result?.palette || [],
    sampledPixels: sampledPixelsRef.current,
    selectedColorId: selection.selectedColorId,
  });
  const exportActions = usePaletteExport({ onError: setError });

  const paletteHexList = useMemo(() => buildPaletteHexList(result), [result]);
  const cssVariables = useMemo(
    () => buildPaletteCssVariables(result),
    [result],
  );
  const jsonExport = useMemo(
    () => buildPaletteJson(result, imageMetaRef.current, imageFilename),
    [result, imageFilename],
  );

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

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

  const handleImageInputChange = (event) => {
    handleFileSelect(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const removeImage = () => {
    setImageSrc(null);
    setImageFilename("");
    setRawResult(null);
    setError(null);
    imageMetaRef.current = { width: 0, height: 0 };
    sampledPixelsRef.current = [];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedColor = useMemo(
    () =>
      result?.palette.find((color) => color.id === selection.selectedColorId) ||
      null,
    [result, selection.selectedColorId],
  );

  return {
    error,
    exportCard: {
      copyState: exportActions.copyState,
      cssVariables,
      hasPalette: Boolean(result),
      jsonExport,
      metadata: [
        ["Colors", result?.palette.length || "-"],
        ["Samples", result?.sampleCount?.toLocaleString?.() || "-"],
        ["Average", result?.average?.hex || "-"],
        ["Sort", settings.sortMode],
      ],
      onCopyCss: () => exportActions.copyText(cssVariables, "css"),
      onCopyHex: () => exportActions.copyText(paletteHexList, "hex"),
      onDownloadJson: () => exportActions.downloadText(jsonExport, "json"),
      onDownloadTxt: () => exportActions.downloadText(paletteHexList, "txt"),
    },
    previewCard: {
      hasImage: Boolean(imageSrc),
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isProcessing,
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
      onImageInputChange: handleImageInputChange,
      onOpenImagePicker: () => openFilePicker(fileInputRef.current),
      onRemoveImage: removeImage,
      overlay: overlay.selectedOverlay,
      fileInputRef,
      result,
      selectedColor,
      selectedColorId: selection.selectedColorId,
      copiedColorId: selection.copiedColorId,
      onSelectColor: selection.setSelectedColorId,
      onCopyColor: async (hex, colorId) => {
        try {
          await navigator.clipboard.writeText(hex);
          selection.setCopiedColorId(colorId);
        } catch (copyError) {
          console.error(copyError);
          setError(
            "Clipboard access failed. You can still use the export actions on the right.",
          );
        }
      },
      showPercentages: settings.showPercentages,
    },
    settingsCard: {
      averageColor: result?.average?.hex || null,
      selectedColorHex: selectedColor?.hex || null,
      settings,
      sortOptions: PALETTE_SORT_OPTIONS,
      onUpdateSetting: (key, value) =>
        setSettings((current) => ({ ...current, [key]: value })),
    },
  };
}
