import { AlertCircle } from "lucide-react";

export default function OcrReaderErrorBanner({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div
      className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
      style={{
        backgroundColor: "rgba(239, 68, 68, 0.08)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        color: "#ef4444",
      }}
    >
      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );
}
