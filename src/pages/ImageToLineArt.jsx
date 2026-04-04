import SEO from "../components/SEO.jsx";
import ImageToLineArtLayout from "../components/image-to-line-art/ImageToLineArtLayout.jsx";
import LineArtErrorBanner from "../components/image-to-line-art/LineArtErrorBanner.jsx";
import LineArtExportCard from "../components/image-to-line-art/LineArtExportCard.jsx";
import LineArtPreviewCard from "../components/image-to-line-art/LineArtPreviewCard.jsx";
import LineArtSettingsCard from "../components/image-to-line-art/LineArtSettingsCard.jsx";
import LineArtTopBar from "../components/image-to-line-art/LineArtTopBar.jsx";
import useImageToLineArt from "../hooks/image-to-line-art/useImageToLineArt.js";

export default function ImageToLineArt() {
  const { error, exportCard, previewCard, settingsCard } = useImageToLineArt();

  return (
    <>
      <SEO pageKey="image-to-line-art" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <LineArtTopBar />
        <LineArtErrorBanner error={error} />

        <ImageToLineArtLayout
          left={
            <div className="space-y-4">
              <LineArtPreviewCard {...previewCard} />
              <LineArtExportCard {...exportCard} />
            </div>
          }
          right={<LineArtSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
