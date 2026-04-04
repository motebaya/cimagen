import SEO from "../components/SEO.jsx";
import AdvancedCropperErrorBanner from "../components/advanced-cropper/AdvancedCropperErrorBanner.jsx";
import AdvancedCropperHeader from "../components/advanced-cropper/AdvancedCropperHeader.jsx";
import CropSettingsCard from "../components/advanced-cropper/CropSettingsCard.jsx";
import CropTypeCard from "../components/advanced-cropper/CropTypeCard.jsx";
import ExportCard from "../components/advanced-cropper/ExportCard.jsx";
import ImagePreviewCard from "../components/advanced-cropper/ImagePreviewCard.jsx";
import useAdvancedCropper from "../hooks/advanced-cropper/useAdvancedCropper.js";

export default function AdvancedCropper() {
  const { error, previewCard, cropTypeCard, settingsCard, exportCard } =
    useAdvancedCropper();

  return (
    <>
      <SEO pageKey="advanced-cropper" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fade-in"
        style={{ maxWidth: "1420px", margin: "0 auto" }}
      >
        <AdvancedCropperHeader />
        <AdvancedCropperErrorBanner error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_360px] gap-6 items-start">
          <div className="space-y-4 min-w-0">
            <ImagePreviewCard {...previewCard} />
            <CropTypeCard {...cropTypeCard} />
            <ExportCard {...exportCard} />
          </div>

          <div className="lg:self-start">
            <CropSettingsCard {...settingsCard} />
          </div>
        </div>
      </div>
    </>
  );
}
