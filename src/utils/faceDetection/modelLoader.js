import { getMediaPipeModelPath, loadVisionTasks } from "../mediapipeVision.js";

let cachedFaceDetectionSession = null;

async function createDetector(delegate) {
  const { FaceDetector, vision } = await loadVisionTasks();
  return FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: getMediaPipeModelPath(
        "models/mediapipe/face/blaze_face_short_range.tflite",
      ),
      delegate,
    },
    runningMode: "IMAGE",
    minDetectionConfidence: 0.35,
    minSuppressionThreshold: 0.3,
  });
}

export async function loadFaceDetectionModel() {
  if (cachedFaceDetectionSession) {
    return cachedFaceDetectionSession;
  }

  try {
    const detector = await createDetector("GPU");
    cachedFaceDetectionSession = {
      type: "mediapipe-face-detector",
      backend: "gpu",
      detector,
      note: "MediaPipe face detector fallback is loaded locally.",
    };
    return cachedFaceDetectionSession;
  } catch (gpuError) {
    const detector = await createDetector("CPU");
    cachedFaceDetectionSession = {
      type: "mediapipe-face-detector",
      backend: "cpu",
      detector,
      note: "MediaPipe face detector fallback is loaded locally.",
    };
    return cachedFaceDetectionSession;
  }
}
