import { useEffect, useMemo, useState } from "react";
import {
  getBackgroundRemovalTiers,
  getDefaultTier,
  getModelsForTier,
} from "../../utils/background-remover/modelRegistry.js";
import { loadBackgroundRemovalModel } from "../../utils/background-remover/modelLoader.js";

export default function useBackgroundRemovalModels() {
  const tiers = getBackgroundRemovalTiers();
  const [selectedTier, setSelectedTier] = useState(getDefaultTier());
  const [selectedModelId, setSelectedModelId] = useState(
    () => getModelsForTier(getDefaultTier())[0]?.id || null,
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

    loadBackgroundRemovalModel(selectedModel.id)
      .then((runtime) => {
        if (!active) return;
        setRuntimeInfo({
          backend: runtime.backend,
          note: runtime.note,
        });
      })
      .catch((error) => {
        if (!active) return;
        setRuntimeInfo({
          backend: "unavailable",
          note: error.message || selectedModel.note,
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
    tiers,
    selectedTier,
    selectedTierMeta,
    selectedModelId,
    selectedModel,
    filteredModels,
    runtimeInfo,
    isModelLoading,
    setSelectedTier,
    setSelectedModelId,
  };
}
