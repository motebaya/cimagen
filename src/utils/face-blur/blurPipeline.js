import { sourceToCanvas } from "../canvasUtils.js";
import { fitCanvasToMaxDimension } from "./faceBlurHelpers.js";
import { PREVIEW_MAX_DIMENSION } from "./faceBlurConstants.js";
import { applyFaceBlurToCanvas } from "./faceBlurCanvas.js";

export async function renderFaceBlur(source, faces, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const workingCanvas = options.previewMaxDimension
    ? fitCanvasToMaxDimension(sourceCanvas, options.previewMaxDimension)
    : sourceCanvas;

  return applyFaceBlurToCanvas(workingCanvas, faces, options);
}

export function renderFaceBlurPreview(previewCanvas, faces, settings) {
  if (!previewCanvas) {
    return null;
  }

  return applyFaceBlurToCanvas(previewCanvas, faces, settings);
}

export { applyFaceBlurToCanvas } from "./faceBlurCanvas.js";
