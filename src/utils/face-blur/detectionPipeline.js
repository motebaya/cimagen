import { sourceToCanvas } from "../canvasUtils.js";
import { loadFaceBlurModel } from "./modelLoader.js";
import {
  fitCanvasToMaxDimension,
  syncFaceActivity,
} from "./faceBlurHelpers.js";
import { PREVIEW_MAX_DIMENSION } from "./faceBlurConstants.js";

export async function detectFaces(source, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const previewCanvas = fitCanvasToMaxDimension(
    sourceCanvas,
    options.previewMaxDimension || PREVIEW_MAX_DIMENSION,
  );
  const runtime = await loadFaceBlurModel(options.modelId);
  const detections = await runtime.detect(previewCanvas, {
    detectionSensitivity: options.detectionSensitivity,
    maxDetectedFaces: options.maxDetectedFaces,
  });

  return {
    backend: runtime.backend,
    model: runtime.label,
    note: runtime.note,
    warning: runtime.warning || null,
    previewCanvas,
    faces: detections.map((face, index) => ({
      ...face,
      id: face.id || `face-${index}`,
      active: true,
    })),
  };
}

export { syncFaceActivity } from "./faceBlurHelpers.js";
