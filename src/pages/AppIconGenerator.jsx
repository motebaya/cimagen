import SEO from "../components/SEO.jsx";
import AppIconExportCard from "../components/app-icon-generator/AppIconExportCard.jsx";
import AppIconLayout from "../components/app-icon-generator/AppIconLayout.jsx";
import AppIconPreviewCard from "../components/app-icon-generator/AppIconPreviewCard.jsx";
import AppIconSettingsCard from "../components/app-icon-generator/AppIconSettingsCard.jsx";
import AppIconTopBar from "../components/app-icon-generator/AppIconTopBar.jsx";
import useAppIconGenerator from "../hooks/app-icon-generator/useAppIconGenerator.js";

export default function AppIconGenerator() {
  const { exportCard, pageState, previewCard, settingsCard } =
    useAppIconGenerator();
  return (
    <>
      <SEO pageKey="appIconGenerator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <AppIconTopBar />
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            App Icon Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Generate Android and iOS app icons with proper directory structure.
          </p>
        </div>
        {pageState.error && (
          <div
            className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
            }}
          >
            <span>{pageState.error}</span>
          </div>
        )}
        <AppIconLayout
          left={<AppIconPreviewCard {...previewCard} />}
          right={
            <>
              <AppIconSettingsCard {...settingsCard} />
              <AppIconExportCard {...exportCard} />
            </>
          }
        />
      </div>
    </>
  );
}
