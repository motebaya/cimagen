export default function StatisticFrameSettingsCard({
  bottomText,
  onBottomTextChange,
  onTopTextChange,
  topText,
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
            Top Text
          </label>
          <input
            type="text"
            value={topText}
            onChange={(event) => onTopTextChange(event.target.value)}
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
            Bottom Text
          </label>
          <input
            type="text"
            value={bottomText}
            onChange={(event) => onBottomTextChange(event.target.value)}
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
