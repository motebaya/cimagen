import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AsciiTopBar() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium no-underline transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = "var(--color-primary-500)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Image to ASCII Converter
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Browser port of the Python ASCII converter with terminal-style
          preview, configurable character ramps, and direct export to text or
          image.
        </p>
      </div>
    </>
  );
}
