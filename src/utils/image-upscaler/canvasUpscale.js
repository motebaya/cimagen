import { createCanvas } from "../canvasUtils.js";
import {
  clamp,
  progressiveUpscale,
  resizeCanvas,
} from "./imageUpscalerHelpers.js";

function boxBlurImageData(imageData, radius) {
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

          for (let channel = 0; channel < 4; channel += 1) {
            sums[channel] += data[sampleIndex + channel];
          }
          total += 1;
        }
      }

      const targetIndex = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        result[targetIndex + channel] = sums[channel] / total;
      }
    }
  }

  return new ImageData(result, width, height);
}

function processCanvasPixels(canvas, transform) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const next = transform(imageData);
  context.putImageData(next, 0, 0);
  return canvas;
}

export function applyNoiseReduction(canvas, amount = 0.08, radius = 1) {
  if (amount <= 0) {
    return canvas;
  }

  return processCanvasPixels(canvas, (imageData) => {
    const blurred = boxBlurImageData(imageData, radius);
    const nextData = new Uint8ClampedArray(imageData.data.length);

    for (let index = 0; index < imageData.data.length; index += 4) {
      for (let channel = 0; channel < 3; channel += 1) {
        nextData[index + channel] = clamp(
          imageData.data[index + channel] * (1 - amount) +
            blurred.data[index + channel] * amount,
          0,
          255,
        );
      }
      nextData[index + 3] = imageData.data[index + 3];
    }

    return new ImageData(nextData, imageData.width, imageData.height);
  });
}

export function applyAdaptiveEnhance(canvas, options = {}) {
  const detailAmount = options.detailAmount || 0;
  const sharpenAmount = options.sharpenAmount || 0;
  const preserveEdges = options.preserveEdges ?? true;
  const noiseReduction = options.noiseReduction || 0;
  const radius = options.radius || 1;

  if (detailAmount <= 0 && sharpenAmount <= 0 && noiseReduction <= 0) {
    return canvas;
  }

  return processCanvasPixels(canvas, (imageData) => {
    const blurred = boxBlurImageData(imageData, radius);
    const nextData = new Uint8ClampedArray(imageData.data.length);

    for (let index = 0; index < imageData.data.length; index += 4) {
      const deltaRed = imageData.data[index] - blurred.data[index];
      const deltaGreen = imageData.data[index + 1] - blurred.data[index + 1];
      const deltaBlue = imageData.data[index + 2] - blurred.data[index + 2];
      const edgeStrength = clamp(
        (Math.abs(deltaRed) + Math.abs(deltaGreen) + Math.abs(deltaBlue)) / 180,
        0,
        1,
      );
      const sharpenMix = preserveEdges ? 0.35 + edgeStrength * 0.65 : 1;
      const denoiseMix =
        noiseReduction * (preserveEdges ? 1 - edgeStrength * 0.7 : 1);

      for (let channel = 0; channel < 3; channel += 1) {
        const original = imageData.data[index + channel];
        const blur = blurred.data[index + channel];
        const softened = original * (1 - denoiseMix) + blur * denoiseMix;
        const recovered =
          softened +
          (original - blur) *
            (sharpenAmount * sharpenMix + detailAmount * edgeStrength);
        nextData[index + channel] = clamp(recovered, 0, 255);
      }
      nextData[index + 3] = imageData.data[index + 3];
    }

    return new ImageData(nextData, imageData.width, imageData.height);
  });
}

export function applyColorFinish(canvas, amount = 0) {
  if (amount <= 0) {
    return canvas;
  }

  return processCanvasPixels(canvas, (imageData) => {
    const nextData = new Uint8ClampedArray(imageData.data.length);

    for (let index = 0; index < imageData.data.length; index += 4) {
      const luminance =
        imageData.data[index] * 0.299 +
        imageData.data[index + 1] * 0.587 +
        imageData.data[index + 2] * 0.114;

      for (let channel = 0; channel < 3; channel += 1) {
        nextData[index + channel] = clamp(
          luminance +
            (imageData.data[index + channel] - luminance) * (1 + amount),
          0,
          255,
        );
      }
      nextData[index + 3] = imageData.data[index + 3];
    }

    return new ImageData(nextData, imageData.width, imageData.height);
  });
}

export function directUpscale(sourceCanvas, scale, options = {}) {
  return resizeCanvas(
    sourceCanvas,
    sourceCanvas.width * scale,
    sourceCanvas.height * scale,
    {
      imageSmoothingEnabled: options.imageSmoothingEnabled ?? true,
      imageSmoothingQuality: options.imageSmoothingQuality || "high",
    },
  );
}

export function steppedUpscale(sourceCanvas, scale, options = {}) {
  return progressiveUpscale(sourceCanvas, scale, {
    maxStep: options.maxStep || 2,
    imageSmoothingEnabled: options.imageSmoothingEnabled ?? true,
    imageSmoothingQuality: options.imageSmoothingQuality || "high",
  });
}

export function createPixelGuideCanvas(sourceCanvas, scale) {
  const canvas = createCanvas(
    sourceCanvas.width * scale,
    sourceCanvas.height * scale,
  );
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}
