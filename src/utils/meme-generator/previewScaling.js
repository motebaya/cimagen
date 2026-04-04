import { createCanvas, getAspectFitScale } from "../canvasUtils.js";

export function fitCanvas(sourceCanvas, maxDimension) {
  if (Math.max(sourceCanvas.width, sourceCanvas.height) <= maxDimension) {
    return sourceCanvas;
  }

  const scale = getAspectFitScale(
    sourceCanvas.width,
    sourceCanvas.height,
    maxDimension,
    maxDimension,
  );

  return scaleCanvas(sourceCanvas, scale);
}

export function fitCanvasToBounds(sourceCanvas, bounds = {}) {
  const maxWidth = Number(bounds.maxWidth) || Infinity;
  const maxHeight = Number(bounds.maxHeight) || Infinity;

  if (!Number.isFinite(maxWidth) && !Number.isFinite(maxHeight)) {
    return sourceCanvas;
  }

  const widthScale = Number.isFinite(maxWidth)
    ? maxWidth / sourceCanvas.width
    : Infinity;
  const heightScale = Number.isFinite(maxHeight)
    ? maxHeight / sourceCanvas.height
    : Infinity;
  const scale = Math.min(widthScale, heightScale, 1);

  if (scale >= 1) {
    return sourceCanvas;
  }

  return scaleCanvas(sourceCanvas, scale);
}

export function scaleCanvas(sourceCanvas, scale) {
  const canvas = createCanvas(
    Math.max(1, Math.round(sourceCanvas.width * scale)),
    Math.max(1, Math.round(sourceCanvas.height * scale)),
  );
  const context = canvas.getContext("2d");
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function scaleBound(bound, scale) {
  return {
    ...bound,
    x: bound.x * scale,
    y: bound.y * scale,
    width: bound.width * scale,
    height: bound.height * scale,
    centerX: bound.centerX * scale,
    centerY: bound.centerY * scale,
  };
}

export function getRotatedBound(centerX, centerY, width, height, rotation = 0) {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);

  return {
    x: centerX - rotatedWidth / 2,
    y: centerY - rotatedHeight / 2,
    width: rotatedWidth,
    height: rotatedHeight,
    centerX,
    centerY,
  };
}
