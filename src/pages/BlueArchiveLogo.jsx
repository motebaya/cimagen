import SEO from "../components/SEO.jsx";
import BlueArchiveLogoErrorBanner from "../components/bluearchive-logo/BlueArchiveLogoErrorBanner.jsx";
import BlueArchiveLogoExportCard from "../components/bluearchive-logo/BlueArchiveLogoExportCard.jsx";
import BlueArchiveLogoLayout from "../components/bluearchive-logo/BlueArchiveLogoLayout.jsx";
import BlueArchiveLogoPreviewCard from "../components/bluearchive-logo/BlueArchiveLogoPreviewCard.jsx";
import BlueArchiveLogoSettingsCard from "../components/bluearchive-logo/BlueArchiveLogoSettingsCard.jsx";
import BlueArchiveLogoTopBar from "../components/bluearchive-logo/BlueArchiveLogoTopBar.jsx";
import useBlueArchiveLogo from "../hooks/bluearchive-logo/useBlueArchiveLogo.js";

export default function BlueArchiveLogo() {
  const { error, exportCanvasRef, exportCard, previewCard, settingsCard } =
    useBlueArchiveLogo();

  return (
    <>
      <SEO pageKey="bluearchive-logo" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <BlueArchiveLogoTopBar />
        <BlueArchiveLogoErrorBanner error={error} />

        <BlueArchiveLogoLayout
          left={<BlueArchiveLogoPreviewCard {...previewCard} />}
          right={
            <>
              <BlueArchiveLogoSettingsCard {...settingsCard} />
              <BlueArchiveLogoExportCard {...exportCard} />
            </>
          }
        />

        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
