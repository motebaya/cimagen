import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { Moon, Sun } from "lucide-react";

function BrandMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 4.75H6.75a2 2 0 0 0-2 2V8M16 4.75h1.25a2 2 0 0 1 2 2V8M16 19.25h1.25a2 2 0 0 0 2-2V16M8 19.25H6.75a2 2 0 0 1-2-2V16"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="7.25"
        y="7.25"
        width="9.5"
        height="9.5"
        rx="2.6"
        stroke="#ffffff"
        strokeWidth="1.8"
      />
      <path
        d="M9.7 14.35 11.9 11.9a1 1 0 0 1 1.49-.01l2.65 2.92"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.9" cy="10.25" r="1.1" fill="#ffffff" />
      <path
        d="M18.2 5.6v2.4M17 6.8h2.4"
        stroke="#dbe4ff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isWidePage = location.pathname === "/watermark-tool";

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className={`${isWidePage ? "max-w-[1840px]" : "max-w-7xl"} mx-auto px-3 sm:px-5 lg:px-6`}
      >
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-[1.03]"
              style={{
                backgroundColor: "var(--color-primary-600)",
                borderColor: "rgba(255,255,255,0.18)",
                boxShadow: "0 6px 14px rgba(76, 110, 245, 0.22)",
              }}
            >
              <BrandMark />
            </div>
            <span
              className="text-[1.02rem] font-semibold tracking-[-0.03em]"
              style={{
                color: "var(--text-primary)",
                fontFamily: '"InkfreeBrand", "DMSansBrand", sans-serif',
              }}
            >
              cimagen
            </span>
          </Link>

          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full border transition-all duration-300 cursor-pointer focus:outline-none"
            style={{
              backgroundColor:
                theme === "dark"
                  ? "var(--color-primary-700)"
                  : "var(--bg-tertiary)",
              borderColor:
                theme === "dark"
                  ? "var(--color-primary-600)"
                  : "var(--border-color)",
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <div
              className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
              style={{
                left: theme === "dark" ? "calc(100% - 26px)" : "2px",
                backgroundColor: theme === "dark" ? "#1e1b4b" : "#ffffff",
              }}
            >
              {theme === "dark" ? (
                <Moon size={13} color="#a5b4fc" strokeWidth={2.5} />
              ) : (
                <Sun size={13} color="#f59e0b" strokeWidth={2.5} />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
