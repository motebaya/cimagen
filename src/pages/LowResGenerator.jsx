import LowResErrorBanner from "../components/lowres-generator/LowResErrorBanner.jsx";
import LowResExportCard from "../components/lowres-generator/LowResExportCard.jsx";
import LowResLayout from "../components/lowres-generator/LowResLayout.jsx";
import LowResPreviewCard from "../components/lowres-generator/LowResPreviewCard.jsx";
import LowResSettingsCard from "../components/lowres-generator/LowResSettingsCard.jsx";
import LowResTopBar from "../components/lowres-generator/LowResTopBar.jsx";
import useLowResGenerator from "../hooks/lowres-generator/useLowResGenerator.js";

export default function LowResGenerator() {
  const { error, exportCard, previewCard, settingsCard } = useLowResGenerator();

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
      style={{ maxWidth: "1760px", margin: "0 auto" }}
    >
      <LowResTopBar />
      <LowResErrorBanner error={error} />

      <LowResLayout
        left={<LowResPreviewCard {...previewCard} />}
        right={
          <div className="space-y-4">
            <LowResSettingsCard {...settingsCard} />
            <LowResExportCard {...exportCard} />
          </div>
        }
      />
    </div>
  );
}
