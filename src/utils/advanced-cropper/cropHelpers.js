import { clampOffsets, getViewportImageMetrics } from "./cropMath.js";

function createStarPath(context, x, y, width, height) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const outer = Math.min(width, height) / 2;
  const inner = outer * 0.45;
  const spikes = 5;

  context.beginPath();

  for (let index = 0; index < spikes * 2; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = (Math.PI / spikes) * index - Math.PI / 2;
    const pointX = centerX + Math.cos(angle) * radius;
    const pointY = centerY + Math.sin(angle) * radius;

    if (index === 0) {
      context.moveTo(pointX, pointY);
    } else {
      context.lineTo(pointX, pointY);
    }
  }

  context.closePath();
}

function createHeartPath(context, x, y, width, height) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const scale = Math.min(width, height) / 34;

  context.beginPath();
  context.moveTo(centerX, centerY + 12 * scale);
  context.bezierCurveTo(
    centerX + 16 * scale,
    centerY - 6 * scale,
    centerX + 18 * scale,
    centerY - 20 * scale,
    centerX,
    centerY - 8 * scale,
  );
  context.bezierCurveTo(
    centerX - 18 * scale,
    centerY - 20 * scale,
    centerX - 16 * scale,
    centerY - 6 * scale,
    centerX,
    centerY + 12 * scale,
  );
  context.closePath();
}

function createPolygonPath(context, x, y, width, height, sides = 6) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radius = Math.min(width, height) / 2;

  context.beginPath();

  for (let index = 0; index < sides; index += 1) {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const pointX = centerX + Math.cos(angle) * radius;
    const pointY = centerY + Math.sin(angle) * radius;

    if (index === 0) {
      context.moveTo(pointX, pointY);
    } else {
      context.lineTo(pointX, pointY);
    }
  }

  context.closePath();
}

export function buildCropShapePath(context, shape, rect, options = {}) {
  if (shape === "circle") {
    context.beginPath();
    context.ellipse(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      rect.width / 2,
      rect.height / 2,
      0,
      0,
      Math.PI * 2,
    );
    return;
  }

  if (shape === "triangle") {
    context.beginPath();
    context.moveTo(rect.x + rect.width / 2, rect.y);
    context.lineTo(rect.x + rect.width, rect.y + rect.height);
    context.lineTo(rect.x, rect.y + rect.height);
    context.closePath();
    return;
  }

  if (shape === "star") {
    createStarPath(context, rect.x, rect.y, rect.width, rect.height);
    return;
  }

  if (shape === "polygon") {
    createPolygonPath(
      context,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      options.polygonSides || 6,
    );
    return;
  }

  if (shape === "heart") {
    createHeartPath(context, rect.x, rect.y, rect.width, rect.height);
    return;
  }

  context.beginPath();
  context.rect(rect.x, rect.y, rect.width, rect.height);
}

export function drawTransformedImage(
  context,
  sourceCanvas,
  viewportRect,
  options,
) {
  const zoom = options.zoom || 1;
  const rotation = ((options.rotation || 0) * Math.PI) / 180;
  const flipX = options.flipX ? -1 : 1;
  const flipY = options.flipY ? -1 : 1;
  const metrics = getViewportImageMetrics(
    sourceCanvas.width,
    sourceCanvas.height,
    viewportRect,
    options,
  );
  const clamped = clampOffsets(
    options.offsetX || 0,
    options.offsetY || 0,
    metrics,
    viewportRect,
  );
  const drawWidth = metrics.drawWidth;
  const drawHeight = metrics.drawHeight;

  context.translate(
    viewportRect.x +
      viewportRect.width / 2 +
      clamped.offsetX * viewportRect.width,
    viewportRect.y +
      viewportRect.height / 2 +
      clamped.offsetY * viewportRect.height,
  );
  context.rotate(rotation);
  context.scale(flipX, flipY);
  context.drawImage(
    sourceCanvas,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );

  return {
    drawWidth,
    drawHeight,
    offsetX: clamped.offsetX,
    offsetY: clamped.offsetY,
    offsetLimits: clamped.offsetLimits,
  };
}

export function drawPreviewGuides(context, viewportRect, options) {
  context.save();
  context.lineWidth = 2;
  context.strokeStyle = "#5c7cfa";
  buildCropShapePath(
    context,
    options.shape || "rectangle",
    viewportRect,
    options,
  );
  context.stroke();

  if (options.showGrid) {
    context.strokeStyle = "rgba(255,255,255,0.42)";
    context.lineWidth = 1;
    for (let index = 1; index < 3; index += 1) {
      const x = viewportRect.x + (viewportRect.width / 3) * index;
      const y = viewportRect.y + (viewportRect.height / 3) * index;
      context.beginPath();
      context.moveTo(x, viewportRect.y);
      context.lineTo(x, viewportRect.y + viewportRect.height);
      context.stroke();
      context.beginPath();
      context.moveTo(viewportRect.x, y);
      context.lineTo(viewportRect.x + viewportRect.width, y);
      context.stroke();
    }
  }

  if (options.showSafeArea) {
    context.strokeStyle = "rgba(56, 189, 248, 0.7)";
    context.lineWidth = 1.5;
    context.strokeRect(
      viewportRect.x + viewportRect.width * 0.1,
      viewportRect.y + viewportRect.height * 0.1,
      viewportRect.width * 0.8,
      viewportRect.height * 0.8,
    );
  }

  context.restore();
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) return;

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}
