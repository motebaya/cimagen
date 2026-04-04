import { createCanvas, getAspectFitScale } from "../canvasUtils.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function resizeCanvas(sourceCanvas, width, height, options = {}) {
  const canvas = createCanvas(
    Math.max(1, Math.round(width)),
    Math.max(1, Math.round(height)),
  );
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = options.imageSmoothingEnabled ?? true;
  context.imageSmoothingQuality = options.imageSmoothingQuality || "high";
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function ensureTensorflowBackend() {
  const tf = await import("@tensorflow/tfjs");
  await tf.ready();

  if (tf.getBackend() === "cpu") {
    try {
      await tf.setBackend("webgl");
    } catch {
      await tf.setBackend("cpu");
    }
  }

  return tf;
}

export function progressiveUpscale(sourceCanvas, scale, options = {}) {
  const maxStep = options.maxStep || 2;
  let current = sourceCanvas;
  let remaining = scale;

  while (remaining > 1.001) {
    const step = remaining > maxStep ? maxStep : remaining;
    current = resizeCanvas(
      current,
      current.width * step,
      current.height * step,
      {
        imageSmoothingEnabled: options.imageSmoothingEnabled ?? true,
        imageSmoothingQuality: options.imageSmoothingQuality || "high",
      },
    );
    remaining /= step;
  }

  return current;
}

export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds)) {
    return "-";
  }

  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)} ms`;
  }

  return `${(milliseconds / 1000).toFixed(1)} s`;
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
