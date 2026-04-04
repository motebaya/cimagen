import { loadImageElement } from "../canvasUtils.js";
import { getRotatedBound } from "./previewScaling.js";

const IMAGE_CACHE = new Map();

async function loadLayerImage(src) {
  if (!src) return null;
  if (IMAGE_CACHE.has(src)) {
    return IMAGE_CACHE.get(src);
  }

  const image = await loadImageElement(src);
  IMAGE_CACHE.set(src, image);
  return image;
}

export async function drawImageLayer(
  context,
  layer,
  canvasWidth,
  canvasHeight,
) {
  const image = await loadLayerImage(layer.imageSrc);
  if (!image) {
    return null;
  }

  const centerX = (layer.x ?? 0.5) * canvasWidth;
  const centerY = (layer.y ?? 0.5) * canvasHeight;
  const width = canvasWidth * (layer.baseWidth || 0.28) * (layer.scale || 1);
  const height =
    width *
    ((image.naturalHeight || image.height) /
      (image.naturalWidth || image.width));

  context.save();
  context.globalAlpha = layer.opacity ?? 1;
  context.translate(centerX, centerY);
  context.rotate(((layer.rotation || 0) * Math.PI) / 180);
  context.shadowColor = layer.shadowColor || "transparent";
  context.shadowBlur = layer.shadowBlur || 0;
  context.shadowOffsetX = layer.shadowOffsetX || 0;
  context.shadowOffsetY = layer.shadowOffsetY || 0;
  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.restore();

  return getRotatedBound(centerX, centerY, width, height, layer.rotation || 0);
}
