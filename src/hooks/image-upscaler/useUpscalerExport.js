import { useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  getTimestamp,
  upscaleImage,
} from "../../utils/image-upscaler/index.js";

export default function useUpscalerExport({
  imageSrc,
  selectedModel,
  settings,
  onError,
}) {
  const [exportingFormats, setExportingFormats] = useState({});

  const exportUpscaledImage = async (format) => {
    if (!imageSrc || !selectedModel || exportingFormats[format]) return;

    setExportingFormats((current) => ({ ...current, [format]: true }));
    onError(null);

    try {
      const result = await upscaleImage(imageSrc, {
        ...settings,
        modelId: selectedModel.id,
      });
      await downloadCanvas(
        result.canvas,
        `upscale_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (error) {
      console.error(error);
      onError(error.message || "Failed to export upscaled image.");
    } finally {
      setExportingFormats((current) => ({ ...current, [format]: false }));
    }
  };

  return {
    exportUpscaledImage,
    exportingFormats,
  };
}
