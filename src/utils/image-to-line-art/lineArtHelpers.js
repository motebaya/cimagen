import { createCanvas, getAspectFitScale } from "../canvasUtils.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function parseHexColor(hex) {
  const value = hex.replace("#", "").trim();
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value;

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

export function getPreviewSize(width, height, maxDimension) {
  if (!maxDimension || Math.max(width, height) <= maxDimension) {
    return { width, height };
  }

  const scale = getAspectFitScale(width, height, maxDimension, maxDimension);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function resolveBackgroundValue(settings) {
  if (settings.background === "custom") {
    return settings.customBackground;
  }

  return settings.background;
}

export function resolveColors(background, customBackground, invert) {
  const backgroundColor =
    background === "custom" ? customBackground : background;
  const rgb =
    backgroundColor === "transparent"
      ? [255, 255, 255]
      : parseHexColor(backgroundColor);
  const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  const defaultLine = luminance > 140 ? "#000000" : "#ffffff";
  const alternateLine = defaultLine === "#000000" ? "#ffffff" : "#000000";

  return {
    background: backgroundColor,
    line: invert ? alternateLine : defaultLine,
  };
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) {
    return;
  }

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export function renderScaledSourceCanvas(sourceCanvas, width, height) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, width, height);
  return canvas;
}
