import CreatorMethodCategoryButtons from "../creator/CreatorMethodCategoryButtons.jsx";
import UpscalerSelect from "./UpscalerSelect.jsx";

export default function UpscalerModelSelector({ modelState }) {
  const {
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
  } = modelState;

  return (
    <div className="space-y-4">
      <div>
        <CreatorMethodCategoryButtons
          options={tiers}
          selectedValue={selectedTier}
          onChange={setSelectedTier}
        />
        <p
          className="text-xs mt-2 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          {selectedTierMeta?.description}
        </p>
      </div>

      <UpscalerSelect
        label="Upscale Method"
        value={selectedModelId}
        options={filteredModels.map((model) => ({
          value: model.id,
          label: model.label,
          description: `${model.estimatedSpeed} / ${model.estimatedQuality}`,
        }))}
        onChange={setSelectedModelId}
      />

      {selectedModel && (
        <div
          className="rounded-lg border px-3 py-3 text-sm space-y-2"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedModel.label}
            </strong>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {selectedModel.runtime}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {runtimeInfo?.usesCdn && (
              <span
                className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: "rgba(92, 124, 250, 0.08)",
                  color: "var(--color-primary-600)",
                  border: "1px solid rgba(92, 124, 250, 0.18)",
                }}
              >
                CDN model assets
              </span>
            )}
            {runtimeInfo?.backend && runtimeInfo.backend !== "unavailable" && (
              <span
                className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Backend: {runtimeInfo.backend}
              </span>
            )}
          </div>

          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            {isModelLoading
              ? "Loading method on demand..."
              : runtimeInfo?.note || selectedModel.recommendedFor}
          </p>
          {selectedModel.warning && (
            <p className="text-xs m-0" style={{ color: "#b45309" }}>
              {selectedModel.warning}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
