import BackgroundRemoverRangeField from "./BackgroundRemoverRangeField.jsx";
import BackgroundRemoverModelSelector from "./BackgroundRemoverModelSelector.jsx";
import BackgroundRemoverOutputPanel from "./BackgroundRemoverOutputPanel.jsx";

export default function BackgroundRemoverSettings({
  backgroundFilename,
  backgroundImageSrc,
  backgroundInputRef,
  backgroundModes,
  exportFormats,
  hasImage,
  inputAccept,
  isExporting,
  modelState,
  result,
  resultSummary,
  settings,
  onBackgroundInputChange,
  onClearBackgroundReplacement,
  onExport,
  onOpenBackgroundPicker,
  onUpdateSetting,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Removal Settings
        </h2>
      </div>

      <BackgroundRemoverModelSelector modelState={modelState} />

      <div
        className="space-y-4 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <BackgroundRemoverRangeField
          label="Threshold"
          value={settings.threshold}
          min={10}
          max={120}
          step={1}
          onChange={(value) => onUpdateSetting("threshold", value)}
        />
        <BackgroundRemoverRangeField
          label="Edge Tolerance"
          value={settings.edgeTolerance}
          min={10}
          max={120}
          step={1}
          onChange={(value) => onUpdateSetting("edgeTolerance", value)}
        />
        <BackgroundRemoverRangeField
          label="Mask Feather"
          value={settings.feather}
          min={0}
          max={32}
          step={1}
          onChange={(value) => onUpdateSetting("feather", value)}
        />
        {settings.backgroundMode === "blur" && (
          <BackgroundRemoverRangeField
            label="Background Blur"
            value={settings.backgroundBlur}
            min={4}
            max={40}
            step={1}
            onChange={(value) => onUpdateSetting("backgroundBlur", value)}
          />
        )}
        <p
          className="text-xs leading-relaxed m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Start with the fast tier, then switch upward only when the edge
          quality needs extra work. Heavy mode is best reserved for final
          exports.
        </p>
      </div>

      <div
        className="pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <BackgroundRemoverOutputPanel
          backgroundFilename={backgroundFilename}
          backgroundImageSrc={backgroundImageSrc}
          backgroundInputRef={backgroundInputRef}
          backgroundModes={backgroundModes}
          exportFormats={exportFormats}
          hasImage={hasImage}
          inputAccept={inputAccept}
          isExporting={isExporting}
          result={result}
          resultSummary={resultSummary}
          settings={settings}
          onBackgroundInputChange={onBackgroundInputChange}
          onClearBackgroundReplacement={onClearBackgroundReplacement}
          onExport={onExport}
          onOpenBackgroundPicker={onOpenBackgroundPicker}
          onUpdateSetting={onUpdateSetting}
        />
      </div>
    </div>
  );
}
