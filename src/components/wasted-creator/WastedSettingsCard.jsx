export default function WastedSettingsCard() {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <h2
        className="text-sm font-medium m-0 mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Settings
      </h2>
      <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
        The Wasted overlay uses the original GTA-style treatment automatically.
        Upload an image and export when ready.
      </p>
    </div>
  );
}
