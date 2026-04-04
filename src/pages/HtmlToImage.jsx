import SEO from "../components/SEO.jsx";
import HtmlErrorBanner from "../components/html-to-image/HtmlErrorBanner.jsx";
import HtmlExportCard from "../components/html-to-image/HtmlExportCard.jsx";
import HtmlPreviewCard from "../components/html-to-image/HtmlPreviewCard.jsx";
import HtmlSettingsCard from "../components/html-to-image/HtmlSettingsCard.jsx";
import HtmlToImageLayout from "../components/html-to-image/HtmlToImageLayout.jsx";
import HtmlTopBar from "../components/html-to-image/HtmlTopBar.jsx";
import useHtmlToImage from "../hooks/html-to-image/useHtmlToImage.js";

export default function HtmlToImage() {
  const { error, exportCard, previewCard, settingsCard } = useHtmlToImage();

  return (
    <>
      <SEO pageKey="html-to-image" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fade-in"
        style={{ maxWidth: "1520px", margin: "0 auto" }}
      >
        <HtmlTopBar />
        <HtmlErrorBanner error={error} />

        <HtmlToImageLayout
          left={
            <div className="space-y-4">
              <HtmlPreviewCard {...previewCard} />
              <HtmlExportCard {...exportCard} />
            </div>
          }
          right={<HtmlSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
