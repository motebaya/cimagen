import { sourceToCanvas } from "../canvasUtils.js";
import { fitCanvasToMaxDimension } from "./imageUpscalerHelpers.js";
import { loadUpscalerModel } from "./modelLoader.js";

export async function upscaleImage(source, options = {}) {
  const startedAt = performance.now();
  const sourceCanvas = await sourceToCanvas(source);
  const scale = options.scale || 2;
  const inputCanvas = options.previewMaxDimension
    ? fitCanvasToMaxDimension(sourceCanvas, options.previewMaxDimension)
    : sourceCanvas;

  options.onStatus?.("Loading model");
  const model = await loadUpscalerModel(options.modelId);
  options.onStatus?.(`Using ${model.label}`);

  const canvas = await model.upscale(inputCanvas, options, options.onStatus);

  return {
    backend: canvas.__upscalerMeta?.backend || model.backend || "cpu",
    canvas,
    inputCanvas,
    model: model.label,
    modelId: model.id,
    remoteModelPath:
      canvas.__upscalerMeta?.remoteModelPath ||
      model.remoteModelPaths?.[scale] ||
      null,
    tier: model.tier,
    runtime: model.runtime,
    expectedOutputWidth: sourceCanvas.width * scale,
    expectedOutputHeight: sourceCanvas.height * scale,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
    outputWidth: canvas.width,
    outputHeight: canvas.height,
    processingTimeMs: performance.now() - startedAt,
  };
}
