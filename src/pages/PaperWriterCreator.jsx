import SEO from "../components/SEO.jsx";
import PaperWriterExportCard from "../components/paperwriter-creator/PaperWriterExportCard.jsx";
import PaperWriterLayout from "../components/paperwriter-creator/PaperWriterLayout.jsx";
import PaperWriterPreviewCard from "../components/paperwriter-creator/PaperWriterPreviewCard.jsx";
import PaperWriterSettingsCard from "../components/paperwriter-creator/PaperWriterSettingsCard.jsx";
import PaperWriterTopBar from "../components/paperwriter-creator/PaperWriterTopBar.jsx";
import usePaperWriterCreator from "../hooks/paperwriter-creator/usePaperWriterCreator.js";

export default function PaperWriterCreator() {
  const { exportCard, historyPanel, pageState, previewCard, settingsCard } =
    usePaperWriterCreator();

  return (
    <>
      <SEO pageKey="paperWriterCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <PaperWriterTopBar historyPanel={historyPanel} />
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Paper Writer Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Convert text to handwritten-style paper pages.
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
        <PaperWriterLayout
          left={<PaperWriterPreviewCard {...previewCard} />}
          right={
            <>
              <PaperWriterSettingsCard {...settingsCard} />
              <PaperWriterExportCard {...exportCard} />
            </>
          }
        />
      </div>
    </>
  );
}
