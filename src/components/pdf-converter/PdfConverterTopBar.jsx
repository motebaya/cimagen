import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function PdfConverterTopBar() {
  return (
    <>
      <CreatorTopBar />

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          PDF Converter
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Arrange multiple images, tune the page setup, and export everything as
          one PDF.
        </p>
      </div>
    </>
  );
}
