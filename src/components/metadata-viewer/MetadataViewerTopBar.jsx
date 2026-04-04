import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function MetadataViewerTopBar() {
  return (
    <>
      <CreatorTopBar />

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Metadata Viewer
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Inspect image metadata with live parser switching, structured results,
          and quick export tools.
        </p>
      </div>
    </>
  );
}
