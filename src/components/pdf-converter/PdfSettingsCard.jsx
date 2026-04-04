import PdfRangeField from "./PdfRangeField.jsx";
import PdfSegmentControl from "./PdfSegmentControl.jsx";
import PdfSelect from "./PdfSelect.jsx";

export default function PdfSettingsCard({
  backgroundColor,
  backgroundOptions,
  filename,
  layout,
  layoutOptions,
  margin,
  onUpdateSetting,
  orientation,
  orientationOptions,
  pageSize,
  pageSizeOptions,
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

      <div
        className="pt-1 border-t space-y-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <PdfSelect
          label="Page Size"
          options={pageSizeOptions}
          value={pageSize}
          onChange={(value) => onUpdateSetting("pageSize", value)}
        />

        <PdfSegmentControl
          label="Orientation"
          options={orientationOptions}
          value={orientation}
          onChange={(value) => onUpdateSetting("orientation", value)}
        />

        <PdfSelect
          label="Layout"
          options={layoutOptions}
          value={layout}
          onChange={(value) => onUpdateSetting("layout", value)}
        />

        <PdfRangeField
          label="Margin"
          value={margin}
          min={0}
          max={50}
          suffix=" mm"
          onChange={(value) => onUpdateSetting("margin", value)}
        />

        <PdfSegmentControl
          label="Background"
          options={backgroundOptions}
          value={backgroundColor}
          onChange={(value) => onUpdateSetting("backgroundColor", value)}
        />

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Filename
          </label>
          <input
            type="text"
            value={filename}
            onChange={(event) =>
              onUpdateSetting("filename", event.target.value)
            }
            placeholder="images.pdf"
            className="w-full px-3 py-2 rounded-lg text-sm border-none"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
