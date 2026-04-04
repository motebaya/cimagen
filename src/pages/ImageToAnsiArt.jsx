import SEO from "../components/SEO.jsx";
import AnsiErrorBanner from "../components/image-to-ansi-art/AnsiErrorBanner.jsx";
import AnsiExportCard from "../components/image-to-ansi-art/AnsiExportCard.jsx";
import AnsiPreviewCard from "../components/image-to-ansi-art/AnsiPreviewCard.jsx";
import AnsiSettingsCard from "../components/image-to-ansi-art/AnsiSettingsCard.jsx";
import AnsiTopBar from "../components/image-to-ansi-art/AnsiTopBar.jsx";
import ImageToAnsiArtLayout from "../components/image-to-ansi-art/ImageToAnsiArtLayout.jsx";
import useImageToAnsiArt from "../hooks/image-to-ansi-art/useImageToAnsiArt.js";

export default function ImageToAnsiArt() {
  const { error, exportCard, previewCard, settingsCard } = useImageToAnsiArt();

  return (
    <>
      <SEO pageKey="image-to-ansi-art" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <AnsiTopBar />
        <AnsiErrorBanner error={error} />

        <ImageToAnsiArtLayout
          left={
            <div className="space-y-4">
              <AnsiPreviewCard {...previewCard} />
              <AnsiExportCard {...exportCard} />
            </div>
          }
          right={<AnsiSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
