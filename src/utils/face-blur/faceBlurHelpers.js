import { createCanvas, getAspectFitScale } from "../canvasUtils.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) return;

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export function fitCanvasToMaxDimension(sourceCanvas, maxDimension) {
  if (
    !maxDimension ||
    Math.max(sourceCanvas.width, sourceCanvas.height) <= maxDimension
  ) {
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
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function scaleCanvas(sourceCanvas, scale) {
  const canvas = createCanvas(
    Math.max(1, Math.round(sourceCanvas.width * scale)),
    Math.max(1, Math.round(sourceCanvas.height * scale)),
  );
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result || null);
    reader.onerror = () =>
      reject(new Error("Failed to read the file. Please try again."));
    reader.readAsDataURL(file);
  });
}

function getArea(face) {
  return face.width * face.height;
}

export function computeIntersectionOverUnion(left, right) {
  const x1 = Math.max(left.x, right.x);
  const y1 = Math.max(left.y, right.y);
  const x2 = Math.min(left.x + left.width, right.x + right.width);
  const y2 = Math.min(left.y + left.height, right.y + right.height);
  const intersectionWidth = Math.max(0, x2 - x1);
  const intersectionHeight = Math.max(0, y2 - y1);
  const intersectionArea = intersectionWidth * intersectionHeight;
  const unionArea = getArea(left) + getArea(right) - intersectionArea;

  return unionArea > 0 ? intersectionArea / unionArea : 0;
}

export function mergeFaceDetections(detections, overlapThreshold = 0.34) {
  const orderedDetections = [...detections].sort(
    (left, right) =>
      (right.score || 0) - (left.score || 0) ||
      right.width * right.height - left.width * left.height,
  );
  const merged = [];

  orderedDetections.forEach((detection) => {
    const existingIndex = merged.findIndex(
      (candidate) =>
        computeIntersectionOverUnion(candidate, detection) >= overlapThreshold,
    );

    if (existingIndex === -1) {
      merged.push({ ...detection });
      return;
    }

    const current = merged[existingIndex];
    const useIncoming = (detection.score || 0) >= (current.score || 0);
    merged[existingIndex] = {
      ...(useIncoming ? detection : current),
      score: Math.max(current.score || 0, detection.score || 0),
    };
  });

  return merged;
}

export function syncFaceActivity(previousFaces, nextFaces) {
  return nextFaces.map((face, index) => {
    const matched = previousFaces.find(
      (existingFace) =>
        computeIntersectionOverUnion(existingFace, face) >= 0.38,
    );

    return {
      ...face,
      id: matched?.id || `face-${index}`,
      active: matched?.active ?? true,
    };
  });
}
