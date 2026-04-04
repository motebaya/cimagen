import SEO from "../components/SEO.jsx";
import ImageUpscalerErrorBanner from "../components/image-upscaler/ImageUpscalerErrorBanner.jsx";
import ImageUpscalerLayout from "../components/image-upscaler/ImageUpscalerLayout.jsx";
import UpscalerPreviewCard from "../components/image-upscaler/UpscalerPreviewCard.jsx";
import UpscalerResultDetailsCard from "../components/image-upscaler/UpscalerResultDetailsCard.jsx";
import UpscalerSettingsCard from "../components/image-upscaler/UpscalerSettingsCard.jsx";
import UpscalerTopBar from "../components/image-upscaler/UpscalerTopBar.jsx";
import useImageUpscaler from "../hooks/image-upscaler/useImageUpscaler.js";

export default function ImageUpscaler() {
  const { error, previewCard, resultDetailsCard, settingsCard } =
    useImageUpscaler();

  return (
    <>
      <SEO pageKey="image-upscaler" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <UpscalerTopBar />
        <ImageUpscalerErrorBanner error={error} />

        <ImageUpscalerLayout
          left={
            <div className="space-y-4">
              <UpscalerPreviewCard {...previewCard} />
              <UpscalerResultDetailsCard {...resultDetailsCard} />
            </div>
          }
          right={<UpscalerSettingsCard {...settingsCard} />}
        />
      </div>
    </>
  );
}
