import { Link } from "react-router-dom";
import { ArrowRight, Image, BarChart3, Palette } from "lucide-react";
import LazyImage from "../components/LazyImage.jsx";

const BASE = import.meta.env.BASE_URL;

const tools = [
  {
    id: "thumbnail",
    title: "Thumbnail Generator",
    description:
      "Generate thumbnail images with centered text and colored backgrounds. Perfect for blog posts, social media, and content previews.",
    preview: `${BASE}images/sample-thumbnail.webp`,
    path: "/thumbnail-creator",
    icon: Image,
  },
  {
    id: "statistic-frame",
    title: "Statistic Frame Generator",
    description:
      "Create statistic overlay frames on background images with customizable text. Great for sharing achievement milestones.",
    preview: `${BASE}images/sample-statistic.webp`,
    path: "/statistic-frame-creator",
    icon: BarChart3,
  },
  {
    id: "duotone",
    title: "Duotone Generator",
    description:
      "Convert images into a Pink \u00d7 Green duotone effect. Choose from multiple filter modes including Classic, Reverse, and combined variants.",
    preview: `${BASE}images/sample-duotone.webp`,
    path: "/duotone-creator",
    icon: Palette,
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Image Generator
        </h1>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Client-side image processing tools. Everything runs in your browser —
          no uploads, no servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group block rounded-2xl border overflow-hidden transition-all duration-300 no-underline"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--card-shadow-hover)";
              e.currentTarget.style.borderColor = "var(--color-primary-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--card-shadow)";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            <LazyImage
              src={tool.preview}
              alt={tool.title}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-primary-600)" }}
                >
                  <tool.icon size={20} color="#fff" />
                </div>
                <h2
                  className="text-xl font-semibold m-0"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tool.title}
                </h2>
              </div>

              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {tool.description}
              </p>

              <div
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group-hover:gap-3"
                style={{
                  backgroundColor: "var(--color-primary-600)",
                  color: "#ffffff",
                }}
              >
                Create
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
