import { getMediaPipeModelPath, loadVisionTasks } from "../mediapipeVision.js";
import {
  getDefaultFaceBlurModel,
  getFaceBlurModelById,
} from "./modelRegistry.js";
import { clamp, mergeFaceDetections, scaleCanvas } from "./faceBlurHelpers.js";

let cachedBrowserDetector = null;
const mediaPipeCache = new Map();

function normalizeBrowserDetections(detections, width, height) {
  return detections.map((detection, index) => ({
    id: `browser-face-${index}`,
    x: detection.boundingBox.x / width,
    y: detection.boundingBox.y / height,
    width: detection.boundingBox.width / width,
    height: detection.boundingBox.height / height,
    score: 1,
  }));
}

function normalizeMediaPipeDetections(detections, width, height) {
  return detections.map((detection, index) => ({
    id: `mediapipe-face-${index}`,
    x: detection.boundingBox.originX / width,
    y: detection.boundingBox.originY / height,
    width: detection.boundingBox.width / width,
    height: detection.boundingBox.height / height,
    score: detection.categories?.[0]?.score ?? 1,
  }));
}

async function getBrowserFaceDetector() {
  if (typeof window === "undefined" || !("FaceDetector" in window)) {
    throw new Error("Browser FaceDetector is not supported here.");
  }

  if (!cachedBrowserDetector) {
    cachedBrowserDetector = Promise.resolve(
      new window.FaceDetector({ fastMode: true, maxDetectedFaces: 20 }),
    );
  }

  return cachedBrowserDetector;
}

async function createMediaPipeDetector(delegate) {
  const { FaceDetector, vision } = await loadVisionTasks();
  return FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: getMediaPipeModelPath(
        "models/mediapipe/face/blaze_face_short_range.tflite",
      ),
      delegate,
    },
    runningMode: "IMAGE",
    minDetectionConfidence: 0.2,
    minSuppressionThreshold: 0.2,
  });
}

async function getMediaPipeDetector(delegate) {
  if (!mediaPipeCache.has(delegate)) {
    mediaPipeCache.set(delegate, createMediaPipeDetector(delegate));
  }

  return mediaPipeCache.get(delegate);
}

async function createSinglePassRuntime(model) {
  const delegateOrder = ["GPU", "CPU"];
  let lastError = null;

  for (const delegate of delegateOrder) {
    try {
      const detector = await getMediaPipeDetector(delegate);
      return {
        ...model,
        backend: delegate.toLowerCase(),
        note: `${model.note} Running with ${delegate.toLowerCase()} backend.`,
        async detect(canvas, options = {}) {
          const result = detector.detect(canvas);
          const threshold = clamp(
            (options.detectionSensitivity ?? 0) + (model.confidenceOffset || 0),
            0.08,
            0.95,
          );
          const normalized = normalizeMediaPipeDetections(
            result?.detections || [],
            canvas.width,
            canvas.height,
          );
          return normalized.filter((face) => face.score >= threshold);
        },
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`Unable to initialize ${model.label}.`);
}

async function createBrowserRuntime(model) {
  const detector = await getBrowserFaceDetector();
  return {
    ...model,
    backend: "browser-facedetector",
    note: model.note,
    async detect(canvas) {
      const detections = await detector.detect(canvas);
      return normalizeBrowserDetections(
        detections,
        canvas.width,
        canvas.height,
      );
    },
  };
}

async function createMultiScaleRuntime(model) {
  const baseRuntime = await createSinglePassRuntime(model);
  return {
    ...baseRuntime,
    note: model.note,
    async detect(canvas, options = {}) {
      const allDetections = [];

      for (const scale of model.detectionScales || [1]) {
        const scaledCanvas = scale === 1 ? canvas : scaleCanvas(canvas, scale);
        const detections = await baseRuntime.detect(scaledCanvas, options);
        allDetections.push(...detections);
      }

      return mergeFaceDetections(
        allDetections,
        model.mergeOverlapThreshold || 0.34,
      ).slice(0, options.maxDetectedFaces || model.maxDetectedFaces || 20);
    },
  };
}

async function createHybridRuntime(model) {
  let browserRuntime = null;
  try {
    browserRuntime = await createBrowserRuntime(model);
  } catch {
    browserRuntime = null;
  }

  const multiScaleRuntime = await createMultiScaleRuntime(model);

  return {
    ...model,
    backend: browserRuntime
      ? `${browserRuntime.backend}+${multiScaleRuntime.backend}`
      : multiScaleRuntime.backend,
    note: browserRuntime
      ? model.note
      : `${model.note} Browser detector unavailable, using local multiscale fallback.`,
    async detect(canvas, options = {}) {
      const detections = await multiScaleRuntime.detect(canvas, options);
      if (!browserRuntime) {
        return detections;
      }

      const browserDetections = await browserRuntime.detect(canvas, options);
      return mergeFaceDetections(
        [...detections, ...browserDetections],
        model.mergeOverlapThreshold || 0.34,
      ).slice(0, options.maxDetectedFaces || model.maxDetectedFaces || 20);
    },
  };
}

const runtimeCache = new Map();

export async function loadFaceBlurModel(modelId) {
  const model = getFaceBlurModelById(modelId) || getDefaultFaceBlurModel();

  if (!runtimeCache.has(model.id)) {
    const runtimePromise = (() => {
      if (model.strategy === "browser") {
        return createBrowserRuntime(model).catch(() =>
          createSinglePassRuntime({
            ...model,
            note: `${model.note} Browser detector unavailable, using local MediaPipe fallback.`,
          }),
        );
      }

      if (model.strategy === "mediapipe-single") {
        return createSinglePassRuntime(model);
      }

      if (model.strategy === "mediapipe-multiscale") {
        return createMultiScaleRuntime(model);
      }

      if (model.strategy === "hybrid") {
        return createHybridRuntime(model);
      }

      throw new Error(`Unknown face blur strategy: ${model.strategy}`);
    })();

    runtimeCache.set(model.id, runtimePromise);
  }

  return runtimeCache.get(model.id);
}
