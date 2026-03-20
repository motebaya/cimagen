import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { Sun, Moon, ImageIcon } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: "var(--color-primary-600)" }}
            >
              <ImageIcon size={20} color="#fff" strokeWidth={2} />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ImgGen
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
