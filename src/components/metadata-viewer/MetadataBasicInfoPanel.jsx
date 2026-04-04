export default function MetadataBasicInfoPanel({ badges, details }) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {details.map((detail) => (
          <div
            key={detail.id}
            className="rounded-lg border px-3 py-3 min-w-0"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <p
              className="text-xs m-0 mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              {detail.label}
            </p>

            {detail.tone ? (
              <span
                className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold"
                style={detail.tone}
              >
                {detail.value}
              </span>
            ) : (
              <p
                className="text-sm font-semibold m-0 break-all"
                style={{ color: "var(--text-primary)" }}
              >
                {detail.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {badges.length ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
              style={badge.tone}
            >
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
