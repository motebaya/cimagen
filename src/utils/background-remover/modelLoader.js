import { getMediaPipeModelPath, loadVisionTasks } from "../mediapipeVision.js";
import { extractMaskFromSegmentationResult } from "./imageMaskUtils.js";
import { getBackgroundRemovalModelById } from "./modelRegistry.js";
import { runBackgroundRemovalWorker } from "./workerClient.js";

const runtimeCache = new Map();
const segmenterCache = new Map();

async function createSegmenter(assetPath, delegate) {
  const { ImageSegmenter, vision } = await loadVisionTasks();
  return ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: getMediaPipeModelPath(assetPath),
      delegate,
    },
    runningMode: "IMAGE",
    outputCategoryMask: true,
    outputConfidenceMasks: true,
  });
}

async function getOrCreateSegmenter(assetPath, delegate) {
  const cacheKey = `${assetPath}:${delegate}`;
  if (!segmenterCache.has(cacheKey)) {
    segmenterCache.set(cacheKey, createSegmenter(assetPath, delegate));
  }

  return segmenterCache.get(cacheKey);
}

async function createWorkerRuntime(model) {
  return {
    ...model,
    backend: "worker",
    ready: true,
    note: model.note,
    async predictMask(inputCanvas, options = {}) {
      const context = inputCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      const imageData = context.getImageData(
        0,
        0,
        inputCanvas.width,
        inputCanvas.height,
      );
      const workerResult = await runBackgroundRemovalWorker(
        "segment-heuristic",
        {
          imageData: Array.from(imageData.data),
          width: inputCanvas.width,
          height: inputCanvas.height,
          threshold: options.threshold,
          edgeTolerance: options.edgeTolerance,
          feather: options.feather,
        },
      );

      return {
        mask: Uint8ClampedArray.from(workerResult.mask),
        width: workerResult.width,
        height: workerResult.height,
      };
    },
  };
}

async function createMediaPipeRuntime(model) {
  const delegateOrder = (model.preferredBackends || ["gpu", "cpu"]).map(
    (backend) => (backend === "gpu" ? "GPU" : "CPU"),
  );
  let lastError = null;

  for (const delegate of delegateOrder) {
    try {
      const segmenter = await getOrCreateSegmenter(
        model.localAssetPath,
        delegate,
      );
      return {
        ...model,
        backend: delegate.toLowerCase(),
        ready: true,
        note: `${model.note} Running with ${delegate.toLowerCase()} backend.`,
        async predictMask(inputCanvas, options = {}) {
          const result = segmenter.segment(inputCanvas);
          const extracted = extractMaskFromSegmentationResult(result, options);
          result.close?.();
          return extracted;
        },
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`Unable to initialize ${model.label}.`);
}

export async function loadBackgroundRemovalModel(modelId) {
  const model = getBackgroundRemovalModelById(modelId);
  if (!model) {
    throw new Error("Requested background removal model is not available.");
  }

  if (!runtimeCache.has(modelId)) {
    const runtimePromise =
      model.runtime === "worker-js"
        ? createWorkerRuntime(model)
        : createMediaPipeRuntime(model);
    runtimeCache.set(modelId, runtimePromise);
  }

  return runtimeCache.get(modelId);
}
