import { Download, Loader2, Upload, X } from "lucide-react";
import { HIDDEN_INPUT_STYLE } from "../../utils/background-remover/backgroundRemovalConstants.js";

export default function BackgroundRemoverOutputPanel({
  backgroundFilename,
  backgroundImageSrc,
  backgroundInputRef,
  backgroundModes,
  exportFormats,
  hasImage,
  inputAccept,
  isExporting,
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
    <div className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Background Output
        </label>
        <select
          value={settings.backgroundMode}
          onChange={(event) =>
            onUpdateSetting("backgroundMode", event.target.value)
          }
          className="w-full px-3 py-2 rounded-lg border outline-none"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        >
          {backgroundModes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {settings.backgroundMode === "color" && (
        <input
          type="color"
          value={settings.backgroundColor}
          onChange={(event) =>
            onUpdateSetting("backgroundColor", event.target.value)
          }
          className="w-full h-10 rounded-lg border outline-none"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg)",
          }}
        />
      )}

      {settings.backgroundMode === "gradient" && (
        <div className="grid grid-cols-2 gap-4">
          <input
            type="color"
            value={settings.gradientFrom}
            onChange={(event) =>
              onUpdateSetting("gradientFrom", event.target.value)
            }
            className="w-full h-10 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
            }}
          />
          <input
            type="color"
            value={settings.gradientTo}
            onChange={(event) =>
              onUpdateSetting("gradientTo", event.target.value)
            }
            className="w-full h-10 rounded-lg border outline-none"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg)",
            }}
          />
        </div>
      )}

      {settings.backgroundMode === "image" && (
        <>
          <button
            type="button"
            onClick={onOpenBackgroundPicker}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            <Upload size={16} />
            Upload replacement background
          </button>

          <input
            ref={backgroundInputRef}
            type="file"
            accept={inputAccept}
            style={HIDDEN_INPUT_STYLE}
            onChange={onBackgroundInputChange}
          />

          {backgroundImageSrc && (
            <div
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: "var(--border-color)" }}
            >
              <img
                src={backgroundImageSrc}
                alt="Replacement background"
                className="w-full h-32 object-cover block"
              />
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <span
                  className="text-xs truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {backgroundFilename || "Replacement background"}
                </span>
                <button
                  type="button"
                  onClick={onClearBackgroundReplacement}
                  className="p-1 rounded-md cursor-pointer border-none"
                  style={{
                    color: "var(--text-tertiary)",
                    backgroundColor: "transparent",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {result && resultSummary && (
        <div className="grid grid-cols-2 gap-3">
          {resultSummary.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border px-3 py-3"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-xs m-0 mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {label}
              </p>
              <p
                className="text-sm font-semibold m-0 break-all"
                style={{ color: "var(--text-primary)" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Export
        </label>
        <div className="flex flex-wrap gap-3">
          {exportFormats.map(([format, label]) => (
            <button
              key={format}
              type="button"
              onClick={() => onExport(format)}
              disabled={!hasImage || isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {result?.note && (
        <p
          className="text-xs leading-relaxed m-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          {result.note}
        </p>
      )}
      {result?.warning && (
        <p className="text-xs leading-relaxed m-0" style={{ color: "#b45309" }}>
          {result.warning}
        </p>
      )}
    </div>
  );
}
