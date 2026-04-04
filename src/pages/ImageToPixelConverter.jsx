import SEO from "../components/SEO.jsx";
import ImageToPixelLayout from "../components/image-to-pixel/ImageToPixelLayout.jsx";
import PixelErrorBanner from "../components/image-to-pixel/PixelErrorBanner.jsx";
import PixelExportCard from "../components/image-to-pixel/PixelExportCard.jsx";
import PixelPaletteCard from "../components/image-to-pixel/PixelPaletteCard.jsx";
import PixelPreviewCard from "../components/image-to-pixel/PixelPreviewCard.jsx";
import PixelSettingsCard from "../components/image-to-pixel/PixelSettingsCard.jsx";
import PixelTopBar from "../components/image-to-pixel/PixelTopBar.jsx";
import useImageToPixel from "../hooks/image-to-pixel/useImageToPixel.js";

export default function ImageToPixelConverter() {
  const { error, exportCard, paletteCard, previewCard, settingsCard } =
    useImageToPixel();

  return (
    <>
      <SEO pageKey="imageToPixel" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <PixelTopBar />
        <PixelErrorBanner error={error} />

        <ImageToPixelLayout
          left={
            <div className="space-y-4">
              <PixelPreviewCard {...previewCard} />
              {paletteCard.palette.length > 0 && (
                <PixelPaletteCard {...paletteCard} />
              )}
            </div>
          }
          right={
            <>
              <PixelSettingsCard {...settingsCard} />
              <PixelExportCard {...exportCard} />
            </>
          }
        />
      </div>
    </>
  );
}
