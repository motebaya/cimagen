import HtmlDeviceFrameControls from "./HtmlDeviceFrameControls.jsx";
import HtmlSourceControls from "./HtmlSourceControls.jsx";
import HtmlThemeControls from "./HtmlThemeControls.jsx";
import HtmlViewportControls from "./HtmlViewportControls.jsx";

export default function HtmlSettingsCard({
  backgroundColor,
  customHeight,
  customWidth,
  delay,
  deviceFrame,
  fullPage,
  heightOptions,
  heightPreset,
  loadSampleDisabled,
  markup,
  onBackgroundColorChange,
  onCustomHeightChange,
  onCustomWidthChange,
  onDelayChange,
  onDeviceFrameChange,
  onFullPageChange,
  onHeightPresetChange,
  onLoadSample,
  onMarkupChange,
  onModeChange,
  onPaddingChange,
  onResetSample,
  onScaleFactorChange,
  onShadowChange,
  onThemeChange,
  onUrlChange,
  onWidthPresetChange,
  padding,
  scaleFactor,
  shadow,
  sourceMode,
  sourceModes,
  theme,
  themeOptions,
  urlInput,
  widthOptions,
  widthPreset,
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
          Settings
        </h2>
      </div>

      <HtmlSourceControls
        loadSampleDisabled={loadSampleDisabled}
        markup={markup}
        onLoadSample={onLoadSample}
        onMarkupChange={onMarkupChange}
        onModeChange={onModeChange}
        onResetSample={onResetSample}
        onUrlChange={onUrlChange}
        sourceMode={sourceMode}
        sourceModes={sourceModes}
        urlInput={urlInput}
      />

      <div
        className="pt-1 border-t space-y-5"
        style={{ borderColor: "var(--border-color)" }}
      >
        <HtmlViewportControls
          customHeight={customHeight}
          customWidth={customWidth}
          delay={delay}
          heightOptions={heightOptions}
          heightPreset={heightPreset}
          onCustomHeightChange={onCustomHeightChange}
          onCustomWidthChange={onCustomWidthChange}
          onDelayChange={onDelayChange}
          onHeightPresetChange={onHeightPresetChange}
          onPaddingChange={onPaddingChange}
          onScaleFactorChange={onScaleFactorChange}
          onWidthPresetChange={onWidthPresetChange}
          padding={padding}
          scaleFactor={scaleFactor}
          widthOptions={widthOptions}
          widthPreset={widthPreset}
        />

        <HtmlThemeControls
          backgroundColor={backgroundColor}
          fullPage={fullPage}
          onBackgroundColorChange={onBackgroundColorChange}
          onThemeChange={onThemeChange}
          theme={theme}
          themeOptions={themeOptions}
        />

        <HtmlDeviceFrameControls
          deviceFrame={deviceFrame}
          fullPage={fullPage}
          onDeviceFrameChange={onDeviceFrameChange}
          onFullPageChange={onFullPageChange}
          onShadowChange={onShadowChange}
          shadow={shadow}
        />
      </div>
    </div>
  );
}
