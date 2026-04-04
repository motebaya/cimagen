import { sourceToCanvas } from "../canvasUtils.js";
import { composeBackgroundRemoval } from "./canvasCompositor.js";
import {
  blurMaskCanvas,
  combineMasks,
  createMaskCanvas,
  resizeMask,
} from "./imageMaskUtils.js";
import { fitCanvasToMaxDimension } from "./backgroundRemovalHelpers.js";
import {
  getBackgroundRemovalModelById,
  getDefaultBackgroundRemovalModel,
} from "./modelRegistry.js";
import { loadBackgroundRemovalModel } from "./modelLoader.js";
import { runBackgroundRemovalWorker } from "./workerClient.js";

async function refineMaskWithWorker(
  segmentationCanvas,
  baseMaskResult,
  settings,
  aggressiveness,
) {
  const context = segmentationCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  const imageData = context.getImageData(
    0,
    0,
    segmentationCanvas.width,
    segmentationCanvas.height,
  );
  const result = await runBackgroundRemovalWorker("refine-mask", {
    imageData: Array.from(imageData.data),
    width: segmentationCanvas.width,
    height: segmentationCanvas.height,
    baseMask: Array.from(baseMaskResult.mask),
    threshold: settings.threshold,
    edgeTolerance: settings.edgeTolerance,
    feather: settings.feather,
    aggressiveness,
  });

  return {
    mask: Uint8ClampedArray.from(result.mask),
    width: result.width,
    height: result.height,
  };
}

async function runSinglePass(runtime, sourceCanvas, maxDimension, settings) {
  const segmentationCanvas = fitCanvasToMaxDimension(
    sourceCanvas,
    maxDimension,
  );
  const baseMask = await runtime.predictMask(segmentationCanvas, {
    threshold: settings.threshold,
    edgeTolerance: settings.edgeTolerance,
    feather: settings.feather,
    softness: settings.feather,
  });

  return {
    segmentationCanvas,
    baseMask,
  };
}

async function buildSegmentationMask(
  runtime,
  sourceCanvas,
  settings,
  model,
  segmentationDimension,
) {
  if (model.pipeline === "worker-only") {
    const segmentationCanvas = fitCanvasToMaxDimension(
      sourceCanvas,
      segmentationDimension || model.segmentationMaxDimension,
    );
    const mask = await runtime.predictMask(segmentationCanvas, settings);
    return { segmentationCanvas, maskResult: mask };
  }

  if (model.pipeline === "deeplab-single") {
    const { segmentationCanvas, baseMask } = await runSinglePass(
      runtime,
      sourceCanvas,
      segmentationDimension || model.segmentationMaxDimension,
      settings,
    );
    return { segmentationCanvas, maskResult: baseMask };
  }

  if (model.pipeline === "deeplab-refine") {
    const { segmentationCanvas, baseMask } = await runSinglePass(
      runtime,
      sourceCanvas,
      segmentationDimension || model.segmentationMaxDimension,
      settings,
    );
    const refined = await refineMaskWithWorker(
      segmentationCanvas,
      baseMask,
      settings,
      0.55,
    );
    return { segmentationCanvas, maskResult: refined };
  }

  if (model.pipeline === "deeplab-hq") {
    const lowPass = await runSinglePass(runtime, sourceCanvas, 512, settings);
    const highPass = await runSinglePass(
      runtime,
      sourceCanvas,
      segmentationDimension || model.segmentationMaxDimension,
      settings,
    );
    const combined = combineMasks(
      [lowPass.baseMask, highPass.baseMask],
      highPass.baseMask.width,
      highPass.baseMask.height,
      [0.35, 0.65],
    );
    const refined = await refineMaskWithWorker(
      highPass.segmentationCanvas,
      combined,
      settings,
      0.8,
    );
    return {
      segmentationCanvas: highPass.segmentationCanvas,
      maskResult: refined,
    };
  }

  throw new Error(`Unsupported background removal pipeline: ${model.pipeline}`);
}

function resolveModel(modelId) {
  return (
    getBackgroundRemovalModelById(modelId) || getDefaultBackgroundRemovalModel()
  );
}

async function resolveRuntime(model) {
  try {
    return {
      runtime: await loadBackgroundRemovalModel(model.id),
      resolvedModel: model,
      fallbackNote: null,
    };
  } catch (error) {
    if (model.id === "quickmatte-worker") {
      throw error;
    }

    const fallbackModel = getDefaultBackgroundRemovalModel();
    return {
      runtime: await loadBackgroundRemovalModel(fallbackModel.id),
      resolvedModel: fallbackModel,
      fallbackNote: `Selected model could not start in this browser. Fell back to ${fallbackModel.label}.`,
    };
  }
}

export async function removeBackground(source, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const selectedModel = resolveModel(options.modelId);
  const { runtime, resolvedModel, fallbackNote } =
    await resolveRuntime(selectedModel);
  const outputSourceCanvas = options.outputMaxDimension
    ? fitCanvasToMaxDimension(sourceCanvas, options.outputMaxDimension)
    : sourceCanvas;
  const originalCanvas = fitCanvasToMaxDimension(
    sourceCanvas,
    options.previewMaxDimension ||
      options.outputMaxDimension ||
      sourceCanvas.width,
  );

  const { maskResult } = await buildSegmentationMask(
    runtime,
    sourceCanvas,
    options,
    resolvedModel,
    options.segmentationMaxDimension || resolvedModel.segmentationMaxDimension,
  );

  const resizedMask = resizeMask(
    maskResult.mask,
    maskResult.width,
    maskResult.height,
    outputSourceCanvas.width,
    outputSourceCanvas.height,
  );
  const maskCanvas = createMaskCanvas(
    resizedMask,
    outputSourceCanvas.width,
    outputSourceCanvas.height,
  );
  const featheredMask = blurMaskCanvas(maskCanvas, (options.feather || 12) / 4);
  const outputCanvas = composeBackgroundRemoval(
    outputSourceCanvas,
    featheredMask,
    options,
    options.backgroundImage || null,
  );

  return {
    canvas: outputCanvas,
    originalCanvas,
    width: outputCanvas.width,
    height: outputCanvas.height,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
    model: resolvedModel.label,
    modelId: resolvedModel.id,
    tier: resolvedModel.tier,
    backend: runtime.backend,
    runtime: runtime.runtime,
    note: fallbackNote || runtime.note,
    warning: resolvedModel.warning || null,
  };
}
