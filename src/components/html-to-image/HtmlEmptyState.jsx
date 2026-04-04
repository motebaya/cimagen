import { LayoutTemplate } from "lucide-react";

export default function HtmlEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-28">
      <LayoutTemplate
        size={56}
        className="mb-3 opacity-35"
        style={{ color: "var(--text-tertiary)" }}
      />
      <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
        Render preview appears here
      </p>
    </div>
  );
}
