import SEO from "../components/SEO.jsx";
import PhLogoExportCard from "../components/phlogo-creator/PhLogoExportCard.jsx";
import PhLogoLayout from "../components/phlogo-creator/PhLogoLayout.jsx";
import PhLogoPreviewCard from "../components/phlogo-creator/PhLogoPreviewCard.jsx";
import PhLogoSettingsCard from "../components/phlogo-creator/PhLogoSettingsCard.jsx";
import PhLogoTopBar from "../components/phlogo-creator/PhLogoTopBar.jsx";
import usePhLogoCreator from "../hooks/phlogo-creator/usePhLogoCreator.js";

export default function PhLogoCreator() {
  const {
    exportCanvasRef,
    exportCard,
    historyPanel,
    pageState,
    previewCard,
    settingsCard,
  } = usePhLogoCreator();

  return (
    <>
      <SEO pageKey="phLogoCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <PhLogoTopBar historyPanel={historyPanel} />
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            P*or*n Hub Logo Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create custom logo with text.
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
        <PhLogoLayout
          left={<PhLogoPreviewCard {...previewCard} />}
          right={
            <>
              <PhLogoSettingsCard {...settingsCard} />
              <PhLogoExportCard {...exportCard} />
            </>
          }
        />
        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
