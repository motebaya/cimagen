import SEO from "../components/SEO.jsx";
import MemeErrorBanner from "../components/meme-generator/MemeErrorBanner.jsx";
import MemeLayersPanel from "../components/meme-generator/MemeLayersPanel.jsx";
import MemePageHeader from "../components/meme-generator/MemePageHeader.jsx";
import MemePreviewSection from "../components/meme-generator/MemePreviewSection.jsx";
import MemeTemplateGallery from "../components/meme-generator/MemeTemplateGallery.jsx";
import MemeToolbar from "../components/meme-generator/MemeToolbar.jsx";
import useMemeEditor from "../hooks/meme-generator/useMemeEditor.js";

export default function MemeGenerator() {
  const { error, hasTemplate, preview, templateGallery, toolbar, layersPanel } =
    useMemeEditor();

  const gridClass = hasTemplate
    ? "grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_340px_360px] gap-6 items-start"
    : "grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_340px] gap-6 items-start";

  return (
    <>
      <SEO pageKey="meme-generator" />

      <div
        className="w-full px-3 sm:px-5 lg:px-6 py-6 animate-fade-in"
        style={{ maxWidth: "1840px", margin: "0 auto" }}
      >
        <MemePageHeader />
        <MemeErrorBanner message={error} />

        <div className={gridClass}>
          <div className="space-y-4 xl:min-w-0">
            <MemePreviewSection {...preview} />
            {hasTemplate && <MemeToolbar {...toolbar} />}
          </div>

          <div className="xl:self-start">
            <MemeTemplateGallery {...templateGallery} />
          </div>

          {hasTemplate && (
            <div className="xl:self-start">
              <MemeLayersPanel {...layersPanel} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
