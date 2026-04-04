import SEO from "../components/SEO.jsx";
import PokemonCardExportCard from "../components/pokemon-card-creator/PokemonCardExportCard.jsx";
import PokemonCardLayout from "../components/pokemon-card-creator/PokemonCardLayout.jsx";
import PokemonCardPreviewCard from "../components/pokemon-card-creator/PokemonCardPreviewCard.jsx";
import PokemonCardSettingsCard from "../components/pokemon-card-creator/PokemonCardSettingsCard.jsx";
import PokemonCardTopBar from "../components/pokemon-card-creator/PokemonCardTopBar.jsx";
import usePokemonCardCreator from "../hooks/pokemon-card-creator/usePokemonCardCreator.js";

export default function PokemonCardCreator() {
  const {
    exportCanvasRef,
    exportCard,
    historyPanel,
    pageState,
    previewCard,
    settingsCard,
  } = usePokemonCardCreator();

  return (
    <>
      <SEO pageKey="pokemonCardCreator" />
      <div
        className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
        style={{ maxWidth: "1760px", margin: "0 auto" }}
      >
        <PokemonCardTopBar historyPanel={historyPanel} />
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Pokémon Card Generator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create custom Pokémon-style trading cards.
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
        <PokemonCardLayout
          left={<PokemonCardPreviewCard {...previewCard} />}
          right={
            <>
              <PokemonCardSettingsCard {...settingsCard} />
              <PokemonCardExportCard {...exportCard} />
            </>
          }
        />
        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </>
  );
}
