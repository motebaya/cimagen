import { Link } from "react-router-dom";
import {
  ArrowRight,
  Image,
  BarChart3,
  Palette,
  Info,
  Skull,
  FileText,
  CreditCard,
  Sparkles,
  Heart,
  FileImage,
  FileType,
  Layers,
  Sliders,
  ScanText,
  Smartphone,
} from "lucide-react";
import LazyImage from "../components/LazyImage.jsx";
import SEO from "../components/SEO.jsx";

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
      "Convert images into a Pink × Green duotone effect. Choose from multiple filter modes including Classic, Reverse, and combined variants.",
    preview: `${BASE}images/sample-duotone.webp`,
    path: "/duotone-creator",
    icon: Palette,
  },
  {
    id: "metadata",
    title: "Metadata Viewer",
    description:
      "Extract and view EXIF metadata from images. Check GPS location, camera info, and download cleaned images without metadata.",
    preview: `${BASE}images/sample-metadata.webp`,
    path: "/metadata-viewer",
    icon: Info,
  },
  {
    id: "blackpink",
    title: "Blackpink Text",
    description:
      "Create pink text on black background with border effect. Perfect for stylish text graphics and social media posts.",
    preview: `${BASE}images/sample-blackpink.webp`,
    path: "/blackpink-creator",
    icon: Heart,
  },
  {
    id: "wasted",
    title: "Wasted Generator",
    description:
      "Add GTA-style 'wasted' overlay to your images. Converts to grayscale and adds the iconic red text effect.",
    preview: `${BASE}images/sample-wasted.webp`,
    path: "/wasted-creator",
    icon: Skull,
  },
  {
    id: "phlogo",
    title: "P*or*n Hub Logo",
    description:
      "Create custom logo with white text, orange box, and rounded image. Parody generator for memes and jokes.",
    preview: `${BASE}images/sample-phlogo.webp`,
    path: "/phlogo-creator",
    icon: Sparkles,
  },
  {
    id: "paperwriter",
    title: "Paper Writer",
    description:
      "Convert text to handwritten-style paper pages. Automatically splits long text into multiple lined paper sheets.",
    preview: `${BASE}images/sample-handwritten.webp`,
    path: "/paperwriter-creator",
    icon: FileText,
  },
  {
    id: "pokemoncard",
    title: "Pokémon Card",
    description:
      "Create custom Pokémon-style trading cards. Choose from 4 templates with smart image cropping and text layout.",
    preview: `${BASE}images/sample-pokemoncard.webp`,
    path: "/pokemon-card-creator",
    icon: CreditCard,
  },
  {
    id: "ico-converter",
    title: "Image to ICO",
    description:
      "Convert images to .ico format with multiple sizes. Perfect for creating favicons with automatic square cropping.",
    preview: `${BASE}images/sample-imagetoico.webp`,
    path: "/ico-converter",
    icon: FileImage,
  },
  {
    id: "pdf-converter",
    title: "Image to PDF",
    description:
      "Convert multiple images to a single PDF document. Drag to reorder, rotate pages, and customize layout settings.",
    preview: `${BASE}images/sample-imagetopdf.webp`,
    path: "/pdf-converter",
    icon: FileType,
  },
  {
    id: "svg-converter",
    title: "Image to SVG",
    description:
      "Convert raster images to vector SVG format. Choose between Logo mode (clean) or Photo mode (posterized).",
    preview: `${BASE}images/sample-imagetosvg.webp`,
    path: "/svg-converter",
    icon: Layers,
  },
  {
    id: "lowres-generator",
    title: "Low-Res Generator",
    description:
      "Simulate realistic low-quality degraded images with JPEG artifacts, blur, and color reduction. Compare before/after.",
    preview: `${BASE}images/sample-lowress.webp`,
    path: "/lowres-generator",
    icon: Sliders,
  },
  {
    id: "ocr-reader",
    title: "Image OCR Reader",
    description:
      "Extract text from images using optical character recognition. Supports English and Indonesian with preprocessing.",
    preview: `${BASE}images/sample-imageocr.webp`,
    path: "/ocr-reader",
    icon: ScanText,
  },
  {
    id: "app-icon-generator",
    title: "App Icon Generator",
    description:
      "Generate Android and iOS app icons with proper directory structure. Includes adaptive icons, round icons, and all required sizes.",
    preview: `${BASE}images/sample-appicons.webp`,
    path: "/app-icon-generator",
    icon: Smartphone,
  },
];

export default function Home() {
  return (
    <>
      <SEO pageKey="home" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            CimaGen
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Client-side Image processing tools and Generator. Everything runs in
            your browser, no uploads, no servers. More than 14 image tools are
            ready to use.
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
    </>
  );
}
