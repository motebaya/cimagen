import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  CreditCard,
  FileImage,
  FileText,
  FileType,
  Heart,
  Image,
  Info,
  Layers,
  Palette,
  ScanText,
  Shuffle,
  Sliders,
  Smartphone,
  Sparkles,
  Skull,
} from "lucide-react";
import LazyImage from "../components/LazyImage.jsx";
import SEO from "../components/SEO.jsx";
import ToolSearch from "../components/ToolSearch.jsx";
import tools from "../content/tools.js";

const ICONS = {
  image: Image,
  barChart3: BarChart3,
  palette: Palette,
  info: Info,
  skull: Skull,
  fileText: FileText,
  creditCard: CreditCard,
  sparkles: Sparkles,
  heart: Heart,
  fileImage: FileImage,
  fileType: FileType,
  layers: Layers,
  sliders: Sliders,
  scanText: ScanText,
  smartphone: Smartphone,
};

function shuffleTools(list) {
  const next = [...list];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export default function Home() {
  const [isRandomized, setIsRandomized] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayedTools = useMemo(
    () => (isRandomized ? shuffleTools(tools) : tools),
    [isRandomized],
  );

  return (
    <>
      <SEO pageKey="home" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
        <div className="text-center mb-12 sm:mb-14">
          <h1
            className="text-[3.4rem] sm:text-[4.6rem] lg:text-[5.35rem] leading-[0.92] tracking-[-0.055em] mb-4"
            style={{
              color: "var(--text-primary)",
              fontFamily: '"InkfreeBrand", "DatatypeHero", sans-serif',
            }}
          >
            CimaGen
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Ready-to-use client-side image tools for conversion, cleanup, and
            creative processing. Fast in the browser, private by default, with{" "}
            {tools.length}+ tools ready to open.
          </p>

          <ToolSearch tools={tools} />

          <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Found a bug or have an idea for a new tool?{" "}
            <a
              href="https://github.com/motebaya/cimagen/issues"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Share it on GitHub Issues
            </a>
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsRandomized((current) => !current)}
            className="inline-flex items-center gap-3 h-10 rounded-xl border px-3 text-left cursor-pointer"
            style={{
              borderColor: isRandomized
                ? "rgba(76, 110, 245, 0.34)"
                : "var(--border-color)",
              backgroundColor: isRandomized
                ? "rgba(76, 110, 245, 0.06)"
                : "var(--card-bg)",
              color: "var(--text-primary)",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-md"
              style={{
                backgroundColor: isRandomized
                  ? "rgba(76, 110, 245, 0.12)"
                  : "var(--bg-tertiary)",
                color: isRandomized
                  ? "var(--color-primary-700)"
                  : "var(--text-tertiary)",
              }}
            >
              <Shuffle size={14} />
            </span>

            <span className="text-sm font-medium">Shuffle</span>

            <span
              className="relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors"
              style={{
                backgroundColor: isRandomized
                  ? "var(--color-primary-600)"
                  : "#cbd5e1",
              }}
            >
              <span
                className="absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white transition-transform duration-200"
                style={{
                  transform: isRandomized
                    ? "translateX(16px)"
                    : "translateX(0)",
                }}
              />
            </span>
          </button>

          <a
            href="https://github.com/motebaya"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-10 rounded-xl border px-3 text-sm font-medium no-underline"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--card-bg)",
              color: "var(--text-secondary)",
            }}
          >
            <Info size={15} />
            About
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool) => {
            const Icon = ICONS[tool.icon] || Image;

            return (
              <Link
                key={tool.id}
                to={tool.href}
                className="group block rounded-xl border overflow-hidden transition-all duration-200 no-underline"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "rgba(76, 110, 245, 0.34)",
                  boxShadow:
                    "0 0 0 1px rgba(76, 110, 245, 0.08), var(--card-shadow)",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(76, 110, 245, 0.18), var(--card-shadow-hover)";
                  event.currentTarget.style.borderColor =
                    "var(--color-primary-500)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(76, 110, 245, 0.08), var(--card-shadow)";
                  event.currentTarget.style.borderColor =
                    "rgba(76, 110, 245, 0.34)";
                }}
              >
                <LazyImage
                  src={tool.thumbnail}
                  alt={tool.title}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                />

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(76, 110, 245, 0.08)",
                        borderColor: "rgba(76, 110, 245, 0.18)",
                        color: "var(--color-primary-700)",
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <h2
                      className="text-lg font-semibold m-0 leading-6"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {tool.title}
                    </h2>
                  </div>

                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-primary-700)" }}
                    >
                      Open tool
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: "var(--color-primary-700)" }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-200 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
        style={{
          borderColor: "rgba(76, 110, 245, 0.42)",
          backgroundColor: "var(--color-primary-600)",
          boxShadow: "0 10px 24px rgba(76, 110, 245, 0.28)",
          color: "#ffffff",
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
