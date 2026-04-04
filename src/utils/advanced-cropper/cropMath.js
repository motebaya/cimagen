import {
  OFFSET_SYNC_EPSILON,
  PINCH_ZOOM_DIVISOR,
  PINCH_ZOOM_MAX_DELTA,
  PREVIEW_MAX_HEIGHT,
  PREVIEW_MAX_WIDTH,
  ZOOM_MAX,
  ZOOM_MIN,
} from "./cropConstants.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function clampZoom(value) {
  return clamp(value, ZOOM_MIN, ZOOM_MAX);
}

export function isNearlyEqual(a, b, epsilon = OFFSET_SYNC_EPSILON) {
  return Math.abs(a - b) <= epsilon;
}

export function getOutputAspectRatio(ratio) {
  return ratio || 1;
}

export function getPreviewDimensions(aspectRatio, bounds = {}) {
  const maxWidth = Math.max(320, Math.floor(bounds.width || PREVIEW_MAX_WIDTH));
  const maxHeight = Math.max(
    260,
    Math.floor(bounds.height || PREVIEW_MAX_HEIGHT),
  );
  const safeRatio = getOutputAspectRatio(aspectRatio);

  let width = maxWidth;
  let height = width / safeRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * safeRatio;
  }

  return {
    width: Math.max(120, Math.round(width)),
    height: Math.max(120, Math.round(height)),
  };
}

export function normalizeOffsetDelta(deltaX, deltaY, rect) {
  if (!rect?.width || !rect?.height) {
    return { offsetX: 0, offsetY: 0 };
  }

  return {
    offsetX: deltaX / rect.width,
    offsetY: deltaY / rect.height,
  };
}

export function getRotatedBounds(width, height, rotation = 0) {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    width: Math.abs(width * cos) + Math.abs(height * sin),
    height: Math.abs(width * sin) + Math.abs(height * cos),
  };
}

export function getViewportImageMetrics(
  sourceWidth,
  sourceHeight,
  viewportRect,
  options = {},
) {
  const scaleMode = options.shape === "full" ? Math.min : Math.max;
  const aspectScale = scaleMode(
    viewportRect.width / sourceWidth,
    viewportRect.height / sourceHeight,
  );
  const drawWidth = sourceWidth * aspectScale * (options.zoom || 1);
  const drawHeight = sourceHeight * aspectScale * (options.zoom || 1);
  const rotated = getRotatedBounds(
    drawWidth,
    drawHeight,
    options.rotation || 0,
  );

  return {
    drawWidth,
    drawHeight,
    boundWidth: rotated.width,
    boundHeight: rotated.height,
  };
}

export function getOffsetLimits(metrics, viewportRect) {
  return {
    offsetX: Math.max(
      0,
      (metrics.boundWidth - viewportRect.width) / (2 * viewportRect.width),
    ),
    offsetY: Math.max(
      0,
      (metrics.boundHeight - viewportRect.height) / (2 * viewportRect.height),
    ),
  };
}

export function clampOffsets(offsetX, offsetY, metrics, viewportRect) {
  const limits = getOffsetLimits(metrics, viewportRect);

  return {
    offsetX: clamp(offsetX, -limits.offsetX, limits.offsetX),
    offsetY: clamp(offsetY, -limits.offsetY, limits.offsetY),
    offsetLimits: limits,
  };
}

export function getTouchDistance(touches) {
  if (!touches || touches.length < 2) {
    return 0;
  }

  const deltaX = touches[0].clientX - touches[1].clientX;
  const deltaY = touches[0].clientY - touches[1].clientY;
  return Math.hypot(deltaX, deltaY);
}

export function getPinchZoomDelta(distanceDelta) {
  return clamp(
    distanceDelta / PINCH_ZOOM_DIVISOR,
    -PINCH_ZOOM_MAX_DELTA,
    PINCH_ZOOM_MAX_DELTA,
  );
}
