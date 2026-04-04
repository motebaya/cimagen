import {
  createCanvas,
  getAspectFitScale,
  sourceToCanvas,
} from "../canvasUtils.js";
import { drawImageWatermark } from "./imageWatermark.js";
import { drawTemplateWatermark } from "./templateWatermark.js";
import { drawTextWatermark } from "./textWatermark.js";
import { drawTiledWatermark } from "./tileWatermark.js";

async function drawLayerToContext(context, layer, width, height) {
  if (!layer || layer.hidden) return null;

  if (layer.templateCategory) {
    return drawTemplateWatermark(context, layer, width, height);
  }

  if (layer.type === "text") {
    if (layer.tiled) {
      drawTiledWatermark(context, layer, width, height);
      return null;
    }
    return drawTextWatermark(context, layer, width, height);
  }

  if (layer.type === "image") {
    return drawImageWatermark(context, layer, width, height);
  }

  return null;
}

export async function renderWatermarkLayers(source, layers, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const baseCanvas = options.previewMaxDimension
    ? fitCanvas(sourceCanvas, options.previewMaxDimension)
    : sourceCanvas;
  const baseLayer = createCanvas(baseCanvas.width, baseCanvas.height);
  const watermarkLayer = createCanvas(baseCanvas.width, baseCanvas.height);
  const overlayLayer = createCanvas(baseCanvas.width, baseCanvas.height);
  const baseContext = baseLayer.getContext("2d");
  baseContext.drawImage(baseCanvas, 0, 0);
  const watermarkContext = watermarkLayer.getContext("2d");
  const bounds = [];
  const selectedLayer = options.selectedLayerId
    ? layers.find((layer) => layer.id === options.selectedLayerId) || null
    : null;
  const hideSelectedLayer = Boolean(
    options.hideSelectedLayer && options.selectedLayerId,
  );

  for (const layer of layers) {
    if (!layer || layer.hidden) continue;
    if (hideSelectedLayer && layer.id === options.selectedLayerId) {
      const hiddenBound = await drawLayerToContext(
        createCanvas(watermarkLayer.width, watermarkLayer.height).getContext(
          "2d",
        ),
        layer,
        watermarkLayer.width,
        watermarkLayer.height,
      );
      if (hiddenBound) bounds.push({ id: layer.id, ...hiddenBound });
      continue;
    }

    const bound = await drawLayerToContext(
      watermarkContext,
      layer,
      watermarkLayer.width,
      watermarkLayer.height,
    );
    if (bound) bounds.push({ id: layer.id, ...bound });
  }

  const composite = createCanvas(baseLayer.width, baseLayer.height);
  const compositeContext = composite.getContext("2d");
  compositeContext.drawImage(baseLayer, 0, 0);
  compositeContext.drawImage(watermarkLayer, 0, 0);
  const selectedBound = options.selectedLayerId
    ? bounds.find((bound) => bound.id === options.selectedLayerId) || null
    : null;
  let selectedLayerCanvas = null;

  if (selectedLayer && selectedBound && hideSelectedLayer) {
    selectedLayerCanvas = createCanvas(baseLayer.width, baseLayer.height);
    const selectedContext = selectedLayerCanvas.getContext("2d");
    await drawLayerToContext(
      selectedContext,
      selectedLayer,
      selectedLayerCanvas.width,
      selectedLayerCanvas.height,
    );
  }
  drawOverlay(
    overlayLayer.getContext("2d"),
    composite.width,
    composite.height,
    {
      ...options,
      computedSelectedBound: selectedBound,
    },
  );

  return {
    baseLayer,
    watermarkLayer,
    overlayLayer,
    composite,
    bounds,
    selectedBound,
    selectedLayerCanvas,
    scale: baseLayer.width / sourceCanvas.width,
  };
}

function fitCanvas(sourceCanvas, maxDimension) {
  if (Math.max(sourceCanvas.width, sourceCanvas.height) <= maxDimension) {
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
  canvas
    .getContext("2d")
    .drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function drawOverlay(context, width, height, options) {
  context.clearRect(0, 0, width, height);
  if (options.showGrid) {
    context.strokeStyle = "rgba(148, 163, 184, 0.22)";
    context.lineWidth = 1;
    const step = 32;
    for (let x = step; x < width; x += step) {
      context.beginPath();
      context.moveTo(x + 0.5, 0);
      context.lineTo(x + 0.5, height);
      context.stroke();
    }
    for (let y = step; y < height; y += step) {
      context.beginPath();
      context.moveTo(0, y + 0.5);
      context.lineTo(width, y + 0.5);
      context.stroke();
    }
  }

  if (options.guides?.vertical != null) {
    context.strokeStyle = "rgba(92, 124, 250, 0.8)";
    context.beginPath();
    context.moveTo(options.guides.vertical, 0);
    context.lineTo(options.guides.vertical, height);
    context.stroke();
  }
  if (options.guides?.horizontal != null) {
    context.strokeStyle = "rgba(92, 124, 250, 0.8)";
    context.beginPath();
    context.moveTo(0, options.guides.horizontal);
    context.lineTo(width, options.guides.horizontal);
    context.stroke();
  }
  const selectedBound = options.selectedBound || options.computedSelectedBound;
  if (selectedBound) {
    context.strokeStyle = "#5c7cfa";
    context.lineWidth = 2;
    context.strokeRect(
      selectedBound.x,
      selectedBound.y,
      selectedBound.width,
      selectedBound.height,
    );
    context.fillStyle = "#5c7cfa";
    const resizeX = selectedBound.x + selectedBound.width;
    const resizeY = selectedBound.y + selectedBound.height;
    context.fillRect(resizeX - 5, resizeY - 5, 10, 10);
    context.beginPath();
    context.arc(
      selectedBound.x + selectedBound.width,
      selectedBound.y - 14,
      7,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

export async function exportWatermarkedCanvas(source, layers, options = {}) {
  const rendered = await renderWatermarkLayers(source, layers, options);
  return rendered.composite;
}
