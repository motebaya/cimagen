import { useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import {
  getTimestamp,
  loadImageElement,
} from "../../utils/background-remover/backgroundRemovalHelpers.js";
import { removeBackground } from "../../utils/background-remover/removalPipeline.js";

export default function useBackgroundRemovalExport({
  imageSrc,
  backgroundImageSrc,
  settings,
  selectedModelId,
  onError,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = async (format) => {
    if (!imageSrc || isExporting) return;

    setIsExporting(true);
    onError(null);

    try {
      const backgroundImage =
        settings.backgroundMode === "image" && backgroundImageSrc
          ? await loadImageElement(
              backgroundImageSrc,
              "Failed to load replacement background.",
            )
          : null;

      const exportResult = await removeBackground(imageSrc, {
        ...settings,
        modelId: selectedModelId,
        backgroundImage,
      });

      await downloadCanvas(
        exportResult.canvas,
        `background_remove_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (error) {
      console.error(error);
      onError(error.message || "Failed to export background removal.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportImage,
  };
}
