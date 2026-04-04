import {
  getDefaultUpscalerModel,
  getUpscalerModelById,
} from "./modelRegistry.js";

const runtimeCache = new Map();

export async function loadUpscalerModel(modelId) {
  const model = getUpscalerModelById(modelId) || getDefaultUpscalerModel();

  if (!runtimeCache.has(model.id)) {
    const runtimePromise = model
      .loader()
      .then((module) => module.createUpscalerModel(model));
    runtimeCache.set(model.id, runtimePromise);
  }

  return runtimeCache.get(model.id);
}
