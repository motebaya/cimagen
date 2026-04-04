import SEO from "../components/SEO.jsx";
import StatisticFrameExportCard from "../components/statistic-frame-creator/StatisticFrameExportCard.jsx";
import StatisticFrameLayout from "../components/statistic-frame-creator/StatisticFrameLayout.jsx";
import StatisticFramePreviewCard from "../components/statistic-frame-creator/StatisticFramePreviewCard.jsx";
import StatisticFrameSettingsCard from "../components/statistic-frame-creator/StatisticFrameSettingsCard.jsx";
import StatisticFrameTopBar from "../components/statistic-frame-creator/StatisticFrameTopBar.jsx";
import useStatisticFrameCreator from "../hooks/statistic-frame-creator/useStatisticFrameCreator.js";

export default function StatisticFrameCreator() {
  const {
    exportCard,
    hiddenExportCanvasRef,
    historyPanel,
    pageState,
    previewCard,
    settingsCard,
  } = useStatisticFrameCreator();

  return (
    <>
      <SEO pageKey="statisticFrameCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <StatisticFrameTopBar historyPanel={historyPanel} />

        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Statistic Frame Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create statistic overlays on background images with customizable
            text.
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

        <StatisticFrameLayout
          left={<StatisticFramePreviewCard {...previewCard} />}
          right={
            <>
              <StatisticFrameSettingsCard {...settingsCard} />
              <StatisticFrameExportCard {...exportCard} />
            </>
          }
        />

        <canvas ref={hiddenExportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
