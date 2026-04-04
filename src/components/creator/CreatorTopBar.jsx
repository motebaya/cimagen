import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorTopBar({ right = null }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
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

      {right ? <div className="flex-shrink-0">{right}</div> : <div />}
    </div>
  );
}
