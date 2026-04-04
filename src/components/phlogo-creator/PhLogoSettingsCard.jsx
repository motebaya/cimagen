export default function PhLogoSettingsCard({
  onText1Change,
  onText2Change,
  text1,
  text2,
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-5"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div>
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Settings
        </h2>
      </div>
      <div
        className="space-y-5 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Left Text (White)
          </label>
          <input
            type="text"
            value={text1}
            onChange={(e) => onText1Change(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Right Text (Orange Box)
          </label>
          <input
            type="text"
            value={text2}
            onChange={(e) => onText2Change(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
