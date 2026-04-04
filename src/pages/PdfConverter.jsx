import SEO from "../components/SEO.jsx";
import PdfConverterErrorBanner from "../components/pdf-converter/PdfConverterErrorBanner.jsx";
import PdfConverterLayout from "../components/pdf-converter/PdfConverterLayout.jsx";
import PdfConverterTopBar from "../components/pdf-converter/PdfConverterTopBar.jsx";
import PdfExportCard from "../components/pdf-converter/PdfExportCard.jsx";
import PdfPreviewCard from "../components/pdf-converter/PdfPreviewCard.jsx";
import PdfSettingsCard from "../components/pdf-converter/PdfSettingsCard.jsx";
import usePdfConverter from "../hooks/pdf-converter/usePdfConverter.js";

export default function PdfConverter() {
  const { error, exportCard, previewCard, settingsCard } = usePdfConverter();

  return (
    <>
      <SEO pageKey="pdfConverter" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1840px", margin: "0 auto" }}
      >
        <PdfConverterTopBar />
        <PdfConverterErrorBanner error={error} />

        <PdfConverterLayout
          left={<PdfPreviewCard {...previewCard} />}
          right={
            <div className="space-y-4">
              <PdfSettingsCard {...settingsCard} />
              <PdfExportCard {...exportCard} />
            </div>
          }
        />
      </div>
    </>
  );
}
