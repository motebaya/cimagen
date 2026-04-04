import SEO from "../components/SEO.jsx";
import MetadataExportCard from "../components/metadata-viewer/MetadataExportCard.jsx";
import MetadataLocationCard from "../components/metadata-viewer/MetadataLocationCard.jsx";
import MetadataPreviewCard from "../components/metadata-viewer/MetadataPreviewCard.jsx";
import MetadataResultCard from "../components/metadata-viewer/MetadataResultCard.jsx";
import MetadataSettingsCard from "../components/metadata-viewer/MetadataSettingsCard.jsx";
import MetadataViewerErrorBanner from "../components/metadata-viewer/MetadataViewerErrorBanner.jsx";
import MetadataViewerLayout from "../components/metadata-viewer/MetadataViewerLayout.jsx";
import MetadataViewerTopBar from "../components/metadata-viewer/MetadataViewerTopBar.jsx";
import useMetadataViewer from "../hooks/metadata-viewer/useMetadataViewer.js";

export default function MetadataViewer() {
  const {
    error,
    exportCard,
    locationCard,
    previewCard,
    resultCard,
    settingsCard,
  } = useMetadataViewer();

  return (
    <>
      <SEO pageKey="metadataViewer" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <MetadataViewerTopBar />
        <MetadataViewerErrorBanner error={error} />

        <MetadataViewerLayout
          left={
            <div className="space-y-4">
              <MetadataPreviewCard {...previewCard} />
              <MetadataResultCard {...resultCard} />
              <MetadataLocationCard {...locationCard} />
            </div>
          }
          right={
            <div className="space-y-4">
              <MetadataSettingsCard {...settingsCard} />
              <MetadataExportCard {...exportCard} />
            </div>
          }
        />
      </div>
    </>
  );
}
