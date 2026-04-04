import { createCanvas } from "../canvasUtils.js";

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const normalized = Math.min(
    1,
    Math.max(0, (value - edge0) / (edge1 - edge0)),
  );
  return normalized * normalized * (3 - 2 * normalized);
}

export function extractMaskFromSegmentationResult(result, options = {}) {
  const threshold = (options.threshold ?? 52) / 100;
  const softness = Math.max(0.04, (options.softness ?? 12) / 255);
  const confidenceMasks = result.confidenceMasks || [];

  if (
    confidenceMasks.length > 0 &&
    typeof confidenceMasks[0].getAsFloat32Array === "function"
  ) {
    const backgroundMask = confidenceMasks[0];
    const backgroundConfidence = backgroundMask.getAsFloat32Array();
    const mask = new Uint8ClampedArray(backgroundConfidence.length);
    const low = Math.max(0, threshold - softness);
    const high = Math.min(1, threshold + softness);

    for (let index = 0; index < backgroundConfidence.length; index += 1) {
      const foregroundConfidence = 1 - backgroundConfidence[index];
      mask[index] = Math.round(
        smoothstep(low, high, foregroundConfidence) * 255,
      );
    }

    confidenceMasks.forEach((maskEntry) => maskEntry.close?.());
    return { mask, width: backgroundMask.width, height: backgroundMask.height };
  }

  const categoryMask = result.categoryMask;
  if (!categoryMask) {
    throw new Error("Segmenter did not return a usable mask.");
  }

  const raw = categoryMask.getAsUint8Array();
  const mask = new Uint8ClampedArray(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    mask[index] = raw[index] === 0 ? 0 : 255;
  }

  categoryMask.close?.();
  return { mask, width: categoryMask.width, height: categoryMask.height };
}

export function createMaskCanvas(mask, width, height) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const imageData = context.createImageData(width, height);

  for (let index = 0; index < mask.length; index += 1) {
    imageData.data[index * 4] = 255;
    imageData.data[index * 4 + 1] = 255;
    imageData.data[index * 4 + 2] = 255;
    imageData.data[index * 4 + 3] = mask[index];
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

export function blurMaskCanvas(maskCanvas, feather) {
  if (feather <= 0) {
    return maskCanvas;
  }

  const output = createCanvas(maskCanvas.width, maskCanvas.height);
  const context = output.getContext("2d");
  context.filter = `blur(${feather}px)`;
  context.drawImage(maskCanvas, 0, 0);
  context.filter = "none";
  return output;
}

export function resizeMask(mask, width, height, targetWidth, targetHeight) {
  if (width === targetWidth && height === targetHeight) {
    return mask;
  }

  const sourceCanvas = createMaskCanvas(mask, width, height);
  const outputCanvas = createCanvas(targetWidth, targetHeight);
  const context = outputCanvas.getContext("2d");
  context.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  const imageData = context.getImageData(0, 0, targetWidth, targetHeight).data;
  const output = new Uint8ClampedArray(targetWidth * targetHeight);

  for (let index = 0; index < output.length; index += 1) {
    output[index] = imageData[index * 4 + 3];
  }

  return output;
}

export function combineMasks(
  maskEntries,
  targetWidth,
  targetHeight,
  weights = [],
) {
  const totals = new Float32Array(targetWidth * targetHeight);
  const normalizedWeights = maskEntries.map((_, index) => weights[index] ?? 1);
  const totalWeight =
    normalizedWeights.reduce((sum, weight) => sum + weight, 0) || 1;

  maskEntries.forEach((entry, index) => {
    const resized = resizeMask(
      entry.mask,
      entry.width,
      entry.height,
      targetWidth,
      targetHeight,
    );
    const weight = normalizedWeights[index];

    for (let pixelIndex = 0; pixelIndex < resized.length; pixelIndex += 1) {
      totals[pixelIndex] += resized[pixelIndex] * weight;
    }
  });

  const combined = new Uint8ClampedArray(targetWidth * targetHeight);
  for (let index = 0; index < combined.length; index += 1) {
    combined[index] = Math.round(totals[index] / totalWeight);
  }

  return { mask: combined, width: targetWidth, height: targetHeight };
}
