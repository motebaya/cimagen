import { FACE_BLUR_TIERS } from "./faceBlurConstants.js";

export const FACE_BLUR_MODELS = [
  {
    id: "browser-face-detector",
    label: "Browser FaceDetector",
    tier: "fast",
    runtime: "browser-face-detector",
    source: "Native browser API",
    supportsGpu: false,
    supportsWasm: false,
    offline: true,
    recommendedFor: "Quick scans on supported Chromium-based browsers.",
    enabled: true,
    strategy: "browser",
    detectionScales: [1],
    confidenceOffset: 0,
    mergeOverlapThreshold: 0.34,
    maxDetectedFaces: 12,
    note: "Uses the built-in FaceDetector API with no extra local model load.",
  },
  {
    id: "mediapipe-blazeface",
    label: "MediaPipe BlazeFace",
    tier: "balanced",
    runtime: "mediapipe-tflite",
    source: "Bundled local BlazeFace model",
    supportsGpu: true,
    supportsWasm: true,
    offline: true,
    recommendedFor: "Best default for consistent local face detection.",
    enabled: true,
    strategy: "mediapipe-single",
    detectionScales: [1],
    confidenceOffset: 0,
    mergeOverlapThreshold: 0.34,
    maxDetectedFaces: 14,
    note: "Runs a single local MediaPipe detection pass.",
  },
  {
    id: "mediapipe-multiscale",
    label: "Multi-scale BlazeFace",
    tier: "quality",
    runtime: "mediapipe-tflite",
    source: "Bundled local BlazeFace model",
    supportsGpu: true,
    supportsWasm: true,
    offline: true,
    recommendedFor:
      "Catches smaller faces and difficult framing with extra passes.",
    enabled: true,
    strategy: "mediapipe-multiscale",
    detectionScales: [1, 1.18, 1.42],
    confidenceOffset: -0.05,
    mergeOverlapThreshold: 0.42,
    maxDetectedFaces: 18,
    note: "Runs the local detector at multiple scales and keeps more smaller faces.",
  },
  {
    id: "hybrid-face-scan",
    label: "Hybrid Face Scan",
    tier: "heavy",
    runtime: "browser-face-detector + mediapipe-tflite",
    source: "Native browser detector plus local BlazeFace",
    supportsGpu: true,
    supportsWasm: true,
    offline: true,
    recommendedFor:
      "Most thorough option when you want to catch every visible face.",
    enabled: true,
    strategy: "hybrid",
    detectionScales: [1, 1.16, 1.38, 1.72],
    confidenceOffset: -0.1,
    mergeOverlapThreshold: 0.52,
    maxDetectedFaces: 24,
    note: "Combines browser detections with extra local passes for crowded photos.",
    warning: "Heavy mode is slower and may feel expensive on large images.",
  },
];

export function getFaceBlurTiers() {
  return FACE_BLUR_TIERS;
}

export function getEnabledFaceBlurModels() {
  return FACE_BLUR_MODELS.filter((model) => model.enabled);
}

export function getFaceBlurModelById(modelId) {
  return (
    getEnabledFaceBlurModels().find((model) => model.id === modelId) || null
  );
}

export function getModelsForTier(tierId) {
  return getEnabledFaceBlurModels().filter((model) => model.tier === tierId);
}

export function getDefaultFaceBlurModel() {
  return (
    getFaceBlurModelById("mediapipe-blazeface") || getEnabledFaceBlurModels()[0]
  );
}

export function getDefaultTier() {
  return getDefaultFaceBlurModel()?.tier || FACE_BLUR_TIERS[0].id;
}
