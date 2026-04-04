import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function LowResTopBar() {
  return (
    <>
      <CreatorTopBar />

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Low-Resolution Generator
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Simulate compression, blur, and reduced color depth with a live before
          and after comparison.
        </p>
      </div>
    </>
  );
}
