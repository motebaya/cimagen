import JSZip from "jszip";
import { exportCanvasToBlob } from "../exportImage.js";
import { exportWatermarkedCanvas } from "./watermarkRenderer.js";

export async function exportBatchWatermark(files, layers, options = {}) {
  const zip = new JSZip();

  for (const file of files) {
    const canvas = await exportWatermarkedCanvas(file, layers, options);
    const blob = await exportCanvasToBlob(
      canvas,
      options.format || "png",
      options.quality || 0.92,
    );
    const extension = options.format || "png";
    const baseName = (file.name || "image").replace(/\.[^.]+$/, "");
    zip.file(`${options.prefix || "watermark"}_${baseName}.${extension}`, blob);
  }

  return zip.generateAsync({ type: "blob" });
}
