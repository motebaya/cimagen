import SEO from "../components/SEO.jsx";
import ColorPaletteExtractorLayout from "../components/color-palette-extractor/ColorPaletteExtractorLayout.jsx";
import PaletteErrorBanner from "../components/color-palette-extractor/PaletteErrorBanner.jsx";
import PaletteExportCard from "../components/color-palette-extractor/PaletteExportCard.jsx";
import PalettePreviewCard from "../components/color-palette-extractor/PalettePreviewCard.jsx";
import PaletteSettingsCard from "../components/color-palette-extractor/PaletteSettingsCard.jsx";
import PaletteTopBar from "../components/color-palette-extractor/PaletteTopBar.jsx";
import useColorPaletteExtractor from "../hooks/color-palette-extractor/useColorPaletteExtractor.js";

export default function ColorPaletteExtractor() {
  const { error, exportCard, previewCard, settingsCard } =
    useColorPaletteExtractor();

  return (
    <>
      <SEO pageKey="colorPaletteExtractor" />

      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <PaletteTopBar />
        <PaletteErrorBanner error={error} />

        <ColorPaletteExtractorLayout
          left={<PalettePreviewCard {...previewCard} />}
          right={
            <>
              <PaletteSettingsCard {...settingsCard} />
              <PaletteExportCard {...exportCard} />
            </>
          }
        />
      </div>
    </>
  );
}
