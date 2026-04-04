import { Copyright, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="sm:hidden flex items-center justify-center text-xs whitespace-nowrap" style={{ color: "var(--text-tertiary)" }}>
          <span
            style={{
              color: "var(--text-primary)",
              fontFamily: '"DMSansBrand", "SpaceGrotesk", sans-serif',
            }}
          >
            cimagen
          </span>
          <span className="mx-2">-</span>
          <Copyright size={12} className="mr-1" />
          <span>{currentYear}</span>
          <a
            href="https://github.com/motebaya"
            target="_blank"
            rel="noreferrer"
            className="ml-1.5 no-underline"
            style={{ color: "inherit" }}
          >
            motebaya
          </a>
        </div>

        <div className="hidden sm:flex items-center justify-between gap-4 text-sm">
          <div className="text-left">
            <p
              className="m-0 mb-1 text-base tracking-[-0.02em]"
              style={{
                color: "var(--text-primary)",
                fontFamily: '"DMSansBrand", "SpaceGrotesk", sans-serif',
              }}
            >
              cimagen
            </p>

            <div className="inline-flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
              <Copyright size={14} />
              <span>{currentYear}</span>
              <span>motebaya</span>
            </div>
          </div>

          <a
            href="https://github.com/motebaya"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 no-underline"
            style={{ color: "var(--text-secondary)" }}
          >
            <Github size={15} />
            <span>github.com/motebaya</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
