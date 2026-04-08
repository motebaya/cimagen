import {
  BLUEARCHIVE_CANVAS_HEIGHT,
  BLUEARCHIVE_CANVAS_WIDTH,
  BLUEARCHIVE_FONT_DECLARATION,
  BLUEARCHIVE_FONT_SIZE,
  BLUEARCHIVE_HOLLOW_PATH,
  BLUEARCHIVE_HORIZONTAL_TILT,
  BLUEARCHIVE_PADDING_X,
  BLUEARCHIVE_TEXT_BASELINE,
} from "./constants.js";
import { loadBlueArchiveAssets } from "./loadBlueArchiveAssets.js";
import { ensureBlueArchiveFonts } from "./loadBlueArchiveFonts.js";

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function resetCanvasTransform(context) {
  if (typeof context.resetTransform === "function") {
    context.resetTransform();
    return;
  }

  context.setTransform(1, 0, 0, 1, 0, 0);
}

function getMetricsExtents(metrics) {
  return {
    ascent: metrics.fontBoundingBoxAscent ?? BLUEARCHIVE_FONT_SIZE * 0.82,
    descent: metrics.fontBoundingBoxDescent ?? BLUEARCHIVE_FONT_SIZE * 0.18,
  };
}

function getMeasuredLayout(context, leftText, rightText) {
  context.font = BLUEARCHIVE_FONT_DECLARATION;
  const leftMetrics = context.measureText(leftText);
  const rightMetrics = context.measureText(rightText);
  const leftExtents = getMetricsExtents(leftMetrics);
  const rightExtents = getMetricsExtents(rightMetrics);

  const textWidthL = Math.max(
    0,
    leftMetrics.width -
      (BLUEARCHIVE_TEXT_BASELINE * BLUEARCHIVE_CANVAS_HEIGHT + leftExtents.descent) *
        BLUEARCHIVE_HORIZONTAL_TILT,
  );
  const textWidthR = Math.max(
    0,
    rightMetrics.width +
      (BLUEARCHIVE_TEXT_BASELINE * BLUEARCHIVE_CANVAS_HEIGHT - rightExtents.ascent) *
        BLUEARCHIVE_HORIZONTAL_TILT,
  );

  const canvasWidthL =
    textWidthL + BLUEARCHIVE_PADDING_X > BLUEARCHIVE_CANVAS_WIDTH / 2
      ? textWidthL + BLUEARCHIVE_PADDING_X
      : BLUEARCHIVE_CANVAS_WIDTH / 2;
  const canvasWidthR =
    textWidthR + BLUEARCHIVE_PADDING_X > BLUEARCHIVE_CANVAS_WIDTH / 2
      ? textWidthR + BLUEARCHIVE_PADDING_X
      : BLUEARCHIVE_CANVAS_WIDTH / 2;

  return {
    canvasWidthL,
    canvasWidthR,
    textWidthL,
    textWidthR,
  };
}

function createOutputCanvas(internalCanvas, layout, { allowTightCrop }) {
  if (!allowTightCrop) {
    return internalCanvas;
  }

  if (
    layout.textWidthL + BLUEARCHIVE_PADDING_X < BLUEARCHIVE_CANVAS_WIDTH / 2 ||
    layout.textWidthR + BLUEARCHIVE_PADDING_X < BLUEARCHIVE_CANVAS_WIDTH / 2
  ) {
    const outputCanvas = createCanvas(
      Math.ceil(layout.textWidthL + layout.textWidthR + BLUEARCHIVE_PADDING_X * 2),
      internalCanvas.height,
    );
    const context = outputCanvas.getContext("2d");
    context.drawImage(
      internalCanvas,
      BLUEARCHIVE_CANVAS_WIDTH / 2 - layout.textWidthL - BLUEARCHIVE_PADDING_X,
      0,
      layout.textWidthL + layout.textWidthR + BLUEARCHIVE_PADDING_X * 2,
      internalCanvas.height,
      0,
      0,
      layout.textWidthL + layout.textWidthR + BLUEARCHIVE_PADDING_X * 2,
      internalCanvas.height,
    );
    return outputCanvas;
  }

  return internalCanvas;
}

