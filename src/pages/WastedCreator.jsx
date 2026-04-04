import SEO from "../components/SEO.jsx";
import useWastedCreator from "../hooks/wasted-creator/useWastedCreator.js";
import WastedExportCard from "../components/wasted-creator/WastedExportCard.jsx";
import WastedLayout from "../components/wasted-creator/WastedLayout.jsx";
import WastedPreviewCard from "../components/wasted-creator/WastedPreviewCard.jsx";
import WastedSettingsCard from "../components/wasted-creator/WastedSettingsCard.jsx";
import WastedTopBar from "../components/wasted-creator/WastedTopBar.jsx";

export default function WastedCreator() {
  const { exportCanvasRef, exportCard, historyPanel, pageState, previewCard } =
    useWastedCreator();

  return (
    <>
      <SEO pageKey="wastedCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <WastedTopBar historyPanel={historyPanel} />

        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Wasted Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Add GTA-style "wasted" overlay to your images.
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

        <WastedLayout
          left={<WastedPreviewCard {...previewCard} />}
          right={
            <>
              <WastedSettingsCard />
              <WastedExportCard {...exportCard} />
            </>
          }
        />

        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
