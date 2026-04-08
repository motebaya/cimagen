import { exportCanvasToBlob } from "../exportImage.js";

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function buildBlueArchiveFilename(format) {
  return `bluea-archive-logo_${Date.now()}.${format === "jpg" ? "jpg" : format}`;
}

export function prepareBlueArchiveExportCanvas(canvas, format, transparentMode) {
  if (!transparentMode || format === "png") {
    return canvas;
  }

  const exportCanvas = createCanvas(canvas.width, canvas.height);
  const context = exportCanvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.drawImage(canvas, 0, 0);
  return exportCanvas;
}

export async function copyBlueArchiveCanvas(canvas) {
  const blob = await exportCanvasToBlob(canvas, "png", 0.92);

  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("Clipboard image export is not available in this browser.");
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": blob,
    }),
  ]);
}
