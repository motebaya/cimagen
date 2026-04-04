import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import {
  COLOR_COUNT_OPTIONS,
  OUTPUT_SCALE_OPTIONS,
  PIXEL_DITHERING_OPTIONS,
  PIXEL_OUTLINE_OPTIONS,
  PIXEL_PREVIEW_MAX_EDGE,
  PIXEL_SIZE_OPTIONS,
} from "./pixelConstants.js";
import { ditherPixels } from "./pixelDithering.js";
import { PALETTE_PRESETS, parsePaletteInput } from "./pixelPalettes.js";
import {
  clamp,
  drawCanvasSurface,
  hexToRgb,
  resizeCanvas,
  rgbToHex,
} from "./pixelHelpers.js";

function boxBlur(imageData, radius) {
  if (radius <= 0) {
    return imageData;
  }

  const result = new Uint8ClampedArray(imageData.data.length);
  const { width, height, data } = imageData;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sums = [0, 0, 0, 0];
      let total = 0;

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const sampleY = clamp(y + offsetY, 0, height - 1);
          const sampleIndex = (sampleY * width + sampleX) * 4;
          total += 1;

          for (let channel = 0; channel < 4; channel += 1) {
            sums[channel] += data[sampleIndex + channel];
          }
        }
      }

      const index = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        result[index + channel] = sums[channel] / total;
      }
    }
  }

  return new ImageData(result, width, height);
}

function sharpenImageData(imageData, amount) {
  if (amount <= 0) {
    return imageData;
  }

  const blurred = boxBlur(imageData, 1);
  const result = new Uint8ClampedArray(imageData.data.length);

  for (let index = 0; index < imageData.data.length; index += 1) {
    result[index] = clamp(
      imageData.data[index] +
        (imageData.data[index] - blurred.data[index]) * amount,
      0,
      255,
    );
  }

  return new ImageData(result, imageData.width, imageData.height);
}

function applyContrast(imageData, contrast) {
  if (contrast === 1) {
    return imageData;
  }

  const result = new Uint8ClampedArray(imageData.data.length);

  for (let index = 0; index < imageData.data.length; index += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      const value = 128 + (imageData.data[index + channel] - 128) * contrast;
      result[index + channel] = clamp(value, 0, 255);
    }
    result[index + 3] = imageData.data[index + 3];
  }

  return new ImageData(result, imageData.width, imageData.height);
}

function preprocessCanvas(canvas, settings) {
  const nextCanvas = createCanvas(canvas.width, canvas.height);
  const ctx = nextCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0);

  let imageData = ctx.getImageData(0, 0, nextCanvas.width, nextCanvas.height);
  imageData = applyContrast(imageData, settings.contrast || 1);
  imageData = boxBlur(imageData, Math.round(settings.blur || 0));
  imageData = sharpenImageData(imageData, settings.sharpen || 0);
  ctx.putImageData(imageData, 0, 0);

  return nextCanvas;
}

function createAdaptivePalette(pixels, count) {
  const clusters = [];
  const step = Math.max(1, Math.floor(pixels.length / 4000));
  const samples = [];

  for (let index = 0; index < pixels.length; index += step) {
    samples.push(pixels[index]);
  }

  if (samples.length === 0) {
    return [{ r: 0, g: 0, b: 0 }];
  }

  for (let index = 0; index < Math.min(count, samples.length); index += 1) {
    const sample =
      samples[
        Math.floor((index / Math.min(count, samples.length)) * samples.length)
      ] || samples[0];
    clusters.push({ ...sample });
  }

  for (let iteration = 0; iteration < 10; iteration += 1) {
    const buckets = clusters.map(() => ({ r: 0, g: 0, b: 0, total: 0 }));

    samples.forEach((pixel) => {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      clusters.forEach((cluster, clusterIndex) => {
        const distance = Math.sqrt(
          (pixel.r - cluster.r) ** 2 +
            (pixel.g - cluster.g) ** 2 +
            (pixel.b - cluster.b) ** 2,
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = clusterIndex;
        }
      });

      buckets[nearestIndex].r += pixel.r;
      buckets[nearestIndex].g += pixel.g;
      buckets[nearestIndex].b += pixel.b;
      buckets[nearestIndex].total += 1;
    });

    buckets.forEach((bucket, index) => {
      if (!bucket.total) {
        return;
      }

      clusters[index] = {
        r: bucket.r / bucket.total,
        g: bucket.g / bucket.total,
        b: bucket.b / bucket.total,
      };
    });
  }

  return clusters;
}

function parsePalette(paletteName, customPalette, colorCount, pixels) {
  if (paletteName === "custom") {
    const parsed = parsePaletteInput(customPalette);
    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (paletteName !== "original") {
    const preset = PALETTE_PRESETS[paletteName] || PALETTE_PRESETS.original;
    if (preset.length > 0) {
      return preset
        .slice(0, Math.max(1, Math.min(colorCount, preset.length)))
        .map(hexToRgb);
    }
  }

  return createAdaptivePalette(pixels, colorCount);
}

function createOutlineMap(pixels, width, height) {
  const edges = new Array(pixels.length).fill(false);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const current = pixels[index];
      const neighbors = [
        x > 0 ? pixels[index - 1] : null,
        x < width - 1 ? pixels[index + 1] : null,
        y > 0 ? pixels[index - width] : null,
        y < height - 1 ? pixels[index + width] : null,
      ].filter(Boolean);

      edges[index] = neighbors.some(
        (neighbor) =>
          Math.sqrt(
            (current.r - neighbor.r) ** 2 +
              (current.g - neighbor.g) ** 2 +
              (current.b - neighbor.b) ** 2,
          ) > 30,
      );
    }
  }

  return edges;
}

