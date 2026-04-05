import CreatorMethodCategoryButtons from "../creator/CreatorMethodCategoryButtons.jsx";
import CreatorSelect from "../creator/CreatorSelect.jsx";

export default function FaceBlurModelSelector({ modelState }) {
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

      <CreatorSelect
        label="Detection Method"
        value={selectedModelId || ""}
        options={filteredModels.map((model) => ({
          value: model.id,
          label: model.label,
          description: model.recommendedFor,
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
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            {selectedModel.recommendedFor}
          </p>
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            {isModelLoading
              ? "Preparing detector..."
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
