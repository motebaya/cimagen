import { BACKGROUND_REMOVAL_TIERS } from "./backgroundRemovalConstants.js";

export const BACKGROUND_REMOVAL_MODELS = [
  {
    id: "quickmatte-worker",
    label: "QuickMatte Worker",
    tier: "fast",
    runtime: "worker-js",
    source: "Local heuristic worker segmentation",
    localAssetPath: null,
    supportsWebGPU: false,
    supportsWasm: false,
    estimatedPerformance: "Very fast",
    estimatedQuality: "Basic edges",
    offline: true,
    recommendedFor: "Fast previews, simple backgrounds, older laptops.",
    enabled: true,
    pipeline: "worker-only",
    preferredBackends: ["worker"],
    note: "Runs fully in a browser worker with no ML model initialization.",
    segmentationMaxDimension: 384,
  },
  {
    id: "mediapipe-deeplab-balanced",
    label: "DeepLab Local",
    tier: "balanced",
    runtime: "mediapipe-tflite",
    source: "Local MediaPipe DeepLabV3 asset",
    localAssetPath: "models/mediapipe/segmenter/deeplab_v3.tflite",
    supportsWebGPU: false,
    supportsWasm: true,
    estimatedPerformance: "Balanced",
    estimatedQuality: "Good general cutout",
    offline: true,
    recommendedFor:
      "Default choice for portraits, products, and social graphics.",
    enabled: true,
    pipeline: "deeplab-single",
    preferredBackends: ["gpu", "cpu"],
    note: "Uses the bundled DeepLabV3 model with soft foreground confidence masks.",
    segmentationMaxDimension: 512,
  },
  {
    id: "deeplab-edge-refine",
    label: "DeepLab + Edge Refine",
    tier: "quality",
    runtime: "mediapipe-tflite + worker-js",
    source: "Local MediaPipe DeepLabV3 with edge-aware refinement",
    localAssetPath: "models/mediapipe/segmenter/deeplab_v3.tflite",
    supportsWebGPU: false,
    supportsWasm: true,
    estimatedPerformance: "Slower",
    estimatedQuality: "Cleaner edges",
    offline: true,
    recommendedFor:
      "Hair, transparent props, and slightly more demanding cutouts.",
    enabled: true,
    pipeline: "deeplab-refine",
    preferredBackends: ["gpu", "cpu"],
    note: "Blends DeepLab confidence masks with local edge refinement for more natural boundaries.",
    segmentationMaxDimension: 640,
  },
  {
    id: "deeplab-hq-multipass",
    label: "DeepLab Multi-pass HQ",
    tier: "heavy",
    runtime: "mediapipe-tflite + worker-js",
    source: "Local multipass DeepLabV3 pipeline",
    localAssetPath: "models/mediapipe/segmenter/deeplab_v3.tflite",
    supportsWebGPU: false,
    supportsWasm: true,
    estimatedPerformance: "Heavy",
    estimatedQuality: "Highest local quality",
    offline: true,
    recommendedFor:
      "Large exports or difficult edges when you can wait longer.",
    enabled: true,
    pipeline: "deeplab-hq",
    preferredBackends: ["gpu", "cpu"],
    note: "Runs multiple DeepLab passes before worker refinement. Best quality, highest browser cost.",
    segmentationMaxDimension: 768,
    warning:
      "Heavy mode can be noticeably slower on integrated GPUs and mobile browsers.",
  },
];

export function getBackgroundRemovalTiers() {
  return BACKGROUND_REMOVAL_TIERS;
}

export function getEnabledBackgroundRemovalModels() {
  return BACKGROUND_REMOVAL_MODELS.filter((model) => model.enabled);
}

export function getBackgroundRemovalModelById(modelId) {
  return (
    getEnabledBackgroundRemovalModels().find((model) => model.id === modelId) ||
    null
  );
}

export function getModelsForTier(tierId) {
  return getEnabledBackgroundRemovalModels().filter(
    (model) => model.tier === tierId,
  );
}

export function getDefaultBackgroundRemovalModel() {
  return (
    getBackgroundRemovalModelById("quickmatte-worker") ||
    getEnabledBackgroundRemovalModels()[0]
  );
}

export function getDefaultTier() {
  return (
    getDefaultBackgroundRemovalModel()?.tier || BACKGROUND_REMOVAL_TIERS[0].id
  );
}
