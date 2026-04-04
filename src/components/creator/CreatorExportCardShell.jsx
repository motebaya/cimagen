export default function CreatorExportCardShell({
  children,
  description,
  metadata = [],
  title = "Export / Download",
}) {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
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
          {title}
        </h2>
        {description ? (
          <p
            className="text-xs mt-1 m-0"
            style={{ color: "var(--text-tertiary)" }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {metadata.length ? (
        <div className="grid grid-cols-2 gap-3">
          {metadata.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border px-3 py-3"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-xs m-0 mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {label}
              </p>
              <p
                className="text-sm font-semibold m-0 break-all"
                style={{ color: "var(--text-primary)" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}
