import { useEffect, useMemo, useRef, useState } from "react";
import {
  getImageAcceptAttribute,
  isValidImage,
  isValidSize,
} from "../../utils/fileValidation.js";
import {
  buildOcrExportMetadata,
  buildOcrJsonPayload,
  countOcrWords,
  downloadOcrJson,
  downloadOcrText,
  getOcrLanguageOption,
  OCR_LANGUAGE_OPTIONS,
  recognizeImageText,
} from "../../utils/ocr-reader/index.js";

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

function formatOcrStatus(status) {
  if (!status) {
    return "Preparing OCR";
  }

  return status
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function useOcrReader() {
  const [copyState, setCopyState] = useState(null);
  const [error, setError] = useState(null);
  const [imageFilename, setImageFilename] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState(OCR_LANGUAGE_OPTIONS[0].value);
  const [ocrText, setOcrText] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Preparing OCR");
  const fileInputRef = useRef(null);
  const requestRef = useRef(0);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!imageSrc) {
      setIsProcessing(false);
      setProgress(0);
      setStatusText("Preparing OCR");
      return;
    }

    let active = true;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    const languageOption = getOcrLanguageOption(language);

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setStatusText(`Reading ${languageOption.label}`);

    (async () => {
      try {
        const nextText = await recognizeImageText({
          imageSource: imageSrc,
          language,
          onProgress: ({ progress: nextProgress, status }) => {
            if (!active || requestRef.current !== requestId) {
              return;
            }

            setProgress(nextProgress);
            setStatusText(formatOcrStatus(status));
          },
        });

        if (!active || requestRef.current !== requestId) {
          return;
        }

        setOcrText(nextText.trim());
      } catch (processingError) {
        console.error(processingError);

        if (!active || requestRef.current !== requestId) {
          return;
        }

        setOcrText("");
        setError(
          "Failed to extract text. Please try again with a clearer image.",
        );
      } finally {
        if (active && requestRef.current === requestId) {
          setIsProcessing(false);
          setStatusText("Ready");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [imageSrc, language]);

  const languageOption = useMemo(
    () => getOcrLanguageOption(language),
    [language],
  );
  const hasImage = Boolean(imageSrc);
  const hasText = ocrText.trim().length > 0;
  const exportMetadata = useMemo(
    () =>
      buildOcrExportMetadata({
        languageLabel: languageOption.label,
        text: ocrText,
      }),
    [languageOption.label, ocrText],
  );

  const setCopied = (key) => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    setCopyState(key);
    copyTimeoutRef.current = setTimeout(() => {
      setCopyState(null);
    }, 1800);
  };

  const copyText = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      setError("Failed to copy text. Please try again.");
    }
  };

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

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
    setOcrText("");
    setProgress(0);
    setStatusText("Preparing OCR");

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result || null);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    requestRef.current += 1;
    setError(null);
    setImageFilename("");
    setImageSrc(null);
    setOcrText("");
    setProgress(0);
    setStatusText("Preparing OCR");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadText = () => {
    downloadOcrText({ imageFilename, text: ocrText });
  };

  const handleDownloadJson = () => {
    downloadOcrJson(
      buildOcrJsonPayload({
        imageFilename,
        language,
        languageLabel: languageOption.label,
        text: ocrText,
      }),
    );
  };

  return {
    error,
    exportCard: {
      copiedKey: copyState,
      disabled: !hasImage || !hasText,
      exportMetadata,
      hasImage,
      hasText,
      onCopyJson: () =>
        copyText(
          "json",
          JSON.stringify(
            buildOcrJsonPayload({
              imageFilename,
              language,
              languageLabel: languageOption.label,
              text: ocrText,
            }),
            null,
            2,
          ),
        ),
      onCopyText: () => copyText("text", ocrText),
      onDownloadJson: handleDownloadJson,
      onDownloadText: handleDownloadText,
    },
    resultCard: {
      fileInputRef,
      hasImage,
      imageFilename,
      imageSrc,
      inputAccept: getImageAcceptAttribute(),
      isDragging,
      isProcessing,
      ocrText,
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
      onRemoveImage: handleRemoveImage,
      onTextChange: setOcrText,
      progress,
      statusText,
      wordCount: countOcrWords(ocrText),
    },
    settingsCard: {
      language,
      languageOption,
      languageOptions: OCR_LANGUAGE_OPTIONS,
      onLanguageChange: setLanguage,
    },
  };
}