function applyOutline(pixels, width, height, outline) {
  if (outline === "off") {
    return pixels;
  }

  const edges = createOutlineMap(pixels, width, height);
  const result = pixels.map((pixel) => ({ ...pixel }));

  const paintEdge = (index) => {
    if (index < 0 || index >= result.length) {
      return;
    }

    result[index] = { r: 0, g: 0, b: 0, a: 255 };
  };

  edges.forEach((isEdge, index) => {
    if (!isEdge) {
      if (outline === "only-edges") {
        result[index] = { r: 0, g: 0, b: 0, a: 0 };
      }
      return;
    }

    paintEdge(index);

    if (outline === "thick") {
      const x = index % width;
      const y = Math.floor(index / width);
      [-1, 0, 1].forEach((offsetY) => {
        [-1, 0, 1].forEach((offsetX) => {
          const nextX = x + offsetX;
          const nextY = y + offsetY;
          if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
            paintEdge(nextY * width + nextX);
          }
        });
      });
    }
  });

  return result;
}

function getPixelsFromImageData(imageData) {
  const pixels = [];
  for (let index = 0; index < imageData.data.length; index += 4) {
    pixels.push({
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3],
    });
  }
  return pixels;
}

function createPixelGridCanvas(pixelArt, background = "transparent") {
  const canvas = createCanvas(pixelArt.width, pixelArt.height);
  const ctx = canvas.getContext("2d");

  if (background !== "transparent") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  pixelArt.pixels.forEach((pixel, index) => {
    const x = index % pixelArt.width;
    const y = Math.floor(index / pixelArt.width);

    if (!pixel.a) {
      return;
    }

    ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`;
    ctx.fillRect(x, y, 1, 1);
  });

  return canvas;
}

export async function createPixelArt(source, settings = {}) {
  const {
    pixelSize = 16,
    colorCount = 16,
    palette = "original",
    customPalette = [],
    dithering = "none",
    sharpen = 0,
    blur = 0,
    contrast = 1,
    outline = "off",
  } = settings;

  const sourceCanvas = await sourceToCanvas(source);
  const processedCanvas = preprocessCanvas(sourceCanvas, {
    sharpen,
    blur,
    contrast,
  });
  const width = Math.max(1, Math.round(sourceCanvas.width / pixelSize));
  const height = Math.max(1, Math.round(sourceCanvas.height / pixelSize));
  const reducedCanvas = createCanvas(width, height);
  const reducedContext = reducedCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  reducedContext.imageSmoothingEnabled = true;
  reducedContext.imageSmoothingQuality = "high";
  reducedContext.drawImage(processedCanvas, 0, 0, width, height);

  const reducedData = reducedContext.getImageData(0, 0, width, height);
  const sourcePixels = getPixelsFromImageData(reducedData);
  const paletteColors = parsePalette(
    palette,
    customPalette,
    colorCount,
    sourcePixels,
  );
  let quantized = ditherPixels(
    sourcePixels,
    width,
    height,
    paletteColors,
    dithering,
  );
  quantized = applyOutline(quantized, width, height, outline);

  const paletteHex = [
    ...new Set(quantized.map((pixel) => rgbToHex(pixel.r, pixel.g, pixel.b))),
  ];

  return {
    width,
    height,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
    pixelSize,
    pixels: quantized,
    palette: paletteHex,
    paletteName: palette,
    background: settings.background || "transparent",
  };
}

export function renderPixelArtCanvas(pixelArt, options = {}) {
  const {
    scale = 8,
    background = "transparent",
    showGrid = false,
    smoothing = false,
  } = options;

  const sourceCanvas = createPixelGridCanvas(pixelArt, background);
  const canvas = createCanvas(pixelArt.width * scale, pixelArt.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = smoothing;
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

  if (showGrid && scale >= 4) {
    ctx.strokeStyle = "rgba(17, 24, 39, 0.18)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= pixelArt.width; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * scale + 0.5, 0);
      ctx.lineTo(x * scale + 0.5, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= pixelArt.height; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale + 0.5);
      ctx.lineTo(canvas.width, y * scale + 0.5);
      ctx.stroke();
    }
  }

  return canvas;
}

export function createPixelPreviewOriginalCanvas(sourceCanvas, previewCanvas) {
  return resizeCanvas(
    sourceCanvas,
    previewCanvas.width,
    previewCanvas.height,
    true,
  );
}

export {
  COLOR_COUNT_OPTIONS,
  OUTPUT_SCALE_OPTIONS,
  PALETTE_PRESETS,
  PIXEL_DITHERING_OPTIONS,
  PIXEL_OUTLINE_OPTIONS,
  PIXEL_PREVIEW_MAX_EDGE,
  PIXEL_SIZE_OPTIONS,
  drawCanvasSurface,
};
