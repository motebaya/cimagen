import { FileText } from "lucide-react";

export default function PdfPreviewPane({ previewUrls }) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          PDF Preview
        </p>
        <p
          className="text-xs mt-1 mb-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          Preview updates automatically as you change settings.
        </p>
      </div>

      {previewUrls.length ? (
        <div
          className="p-4 space-y-4 max-h-[820px] overflow-y-auto"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          {previewUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative">
              <div
                className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.78)",
                  color: "#ffffff",
                }}
              >
                Page {index + 1}
              </div>
              <img
                src={url}
                alt={`PDF preview page ${index + 1}`}
                className="w-full h-auto"
                style={{
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center min-h-[520px]"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <FileText
            size={48}
            style={{ color: "var(--text-tertiary)" }}
            className="mb-3 opacity-40"
          />
          <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
            Upload images to see preview
          </p>
        </div>
      )}
    </div>
  );
}
