import { useState } from "react";
import {
  createPixelJson,
  createPixelSvg,
  exportPixelBlob,
  exportPixelCanvas,
  renderPixelArtCanvas,
} from "../../utils/image-to-pixel/index.js";

export default function usePixelExport({
  backgroundValue,
  onError,
  pixelArt,
  settings,
}) {
  const [exportingFormats, setExportingFormats] = useState({});

  const exportFormat = async (format) => {
    if (!pixelArt || exportingFormats[format]) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));

    try {
      if (format === "svg") {
        exportPixelBlob(
          createPixelSvg(pixelArt, {
            scale: settings.outputScale,
            background: backgroundValue,
          }),
          "svg",
          "image/svg+xml;charset=utf-8",
        );
        return;
      }

      if (format === "json") {
        exportPixelBlob(
          createPixelJson(pixelArt),
          "json",
          "application/json;charset=utf-8",
        );
        return;
      }

      const canvas = renderPixelArtCanvas(pixelArt, {
        scale: settings.outputScale,
        background: backgroundValue,
        showGrid: format === "pixel-png" ? settings.showGrid : false,
        smoothing: format === "png",
      });
      await exportPixelCanvas(canvas);
    } catch (exportError) {
      console.error(exportError);
      onError(exportError.message || "Failed to export pixel art.");
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  return {
    exportFormat,
    exportingFormats,
  };
}
