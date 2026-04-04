import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import { drawImageLayer } from "./imageRenderer.js";
import {
  fitCanvas,
  fitCanvasToBounds,
  scaleBound,
  scaleCanvas,
} from "./previewScaling.js";
import { drawTextLayer } from "./textRenderer.js";

function getPreviewBounds(options = {}) {
  if (options.maxPreviewWidth || options.maxPreviewHeight) {
    return {
      maxWidth: options.maxPreviewWidth,
      maxHeight: options.maxPreviewHeight,
    };
  }

  if (options.maxPreviewDimension) {
    return {
      maxWidth: options.maxPreviewDimension,
      maxHeight: options.maxPreviewDimension,
    };
  }

  return null;
}

async function drawLayerToContext(context, layer, canvasWidth, canvasHeight) {
  if (!layer || layer.hidden) {
    return null;
  }

  if (layer.type === "image") {
    return drawImageLayer(context, layer, canvasWidth, canvasHeight);
  }

  return drawTextLayer(context, layer, canvasWidth, canvasHeight);
}

async function renderMemeScene(templateSrc, layers, options = {}) {
  const templateCanvas = await sourceToCanvas(templateSrc);
  const baseLayer = createCanvas(templateCanvas.width, templateCanvas.height);
  const memeLayer = createCanvas(templateCanvas.width, templateCanvas.height);
  const composite = createCanvas(templateCanvas.width, templateCanvas.height);
  const bounds = [];
  const baseContext = baseLayer.getContext("2d");
  const memeContext = memeLayer.getContext("2d");
  const compositeContext = composite.getContext("2d");
  const selectedLayer = options.selectedLayerId
    ? layers.find((layer) => layer.id === options.selectedLayerId) || null
    : null;
  const hideSelectedLayer = Boolean(options.hideSelectedLayer && selectedLayer);

  baseContext.drawImage(templateCanvas, 0, 0);

  for (const layer of layers) {
    if (!layer || layer.hidden) {
      continue;
    }

    if (hideSelectedLayer && layer.id === options.selectedLayerId) {
      const hiddenBound = await drawLayerToContext(
        createCanvas(memeLayer.width, memeLayer.height).getContext("2d"),
        layer,
        memeLayer.width,
        memeLayer.height,
      );

      if (hiddenBound) {
        bounds.push({ id: layer.id, ...hiddenBound });
      }

      continue;
    }

    const bound = await drawLayerToContext(
      memeContext,
      layer,
      memeLayer.width,
      memeLayer.height,
    );

    if (bound) {
      bounds.push({ id: layer.id, ...bound });
    }
  }

  compositeContext.drawImage(baseLayer, 0, 0);
  compositeContext.drawImage(memeLayer, 0, 0);

  const selectedBound = options.selectedLayerId
    ? bounds.find((bound) => bound.id === options.selectedLayerId) || null
    : null;
  let selectedLayerCanvas = null;

  if (selectedLayer && selectedBound && hideSelectedLayer) {
    selectedLayerCanvas = createCanvas(baseLayer.width, baseLayer.height);
    await drawLayerToContext(
      selectedLayerCanvas.getContext("2d"),
      selectedLayer,
      selectedLayerCanvas.width,
      selectedLayerCanvas.height,
    );
  }

  return {
    baseLayer,
    composite,
    bounds,
    selectedBound,
    selectedLayerCanvas,
  };
}

export async function renderMeme(templateSrc, layers, options = {}) {
  const scene = await renderMemeScene(templateSrc, layers, {
    selectedLayerId: options.selectedLayerId,
    hideSelectedLayer: options.hideSelectedLayer,
  });
  const previewBounds = getPreviewBounds(options);

  if (!previewBounds) {
    return {
      canvas: scene.composite,
      exportCanvas: scene.composite,
      baseLayer: scene.baseLayer,
      bounds: scene.bounds,
      selectedBound: scene.selectedBound,
      selectedLayerCanvas: scene.selectedLayerCanvas,
      scale: 1,
    };
  }

  const previewCanvas =
    options.maxPreviewDimension &&
    previewBounds.maxWidth === options.maxPreviewDimension &&
    previewBounds.maxHeight === options.maxPreviewDimension
      ? fitCanvas(scene.composite, options.maxPreviewDimension)
      : fitCanvasToBounds(scene.composite, previewBounds);
  const previewBaseLayer =
    options.maxPreviewDimension &&
    previewBounds.maxWidth === options.maxPreviewDimension &&
    previewBounds.maxHeight === options.maxPreviewDimension
      ? fitCanvas(scene.baseLayer, options.maxPreviewDimension)
      : fitCanvasToBounds(scene.baseLayer, previewBounds);

  if (previewCanvas === scene.composite) {
    return {
      canvas: scene.composite,
      exportCanvas: scene.composite,
      baseLayer: scene.baseLayer,
      bounds: scene.bounds,
      selectedBound: scene.selectedBound,
      selectedLayerCanvas: scene.selectedLayerCanvas,
      scale: 1,
    };
  }

  const scale = previewCanvas.width / scene.composite.width;

  return {
    canvas: previewCanvas,
    exportCanvas: scene.composite,
    baseLayer: previewBaseLayer,
    bounds: scene.bounds.map((bound) => scaleBound(bound, scale)),
    selectedBound: scene.selectedBound
      ? scaleBound(scene.selectedBound, scale)
      : null,
    selectedLayerCanvas: scene.selectedLayerCanvas
      ? scaleCanvas(scene.selectedLayerCanvas, scale)
      : null,
    scale,
  };
}
