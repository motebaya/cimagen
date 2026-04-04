import SEO from "../components/SEO.jsx";
import FaceBlurErrorBanner from "../components/face-blur/FaceBlurErrorBanner.jsx";
import FaceBlurLayout from "../components/face-blur/FaceBlurLayout.jsx";
import FaceBlurPreviewCard from "../components/face-blur/FaceBlurPreviewCard.jsx";
import FaceBlurResultDetailsCard from "../components/face-blur/FaceBlurResultDetailsCard.jsx";
import FaceBlurSettingsCard from "../components/face-blur/FaceBlurSettingsCard.jsx";
import FaceBlurTopBar from "../components/face-blur/FaceBlurTopBar.jsx";
import useFaceBlur from "../hooks/face-blur/useFaceBlur.js";

export default function FaceBlurTool() {
  const { error, previewCard, settingsCard, resultDetailsCard } = useFaceBlur();

  return (
    <>
      <SEO pageKey="face-blur" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <FaceBlurTopBar />
        <FaceBlurErrorBanner error={error} />

        <FaceBlurLayout
          left={<FaceBlurPreviewCard {...previewCard} />}
          right={
            <div className="space-y-4">
              <FaceBlurSettingsCard {...settingsCard} />
              <FaceBlurResultDetailsCard {...resultDetailsCard} />
            </div>
          }
        />
      </div>
    </>
  );
}
