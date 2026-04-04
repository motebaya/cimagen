import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import {
  buildCropShapePath,
  drawPreviewGuides,
  drawTransformedImage,
} from "./cropHelpers.js";
import { getOutputAspectRatio, getPreviewDimensions } from "./cropMath.js";

function shouldFillBackground(options, isPreview) {
  if (options.shape === "rectangle") {
    return true;
  }

  if (!options.transparentBackground) {
    return true;
  }

  return isPreview;
}

function getBackgroundColor(options, isPreview) {
  if (!options.transparentBackground) {
    return options.backgroundColor || "#ffffff";
  }

  return isPreview ? options.previewBackgroundColor || "#f8fafc" : null;
}

async function renderCropCanvas(source, options = {}, renderOptions = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const aspectRatio = getOutputAspectRatio(options.aspectRatio);
  const canvas = createCanvas(renderOptions.width, renderOptions.height);
  const context = canvas.getContext("2d");
  const viewportRect = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };
  const isPreview = Boolean(renderOptions.isPreview);
  const backgroundColor = getBackgroundColor(options, isPreview);

  if (shouldFillBackground(options, isPreview) && backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.save();
  buildCropShapePath(
    context,
    options.shape || "rectangle",
    viewportRect,
    options,
  );
  context.clip();
  const transform = drawTransformedImage(
    context,
    sourceCanvas,
    viewportRect,
    options,
  );
  context.restore();

  if (isPreview) {
    drawPreviewGuides(context, viewportRect, options);
  }

  return {
    canvas,
    aspectRatio,
    viewportRect,
    appliedOffsets: {
      offsetX: transform.offsetX,
      offsetY: transform.offsetY,
    },
    offsetLimits: transform.offsetLimits,
  };
}

export async function renderCropPreview(source, options = {}) {
  const previewSize = getPreviewDimensions(options.aspectRatio, {
    width: options.previewWidth,
    height: options.previewHeight,
  });

  return renderCropCanvas(source, options, {
    width: previewSize.width,
    height: previewSize.height,
    isPreview: true,
  });
}

export async function exportCroppedImage(source, options = {}) {
  const aspectRatio = getOutputAspectRatio(options.aspectRatio);
  const outputWidth = Math.max(
    64,
    Math.round((options.outputWidth || 1200) * (options.scaleMultiplier || 1)),
  );
  const outputHeight = Math.max(64, Math.round(outputWidth / aspectRatio));
  const result = await renderCropCanvas(source, options, {
    width: outputWidth,
    height: outputHeight,
    isPreview: false,
  });

  return result.canvas;
}
