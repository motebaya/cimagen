import { loadImageElement } from "../canvasUtils.js";

const IMAGE_CACHE = new Map();

export async function loadWatermarkImage(src) {
  if (!src) return null;
  if (IMAGE_CACHE.has(src)) return IMAGE_CACHE.get(src);
  const image = await loadImageElement(src);
  IMAGE_CACHE.set(src, image);
  return image;
}

export async function drawImageWatermark(
  context,
  layer,
  canvasWidth,
  canvasHeight,
) {
  const image = await loadWatermarkImage(layer.imageSrc);
  if (!image) return null;
  const centerX = layer.x * canvasWidth;
  const centerY = layer.y * canvasHeight;
  const maxBaseWidth = canvasWidth * (layer.baseWidth || 0.22);
  const width = maxBaseWidth * (layer.scale || 1);
  const height =
    width *
    ((image.naturalHeight || image.height) /
      (image.naturalWidth || image.width));
  context.save();
  context.globalAlpha = layer.opacity ?? 1;
  context.globalCompositeOperation = layer.blendMode || "source-over";
  context.translate(centerX, centerY);
  context.rotate(((layer.rotation || 0) * Math.PI) / 180);
  context.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
  context.shadowColor = layer.shadowColor || "transparent";
  context.shadowBlur = layer.shadowBlur || 0;
  context.shadowOffsetX = layer.shadowOffsetX || 0;
  context.shadowOffsetY = layer.shadowOffsetY || 0;
  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.restore();
  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  };
}
