import SEO from "../components/SEO.jsx";
import ThumbnailCreatorLayout from "../components/thumbnail-creator/ThumbnailCreatorLayout.jsx";
import ThumbnailExportCard from "../components/thumbnail-creator/ThumbnailExportCard.jsx";
import ThumbnailPreviewCard from "../components/thumbnail-creator/ThumbnailPreviewCard.jsx";
import ThumbnailSettingsCard from "../components/thumbnail-creator/ThumbnailSettingsCard.jsx";
import ThumbnailTopBar from "../components/thumbnail-creator/ThumbnailTopBar.jsx";
import useThumbnailCreator from "../hooks/thumbnail-creator/useThumbnailCreator.js";

export default function ThumbnailCreator() {
  const {
    error,
    exportCard,
    hiddenExportCanvasRef,
    historyPanel,
    previewCard,
    settingsCard,
  } = useThumbnailCreator();

  return (
    <>
      <SEO pageKey="thumbnailCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <ThumbnailTopBar historyPanel={historyPanel} />

        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Thumbnail Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create thumbnail images with centered text and colored backgrounds.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
            }}
          >
            <span>{error}</span>
          </div>
        )}

        <ThumbnailCreatorLayout
          left={<ThumbnailPreviewCard {...previewCard} />}
          right={
            <>
              <ThumbnailSettingsCard {...settingsCard} />
              <ThumbnailExportCard {...exportCard} />
            </>
          }
        />

        <canvas
          ref={hiddenExportCanvasRef}
          width={800}
          height={400}
          className="hidden"
        />
      </div>
    </>
  );
}
