import { useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  createLineArtExportCanvas,
  getTimestamp,
} from "../../utils/image-to-line-art/index.js";

export default function useLineArtExport({
  backgroundValue,
  imageSrc,
  onError,
  settings,
}) {
  const [exportingFormats, setExportingFormats] = useState({});

  const exportLineArt = async (format) => {
    if (!imageSrc || exportingFormats[format]) {
      return;
    }

    setExportingFormats((current) => ({ ...current, [format]: true }));
    onError(null);

    try {
      const canvas = await createLineArtExportCanvas(imageSrc, {
        ...settings,
        background: backgroundValue,
      });
      await downloadCanvas(
        canvas,
        `line_art_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (exportError) {
      console.error(exportError);
      onError(exportError.message || "Failed to export line art image.");
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  return {
    exportLineArt,
    exportingFormats,
  };
}
