import SEO from "../components/SEO.jsx";
import BackgroundRemoverErrorBanner from "../components/background-remover/BackgroundRemoverErrorBanner.jsx";
import BackgroundRemoverLayout from "../components/background-remover/BackgroundRemoverLayout.jsx";
import BackgroundRemoverSettings from "../components/background-remover/BackgroundRemoverSettings.jsx";
import BackgroundRemoverTopBar from "../components/background-remover/BackgroundRemoverTopBar.jsx";
import BeforeAfterPreview from "../components/background-remover/BeforeAfterPreview.jsx";
import useBackgroundRemover from "../hooks/background-remover/useBackgroundRemover.js";

export default function BackgroundRemover() {
  const { error, comparisonPreview, settingsPanel } = useBackgroundRemover();

  return (
    <>
      <SEO pageKey="background-remover" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1680px", margin: "0 auto" }}
      >
        <BackgroundRemoverTopBar />
        <BackgroundRemoverErrorBanner error={error} />

        <BackgroundRemoverLayout
          left={<BeforeAfterPreview {...comparisonPreview} />}
          right={<BackgroundRemoverSettings {...settingsPanel} />}
        />
      </div>
    </>
  );
}
