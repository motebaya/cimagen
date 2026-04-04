import {
  PREVIEW_MAX_DIMENSIONS,
  UPSCALE_SCALE_OPTIONS,
  UPSCALE_TIER_OPTIONS,
} from "./imageUpscalerConstants.js";

export const UPSCALER_MODELS = [
  {
    id: "esrgan-slim",
    label: "ESRGAN Slim",
    tier: "fast",
    runtime: "TensorFlow.js ESRGAN",
    scaleOptions: UPSCALE_SCALE_OPTIONS,
    supportsWebGPU: false,
    supportsWasm: false,
    offline: true,
    estimatedSpeed: "Fastest",
    estimatedQuality: "Light detail recovery",
    enabled: true,
    recommendedFor: "Best for quick browser previews and lighter laptops.",
    previewMaxDimension: PREVIEW_MAX_DIMENSIONS.fast,
    patchSizes: { 2: 96, 4: 72 },
    padding: 2,
    backend: "webgl-or-cpu",
    remoteModelPaths: {
      2: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@1.0.0-beta.12/models/x2/model.json",
      4: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@1.0.0-beta.12/models/x4/model.json",
    },
    loaders: {
      2: () => import("@upscalerjs/esrgan-slim/2x"),
      4: () => import("@upscalerjs/esrgan-slim/4x"),
    },
    loader: () => import("./models/fastUpscaler.js"),
  },
  {
    id: "esrgan-medium",
    label: "ESRGAN Medium",
    tier: "balanced",
    runtime: "TensorFlow.js ESRGAN",
    scaleOptions: UPSCALE_SCALE_OPTIONS,
    supportsWebGPU: false,
    supportsWasm: false,
    offline: true,
    estimatedSpeed: "Balanced",
    estimatedQuality: "Cleaner structure",
    enabled: true,
    recommendedFor:
      "Strong default for product photos, UI captures, and mixed imagery.",
    previewMaxDimension: PREVIEW_MAX_DIMENSIONS.balanced,
    patchSizes: { 2: 96, 4: 80 },
    padding: 2,
    backend: "webgl-or-cpu",
    remoteModelPaths: {
      2: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-medium@1.0.0-beta.13/models/x2/model.json",
      4: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-medium@1.0.0-beta.13/models/x4/model.json",
    },
    loaders: {
      2: () => import("@upscalerjs/esrgan-medium/2x"),
      4: () => import("@upscalerjs/esrgan-medium/4x"),
    },
    loader: () => import("./models/balancedUpscaler.js"),
  },
  {
    id: "esrgan-legacy",
    label: "ESRGAN Legacy",
    tier: "quality",
    runtime: "TensorFlow.js ESRGAN",
    scaleOptions: UPSCALE_SCALE_OPTIONS,
    supportsWebGPU: false,
    supportsWasm: false,
    offline: true,
    estimatedSpeed: "Slower",
    estimatedQuality: "Higher texture recovery",
    enabled: true,
    recommendedFor:
      "Sharper faces, typography, and screenshots where detail matters.",
    previewMaxDimension: PREVIEW_MAX_DIMENSIONS.quality,
    patchSizes: { 2: 88, 4: 64 },
    padding: 2,
    backend: "webgl-or-cpu",
    remoteModelPaths: {
      2: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-legacy@1.0.0-beta.14/models/div2k/x2/model.json",
      4: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-legacy@1.0.0-beta.14/models/div2k/x4/model.json",
    },
    loaders: {
      2: () => import("@upscalerjs/esrgan-legacy/div2k/2x"),
      4: () => import("@upscalerjs/esrgan-legacy/div2k/4x"),
    },
    loader: () => import("./models/qualityUpscaler.js"),
  },
  {
    id: "esrgan-thick",
    label: "ESRGAN Thick",
    tier: "heavy",
    runtime: "TensorFlow.js ESRGAN",
    scaleOptions: UPSCALE_SCALE_OPTIONS,
    supportsWebGPU: false,
    supportsWasm: false,
    offline: true,
    estimatedSpeed: "Heavy",
    estimatedQuality: "Best local super resolution",
    enabled: true,
    recommendedFor:
      "Best quality export when you can tolerate longer processing time.",
    previewMaxDimension: PREVIEW_MAX_DIMENSIONS.heavy,
    patchSizes: { 2: 64, 4: 48 },
    padding: 2,
    backend: "webgl-or-cpu",
    remoteModelPaths: {
      2: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-thick@1.0.0-beta.16/models/x2/model.json",
      4: "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-thick@1.0.0-beta.16/models/x4/model.json",
    },
    loaders: {
      2: () => import("@upscalerjs/esrgan-thick/2x"),
      4: () => import("@upscalerjs/esrgan-thick/4x"),
    },
    warning: "Heavy mode can take noticeably longer on larger images.",
    loader: () => import("./models/heavyUpscaler.js"),
  },
];

export function getUpscalerTiers() {
  return UPSCALE_TIER_OPTIONS;
}

export function getEnabledUpscalerModels() {
  return UPSCALER_MODELS.filter((model) => model.enabled);
}

export function getUpscalerModelById(modelId) {
  return (
    getEnabledUpscalerModels().find((model) => model.id === modelId) || null
  );
}

export function getModelsForTier(tierId) {
  return getEnabledUpscalerModels().filter((model) => model.tier === tierId);
}

export function getDefaultUpscalerModel() {
  return getUpscalerModelById("esrgan-medium") || getEnabledUpscalerModels()[0];
}

export function getDefaultUpscalerTier() {
  return getDefaultUpscalerModel()?.tier || UPSCALE_TIER_OPTIONS[0].id;
}
