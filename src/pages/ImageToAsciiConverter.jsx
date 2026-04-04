import SEO from "../components/SEO.jsx";
import AsciiErrorBanner from "../components/image-to-ascii/AsciiErrorBanner.jsx";
import AsciiExportCard from "../components/image-to-ascii/AsciiExportCard.jsx";
import AsciiPreviewCard from "../components/image-to-ascii/AsciiPreviewCard.jsx";
import AsciiSettingsCard from "../components/image-to-ascii/AsciiSettingsCard.jsx";
import AsciiTopBar from "../components/image-to-ascii/AsciiTopBar.jsx";
import ImageToAsciiLayout from "../components/image-to-ascii/ImageToAsciiLayout.jsx";
import useImageToAscii from "../hooks/image-to-ascii/useImageToAscii.js";

export default function ImageToAsciiConverter() {
  const { error, exportCard, previewCard, settingsCard } = useImageToAscii();

  return (
    <>
      <SEO pageKey="imageToAscii" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <AsciiTopBar />
        <AsciiErrorBanner error={error} />

        <ImageToAsciiLayout
          left={
            <div className="space-y-4">
              <AsciiPreviewCard {...previewCard} />
              <AsciiExportCard {...exportCard} />
            </div>
          }
          right={<AsciiSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
