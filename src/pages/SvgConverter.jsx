import SEO from "../components/SEO.jsx";
import SvgExportCard from "../components/svg-converter/SvgExportCard.jsx";
import SvgLayout from "../components/svg-converter/SvgLayout.jsx";
import SvgPreviewCard from "../components/svg-converter/SvgPreviewCard.jsx";
import SvgSettingsCard from "../components/svg-converter/SvgSettingsCard.jsx";
import SvgTopBar from "../components/svg-converter/SvgTopBar.jsx";
import useSvgConverter from "../hooks/svg-converter/useSvgConverter.js";

export default function SvgConverter() {
  const { exportCard, pageState, previewCard, settingsCard } =
    useSvgConverter();
  return (
    <>
      <SEO pageKey="svgConverter" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <SvgTopBar />
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Image to SVG Converter
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Convert raster images to vector SVG format.
          </p>
        </div>
        {pageState.error && (
          <div
            className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
            }}
          >
            <span>{pageState.error}</span>
          </div>
        )}
        <SvgLayout
          left={<SvgPreviewCard {...previewCard} />}
          right={
            <>
              <SvgSettingsCard {...settingsCard} />
              <SvgExportCard {...exportCard} />
            </>
          }
        />
      </div>
    </>
  );
}
