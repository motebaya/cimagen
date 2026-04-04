export default function PaperWriterSettingsCard({ onTextChange, text }) {
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
        className="space-y-3 pt-1 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Your Text
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={14}
          className="w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none focus:outline-none"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {text.length} characters
        </p>
      </div>
    </div>
  );
}
