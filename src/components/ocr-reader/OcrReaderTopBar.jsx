import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function OcrReaderTopBar() {
  return (
    <>
      <CreatorTopBar />

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          OCR Reader
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Extract editable text from images with live OCR processing and quick
          export tools.
        </p>
      </div>
    </>
  );
}