export async function renderBlueArchiveLogo({
  leftText,
  rightText,
  haloOffset,
  crossOffset,
  transparentMode,
}) {
  const normalizedLeftText = leftText ?? "";
  const normalizedRightText = rightText ?? "";
  const content = `${normalizedLeftText}${normalizedRightText}` || "BlueArchive";
  await ensureBlueArchiveFonts(content);
  const assets = await loadBlueArchiveAssets();

  const internalCanvas = createCanvas(BLUEARCHIVE_CANVAS_WIDTH, BLUEARCHIVE_CANVAS_HEIGHT);
  const context = internalCanvas.getContext("2d");
  const layout = getMeasuredLayout(context, normalizedLeftText, normalizedRightText);

  internalCanvas.width = Math.ceil(layout.canvasWidthL + layout.canvasWidthR);
  internalCanvas.height = BLUEARCHIVE_CANVAS_HEIGHT;

  context.clearRect(0, 0, internalCanvas.width, internalCanvas.height);

  if (!transparentMode) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, internalCanvas.width, internalCanvas.height);
  }

  context.font = BLUEARCHIVE_FONT_DECLARATION;
  context.fillStyle = "#128AFA";
  context.textAlign = "end";
  context.setTransform(1, 0, BLUEARCHIVE_HORIZONTAL_TILT, 1, 0, 0);
  context.fillText(
    normalizedLeftText,
    layout.canvasWidthL,
    internalCanvas.height * BLUEARCHIVE_TEXT_BASELINE,
  );
  resetCanvasTransform(context);

  context.drawImage(
    assets.halo,
    layout.canvasWidthL - internalCanvas.height / 2 + haloOffset.x,
    haloOffset.y,
    BLUEARCHIVE_CANVAS_HEIGHT,
    BLUEARCHIVE_CANVAS_HEIGHT,
  );

  context.fillStyle = "#2B2B2B";
  context.textAlign = "start";
  if (transparentMode) {
    context.globalCompositeOperation = "destination-out";
  }
  context.strokeStyle = "#ffffff";
  context.lineWidth = 12;
  context.setTransform(1, 0, BLUEARCHIVE_HORIZONTAL_TILT, 1, 0, 0);
  context.strokeText(
    normalizedRightText,
    layout.canvasWidthL,
    internalCanvas.height * BLUEARCHIVE_TEXT_BASELINE,
  );
  context.globalCompositeOperation = "source-over";
  context.fillText(
    normalizedRightText,
    layout.canvasWidthL,
    internalCanvas.height * BLUEARCHIVE_TEXT_BASELINE,
  );
  resetCanvasTransform(context);

  const graph = {
    x: layout.canvasWidthL - internalCanvas.height / 2 + crossOffset.x,
    y: crossOffset.y,
  };

  context.beginPath();
  context.moveTo(
    graph.x + (BLUEARCHIVE_HOLLOW_PATH[0][0] / 500) * BLUEARCHIVE_CANVAS_HEIGHT,
    graph.y + (BLUEARCHIVE_HOLLOW_PATH[0][1] / 500) * BLUEARCHIVE_CANVAS_HEIGHT,
  );

  for (let index = 1; index < BLUEARCHIVE_HOLLOW_PATH.length; index += 1) {
    context.lineTo(
      graph.x + (BLUEARCHIVE_HOLLOW_PATH[index][0] / 500) * BLUEARCHIVE_CANVAS_HEIGHT,
      graph.y + (BLUEARCHIVE_HOLLOW_PATH[index][1] / 500) * BLUEARCHIVE_CANVAS_HEIGHT,
    );
  }

  context.closePath();
  if (transparentMode) {
    context.globalCompositeOperation = "destination-out";
  }
  context.fillStyle = "#ffffff";
  context.fill();
  context.globalCompositeOperation = "source-over";

  context.drawImage(
    assets.cross,
    layout.canvasWidthL - internalCanvas.height / 2 + crossOffset.x,
    crossOffset.y,
    BLUEARCHIVE_CANVAS_HEIGHT,
    BLUEARCHIVE_CANVAS_HEIGHT,
  );

  const exportCanvas = createOutputCanvas(internalCanvas, layout, {
    allowTightCrop: Boolean(normalizedLeftText.trim() && normalizedRightText.trim()),
  });

  return {
    exportCanvas,
    previewCanvas: internalCanvas,
  };
}
