import { useState } from "react";
import { downloadCanvas } from "../../utils/exportImage.js";
import { renderFaceBlur } from "../../utils/face-blur/blurPipeline.js";
import { getTimestamp } from "../../utils/face-blur/faceBlurHelpers.js";

export default function useFaceBlurExport({
  imageSrc,
  faces,
  settings,
  onError,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = async (format) => {
    if (!imageSrc || isExporting || !faces.length) return;

    setIsExporting(true);
    onError(null);

    try {
      const canvas = await renderFaceBlur(imageSrc, faces, settings);
      await downloadCanvas(
        canvas,
        `face_blur_${getTimestamp()}`,
        format,
        format === "webp" ? 0.92 : 0.95,
      );
    } catch (error) {
      console.error(error);
      onError(error.message || "Failed to export processed image.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportImage,
  };
}
