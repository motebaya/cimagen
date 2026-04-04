import HtmlToggle from "./HtmlToggle.jsx";

export default function HtmlDeviceFrameControls({
  deviceFrame,
  fullPage,
  onDeviceFrameChange,
  onFullPageChange,
  onShadowChange,
  shadow,
}) {
  return (
    <div className="space-y-3">
      <HtmlToggle
        checked={fullPage}
        onChange={onFullPageChange}
        label="Full Page"
        description="Capture the page exactly as it renders, without added background or presentation chrome."
      />
      <HtmlToggle
        checked={deviceFrame}
        onChange={onDeviceFrameChange}
        disabled={fullPage}
        label="Device Frame"
        description="Wrap the capture inside a browser-style presentation frame."
      />
      <HtmlToggle
        checked={shadow}
        onChange={onShadowChange}
        disabled={fullPage}
        label="Shadow"
        description="Add presentation shadow only when using wrapped background mode."
      />
    </div>
  );
}
