export default function MemeImageControls({ layer }) {
  return (
    <div
      className="rounded-lg border px-3 py-3 text-sm"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-tertiary)",
      }}
    >
      <div
        className="font-medium mb-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {layer.fileName || "Image layer"}
      </div>
      Resize and rotate this layer directly on the preview area.
    </div>
  );
}
