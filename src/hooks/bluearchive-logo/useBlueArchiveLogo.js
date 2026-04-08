import { useEffect, useMemo, useRef, useState } from "react";
import { downloadBlob, exportCanvasToBlob } from "../../utils/exportImage.js";
import {
  BLUEARCHIVE_EXPORT_FORMAT_OPTIONS,
  buildBlueArchiveFilename,
  copyBlueArchiveCanvas,
  DEFAULT_HALO_OFFSET,
  prepareBlueArchiveExportCanvas,
  renderBlueArchiveLogo,
} from "../../utils/bluearchive-logo/index.js";

function drawCanvasSurface(target, source) {
  if (!target || !source) {
    return;
  }

  const context = target.getContext("2d");

  if (!context) {
    return;
  }

  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export default function useBlueArchiveLogo() {
  const [copyState, setCopyState] = useState(null);
  const [exportDimensions, setExportDimensions] = useState({ width: 0, height: 0 });
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState("png");
  const [exportingKey, setExportingKey] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [settings, setSettings] = useState({
    decorationOffsetX: DEFAULT_HALO_OFFSET.x,
    decorationOffsetY: DEFAULT_HALO_OFFSET.y,
    leftText: "Blue",
    rightText: "Archive",
    transparentMode: false,
  });
  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const debounceRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsRendering(true);
      setError(null);

      try {
        const result = await renderBlueArchiveLogo({
          leftText: settings.leftText,
          rightText: settings.rightText,
          transparentMode: settings.transparentMode,
          haloOffset: {
            x: settings.decorationOffsetX,
            y: settings.decorationOffsetY,
          },
          crossOffset: {
            x: settings.decorationOffsetX,
            y: settings.decorationOffsetY,
          },
        });

        if (!active) {
          return;
        }

        drawCanvasSurface(previewCanvasRef.current, result.previewCanvas);
        drawCanvasSurface(exportCanvasRef.current, result.exportCanvas);
        setPreviewDimensions({
          width: result.previewCanvas.width,
          height: result.previewCanvas.height,
        });
        setExportDimensions({
          width: result.exportCanvas.width,
          height: result.exportCanvas.height,
        });
      } catch (renderError) {
        console.error(renderError);

        if (!active) {
          return;
        }

        setError(renderError.message || "Failed to render Blue Archive logo.");
      } finally {
        if (active) {
          setIsRendering(false);
        }
      }
    }, 140);

    return () => {
      active = false;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [settings]);

  const exportMetadata = useMemo(
    () => [
      ["Left", settings.leftText || "-"],
      ["Right", settings.rightText || "-"],
      ["Transparent", settings.transparentMode ? "On" : "Off"],
      [
        "Size",
        exportDimensions.width ? `${exportDimensions.width} x ${exportDimensions.height}` : "-",
      ],
    ],
    [
      exportDimensions.height,
      exportDimensions.width,
      settings.leftText,
      settings.rightText,
      settings.transparentMode,
    ],
  );

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleDownload = async () => {
    if (!exportCanvasRef.current || exportingKey) {
      return;
    }

    setExportingKey(exportFormat);
    setError(null);

    try {
      const canvas = prepareBlueArchiveExportCanvas(
        exportCanvasRef.current,
        exportFormat,
        settings.transparentMode,
      );
      const blob = await exportCanvasToBlob(
        canvas,
        exportFormat,
        exportFormat === "png" ? undefined : 0.92,
      );

      downloadBlob(blob, buildBlueArchiveFilename(exportFormat));
    } catch (exportError) {
      console.error(exportError);
      setError(exportError.message || `Failed to export ${exportFormat.toUpperCase()} file.`);
    } finally {
      setExportingKey(null);
    }
  };

  const handleCopy = async () => {
    if (!exportCanvasRef.current || exportingKey) {
      return;
    }

    setExportingKey("copy");
    setError(null);

    try {
      await copyBlueArchiveCanvas(exportCanvasRef.current);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      setCopyState("copied");
      copyTimeoutRef.current = setTimeout(() => {
        setCopyState(null);
      }, 1800);
    } catch (copyError) {
      console.error(copyError);
      setError(copyError.message || "Failed to copy PNG to clipboard.");
    } finally {
      setExportingKey(null);
    }
  };

  return {
    error,
    exportCanvasRef,
    exportCard: {
      copyState,
      exportFormat,
      exportFormats: BLUEARCHIVE_EXPORT_FORMAT_OPTIONS,
      exportMetadata,
      exportingKey,
      onCopy: handleCopy,
      onDownload: handleDownload,
      onFormatChange: setExportFormat,
    },
    previewCard: {
      dimensions: previewDimensions,
      isRendering,
      previewCanvasRef,
      transparentMode: settings.transparentMode,
    },
    settingsCard: {
      onUpdateSetting: updateSetting,
      settings,
    },
  };
}
