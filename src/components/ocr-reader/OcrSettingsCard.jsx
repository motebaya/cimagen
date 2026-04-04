import OcrSelect from "./OcrSelect.jsx";

export default function OcrSettingsCard({
  language,
  languageOption,
  languageOptions,
  onLanguageChange,
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
        className="pt-1 border-t space-y-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div
          className="rounded-lg border px-3 py-3"
          style={{
            borderColor: "rgba(92, 124, 250, 0.18)",
            backgroundColor: "rgba(92, 124, 250, 0.06)",
          }}
        >
          <p
            className="text-xs font-semibold m-0"
            style={{ color: "var(--color-primary-600)" }}
          >
            What language should OCR expect?
          </p>
          <p
            className="text-sm font-medium mt-2 mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {languageOption.label}
          </p>
          <p
            className="text-xs m-0 leading-5"
            style={{ color: "var(--text-secondary)" }}
          >
            {languageOption.helper}
          </p>
        </div>

        <OcrSelect
          label="Language"
          options={languageOptions}
          value={language}
          onChange={onLanguageChange}
        />

        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          Switching languages reruns OCR automatically using the currently
          uploaded image.
        </p>
      </div>
    </div>
  );
}
