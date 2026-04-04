import { useEffect, useMemo, useState } from "react";
import {
  getDefaultUpscalerTier,
  getModelsForTier,
  getUpscalerTiers,
  loadUpscalerModel,
} from "../../utils/image-upscaler/index.js";

export default function useUpscalerModels() {
  const tiers = getUpscalerTiers();
  const [selectedTier, setSelectedTier] = useState(getDefaultUpscalerTier());
  const [selectedModelId, setSelectedModelId] = useState(
    () => getModelsForTier(getDefaultUpscalerTier())[0]?.id || null,
  );
  const [runtimeInfo, setRuntimeInfo] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const filteredModels = useMemo(
    () => getModelsForTier(selectedTier),
    [selectedTier],
  );
  const selectedTierMeta = useMemo(
    () => tiers.find((tier) => tier.id === selectedTier) || tiers[0],
    [selectedTier, tiers],
  );
  const selectedModel = useMemo(
    () =>
      filteredModels.find((model) => model.id === selectedModelId) ||
      filteredModels[0] ||
      null,
    [filteredModels, selectedModelId],
  );

  useEffect(() => {
    if (!filteredModels.some((model) => model.id === selectedModelId)) {
      setSelectedModelId(filteredModels[0]?.id || null);
    }
  }, [filteredModels, selectedModelId]);

  useEffect(() => {
    if (!selectedModel) {
      setRuntimeInfo(null);
      return;
    }

    let active = true;
    setIsModelLoading(true);

    loadUpscalerModel(selectedModel.id)
      .then((runtime) => {
        if (!active) return;
        setRuntimeInfo({
          backend: runtime.backend || runtime.backendLabel || "webgl-or-cpu",
          usesCdn: Boolean(runtime.remoteModelPaths),
          runtime: runtime.runtime,
          note: selectedModel.recommendedFor,
        });
      })
      .catch((error) => {
        if (!active) return;
        setRuntimeInfo({
          backend: "unavailable",
          usesCdn: Boolean(selectedModel.remoteModelPaths),
          runtime: "unavailable",
          note: error.message || selectedModel.recommendedFor,
        });
      })
      .finally(() => {
        if (active) {
          setIsModelLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedModel]);

  return {
    filteredModels,
    isModelLoading,
    runtimeInfo,
    selectedModel,
    selectedModelId,
    selectedTier,
    selectedTierMeta,
    setSelectedModelId,
    setSelectedTier,
    tiers,
  };
}
