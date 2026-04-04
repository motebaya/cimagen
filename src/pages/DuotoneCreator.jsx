import SEO from "../components/SEO.jsx";
import DuotoneExportCard from "../components/duotone-creator/DuotoneExportCard.jsx";
import DuotoneLayout from "../components/duotone-creator/DuotoneLayout.jsx";
import DuotonePreviewCard from "../components/duotone-creator/DuotonePreviewCard.jsx";
import DuotoneSettingsCard from "../components/duotone-creator/DuotoneSettingsCard.jsx";
import DuotoneTopBar from "../components/duotone-creator/DuotoneTopBar.jsx";
import useDuotoneCreator from "../hooks/duotone-creator/useDuotoneCreator.js";

export default function DuotoneCreator() {
  const {
    exportCard,
    hiddenExportCanvasRef,
    historyPanel,
    pageState,
    previewCard,
    settingsCard,
  } = useDuotoneCreator();

  return (
    <>
      <SEO pageKey="duotoneCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <DuotoneTopBar historyPanel={historyPanel} />

        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Duotone Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Convert images into a Pink × Green duotone effect with multiple
            filter modes.
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

        <DuotoneLayout
          left={<DuotonePreviewCard {...previewCard} />}
          right={
            <>
              <DuotoneSettingsCard {...settingsCard} />
              <DuotoneExportCard {...exportCard} />
            </>
          }
        />

        <canvas ref={hiddenExportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
