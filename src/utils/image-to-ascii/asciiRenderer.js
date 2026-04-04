import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import { DEFAULT_SORTED_CHARSET } from "./asciiConstants.js";
import { clamp, getCharsetString, normalizeScale } from "./asciiHelpers.js";

const CHAR_BRIGHTNESS_CACHE = new Map();

function countLitPixels(imageData) {
  let count = 0;

  for (let index = 0; index < imageData.data.length; index += 4) {
    if (
      imageData.data[index] > 0 ||
      imageData.data[index + 1] > 0 ||
      imageData.data[index + 2] > 0 ||
      imageData.data[index + 3] > 0
    ) {
      count += 1;
    }
  }

  return count;
}

export function getBrightnessOfChar(char, options = {}) {
  const fontSize = options.fontSize || 20;
  const fontFamily = options.fontFamily || "monospace";
  const cacheKey = `${char}__${fontSize}__${fontFamily}`;

  if (CHAR_BRIGHTNESS_CACHE.has(cacheKey)) {
    return CHAR_BRIGHTNESS_CACHE.get(cacheKey);
  }

  const canvas = createCanvas(fontSize * 3, fontSize * 3);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.fillText(char, fontSize * 0.4, fontSize * 0.2);

  const brightness = countLitPixels(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
  );
  CHAR_BRIGHTNESS_CACHE.set(cacheKey, brightness);
  return brightness;
}

export function sortCharsetByBrightness(charset, options = {}) {
  return [...getCharsetString(charset, DEFAULT_SORTED_CHARSET)].sort(
    (left, right) => {
      const brightnessDifference =
        getBrightnessOfChar(left, options) -
        getBrightnessOfChar(right, options);

      if (brightnessDifference !== 0) {
        return brightnessDifference;
      }

      return left.localeCompare(right);
    },
  );
}

function applyBrightnessContrast(imageData, brightness, contrast, invert) {
  const result = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
  );

  const contrastFactor = Math.max(0, contrast);

  for (let index = 0; index < result.data.length; index += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      const original = result.data[index + channel] * brightness;
      const contrasted = 128 + (original - 128) * contrastFactor;
      result.data[index + channel] = invert
        ? 255 - clamp(contrasted, 0, 255)
        : clamp(contrasted, 0, 255);
    }
  }

  return result;
}

function createBlurredData(imageData) {
  const { width, height, data } = imageData;
  const blurred = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sums = [0, 0, 0, 0];
      let total = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const sampleY = clamp(y + offsetY, 0, height - 1);
          const sampleIndex = (sampleY * width + sampleX) * 4;
          total += 1;

          for (let channel = 0; channel < 4; channel += 1) {
            sums[channel] += data[sampleIndex + channel];
          }
        }
      }

      const targetIndex = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        blurred[targetIndex + channel] = sums[channel] / total;
      }
    }
  }

  return new ImageData(blurred, width, height);
}

function applySharpness(imageData, sharpness) {
  if (sharpness === 1) {
    return imageData;
  }

  const blurred = createBlurredData(imageData);
  const result = new Uint8ClampedArray(imageData.data.length);

  for (let index = 0; index < imageData.data.length; index += 1) {
    const original = imageData.data[index];
    const softened = blurred.data[index];
    result[index] = clamp(softened + (original - softened) * sharpness, 0, 255);
  }

  return new ImageData(result, imageData.width, imageData.height);
}

function luminance(red, green, blue) {
  return Math.round(red * 0.299 + green * 0.587 + blue * 0.114);
}

export async function imageToAscii(source, options = {}) {
  const {
    size = null,
    charset = null,
    fixScaling = true,
    scale = 1,
    sharpness = 1,
    brightness = 1,
    contrast = 1,
    invert = false,
    sortChars = false,
    colorful = false,
  } = options;

  const sourceCanvas = await sourceToCanvas(source);
  const baseWidth = size?.[0] ?? sourceCanvas.width;
  const baseHeight = size?.[1] ?? sourceCanvas.height;
  const [scaleX, scaleY] = normalizeScale(scale);
  const targetWidth = Math.max(
    1,
    Math.floor(baseWidth * scaleX * (fixScaling ? 2 : 1)),
  );
  const targetHeight = Math.max(1, Math.floor(baseHeight * scaleY));
  const sortedCharset = sortChars
    ? sortCharsetByBrightness(charset || DEFAULT_SORTED_CHARSET).join("")
    : getCharsetString(charset, DEFAULT_SORTED_CHARSET);

  const scaledCanvas = createCanvas(targetWidth, targetHeight);
  const scaledContext = scaledCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  scaledContext.imageSmoothingEnabled = true;
  scaledContext.imageSmoothingQuality = "high";
  scaledContext.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  const baseData = scaledContext.getImageData(0, 0, targetWidth, targetHeight);
  const adjusted = applySharpness(
    applyBrightnessContrast(baseData, brightness, contrast, invert),
    sharpness,
  );

  const rows = [];
  const colorRows = [];
  const { data } = adjusted;

  for (let y = 0; y < targetHeight; y += 1) {
    let row = "";
    const rowColors = [];

    for (let x = 0; x < targetWidth; x += 1) {
      const index = (y * targetWidth + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const grayscale = luminance(red, green, blue);
      const charsetIndex = Math.min(
        sortedCharset.length - 1,
        Math.floor((grayscale * sortedCharset.length) / 256),
      );
      row += sortedCharset[charsetIndex];
      rowColors.push([red, green, blue, data[index + 3]]);
    }

    rows.push(row);
    colorRows.push(rowColors);
  }

  return {
    text: rows.join("\n"),
    rows,
    width: targetWidth,
    height: targetHeight,
    charset: sortedCharset,
    colorRows: colorful ? colorRows : null,
  };
}

export function renderAsciiToCanvas(asciiResult, options = {}) {
  const {
    fontSize = 10,
    fontFamily = '"SFMono-Regular", Consolas, monospace',
    lineHeight = 1.15,
    padding = 16,
    textColor = "#f5f7fa",
    backgroundColor = "#111318",
    colorful = false,
  } = options;

  const rows = asciiResult.rows || `${asciiResult}`.split("\n");
  const colorRows = asciiResult.colorRows;
  const tempCanvas = createCanvas(1, 1);
  const tempContext = tempCanvas.getContext("2d");
  tempContext.font = `${fontSize}px ${fontFamily}`;

  const characterWidth = Math.max(
    1,
    Math.ceil(tempContext.measureText("M").width),
  );
  const linePixelHeight = Math.max(1, Math.ceil(fontSize * lineHeight));
  const maxColumns = rows.reduce(
    (largest, row) => Math.max(largest, row.length),
    0,
  );

  const canvas = createCanvas(
    maxColumns * characterWidth + padding * 2,
    rows.length * linePixelHeight + padding * 2,
  );
  const ctx = canvas.getContext("2d");
  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = textColor;

  rows.forEach((row, rowIndex) => {
    const y = padding + rowIndex * linePixelHeight;

    if (colorful && colorRows?.[rowIndex]) {
      [...row].forEach((character, columnIndex) => {
        const [red, green, blue, alpha] = colorRows[rowIndex][columnIndex];
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
        ctx.fillText(character, padding + columnIndex * characterWidth, y);
      });
      return;
    }

    ctx.fillStyle = textColor;
    ctx.fillText(row, padding, y);
  });

  return canvas;
}
