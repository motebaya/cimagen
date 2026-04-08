import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function BlueArchiveLogoTopBar() {
  return (
    <>
      <CreatorTopBar />

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          BlueArchive Logo Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Generate the Blue Archive style wordmark locally with adjustable halo
          and cross positioning.
        </p>
      </div>
    </>
  );
}
