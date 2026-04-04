import { createCanvas, getAspectFitScale } from "../canvasUtils.js";

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) return;

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export function fitCanvasToMaxDimension(sourceCanvas, maxDimension) {
  if (
    !maxDimension ||
    Math.max(sourceCanvas.width, sourceCanvas.height) <= maxDimension
  ) {
    return sourceCanvas;
  }

  const scale = getAspectFitScale(
    sourceCanvas.width,
    sourceCanvas.height,
    maxDimension,
    maxDimension,
  );
  const canvas = createCanvas(
    Math.max(1, Math.round(sourceCanvas.width * scale)),
    Math.max(1, Math.round(sourceCanvas.height * scale)),
  );
  const context = canvas.getContext("2d");
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function loadImageElement(src, errorMessage = "Failed to load image.") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(errorMessage));
    image.src = src;
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result || null);
    reader.onerror = () =>
      reject(new Error("Failed to read the file. Please try again."));
    reader.readAsDataURL(file);
  });
}
