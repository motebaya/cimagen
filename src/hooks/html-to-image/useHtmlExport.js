import { downloadCanvas } from "../../utils/exportImage.js";
import { getTimestamp } from "../../utils/html-to-image/index.js";

export default function useHtmlExport() {
  const exportCapture = async (canvas, format) => {
    if (!canvas) return;

    await downloadCanvas(
      canvas,
      `html_capture_${getTimestamp()}`,
      format,
      format === "webp" ? 0.92 : 0.95,
    );
  };

  return {
    exportCapture,
  };
}
