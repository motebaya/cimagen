import { createCanvas } from "../canvasUtils.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((value) =>
      clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

export function colorDistance(left, right) {
  return Math.sqrt(
    (left.r - right.r) ** 2 + (left.g - right.g) ** 2 + (left.b - right.b) ** 2,
  );
}

export function resolveBackgroundValue(background, customBackground) {
  return background === "custom" ? customBackground : background;
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) {
    return;
  }

  const ctx = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0);
}

export function resizeCanvas(sourceCanvas, width, height, smoothing = true) {
  const canvas = createCanvas(
    Math.max(1, Math.round(width)),
    Math.max(1, Math.round(height)),
  );
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = smoothing;
  ctx.imageSmoothingQuality = smoothing ? "high" : "low";
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
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
