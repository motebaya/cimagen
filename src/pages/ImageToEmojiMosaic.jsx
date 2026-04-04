import SEO from "../components/SEO.jsx";
import EmojiExportCard from "../components/image-to-emoji-mosaic/EmojiExportCard.jsx";
import EmojiMosaicErrorBanner from "../components/image-to-emoji-mosaic/EmojiMosaicErrorBanner.jsx";
import EmojiMosaicPreviewCard from "../components/image-to-emoji-mosaic/EmojiMosaicPreviewCard.jsx";
import EmojiMosaicSettingsCard from "../components/image-to-emoji-mosaic/EmojiMosaicSettingsCard.jsx";
import EmojiMosaicTopBar from "../components/image-to-emoji-mosaic/EmojiMosaicTopBar.jsx";
import ImageToEmojiMosaicLayout from "../components/image-to-emoji-mosaic/ImageToEmojiMosaicLayout.jsx";
import useImageToEmojiMosaic from "../hooks/image-to-emoji-mosaic/useImageToEmojiMosaic.js";

export default function ImageToEmojiMosaic() {
  const { error, exportCard, previewCard, settingsCard } =
    useImageToEmojiMosaic();

  return (
    <>
      <SEO pageKey="image-to-emoji-mosaic" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <EmojiMosaicTopBar />
        <EmojiMosaicErrorBanner error={error} />

        <ImageToEmojiMosaicLayout
          left={
            <div className="space-y-4">
              <EmojiMosaicPreviewCard {...previewCard} />
              <EmojiExportCard {...exportCard} />
            </div>
          }
          right={<EmojiMosaicSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
