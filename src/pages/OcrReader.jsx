import SEO from "../components/SEO.jsx";
import OcrExportCard from "../components/ocr-reader/OcrExportCard.jsx";
import OcrReaderErrorBanner from "../components/ocr-reader/OcrReaderErrorBanner.jsx";
import OcrReaderLayout from "../components/ocr-reader/OcrReaderLayout.jsx";
import OcrReaderTopBar from "../components/ocr-reader/OcrReaderTopBar.jsx";
import OcrResultCard from "../components/ocr-reader/OcrResultCard.jsx";
import OcrSettingsCard from "../components/ocr-reader/OcrSettingsCard.jsx";
import useOcrReader from "../hooks/ocr-reader/useOcrReader.js";

export default function OcrReader() {
  const { error, exportCard, resultCard, settingsCard } = useOcrReader();

  return (
    <>
      <SEO pageKey="ocrReader" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1840px", margin: "0 auto" }}
      >
        <OcrReaderTopBar />
        <OcrReaderErrorBanner error={error} />

        <OcrReaderLayout
          left={<OcrResultCard {...resultCard} />}
          right={
            <div className="space-y-4">
              <OcrSettingsCard {...settingsCard} />
              <OcrExportCard {...exportCard} />
            </div>
          }
        />
      </div>
    </>
  );
}
