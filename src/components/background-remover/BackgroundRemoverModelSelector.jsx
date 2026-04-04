export default function BackgroundRemoverModelSelector({ modelState }) {
  const {
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
  } = modelState;

  return (
    <div className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Method Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTier;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border text-left"
                style={{
                  borderColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--border-color)",
                  backgroundColor: isSelected
                    ? "var(--color-primary-600)"
                    : "var(--bg-tertiary)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
        <p
          className="text-xs mt-2 m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          {selectedTierMeta?.description}
        </p>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Model
        </label>
        <select
          value={selectedModelId || ""}
          onChange={(event) => setSelectedModelId(event.target.value)}
          className="w-full px-3 py-2 rounded-lg border outline-none"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        >
          {filteredModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

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
              {selectedModel.estimatedPerformance} /{" "}
              {selectedModel.estimatedQuality}
            </span>
          </div>
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            {selectedModel.recommendedFor}
          </p>
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            {isModelLoading
              ? "Preparing local runtime..."
              : runtimeInfo?.note || selectedModel.note}
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
