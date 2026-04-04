import SEO from "../components/SEO.jsx";
import BlackpinkExportCard from "../components/blackpink-creator/BlackpinkExportCard.jsx";
import BlackpinkLayout from "../components/blackpink-creator/BlackpinkLayout.jsx";
import BlackpinkPreviewCard from "../components/blackpink-creator/BlackpinkPreviewCard.jsx";
import BlackpinkSettingsCard from "../components/blackpink-creator/BlackpinkSettingsCard.jsx";
import BlackpinkTopBar from "../components/blackpink-creator/BlackpinkTopBar.jsx";
import useBlackpinkCreator from "../hooks/blackpink-creator/useBlackpinkCreator.js";

export default function BlackpinkCreator() {
  const {
    exportCanvasRef,
    exportCard,
    historyPanel,
    pageState,
    previewCard,
    settingsCard,
  } = useBlackpinkCreator();

  return (
    <>
      <SEO pageKey="blackpinkCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <BlackpinkTopBar historyPanel={historyPanel} />

        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Blackpink Text Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create pink text on black background with border effect.
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

        <BlackpinkLayout
          left={<BlackpinkPreviewCard {...previewCard} />}
          right={
            <>
              <BlackpinkSettingsCard {...settingsCard} />
              <BlackpinkExportCard {...exportCard} />
            </>
          }
        />

        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
