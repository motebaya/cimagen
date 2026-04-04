import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { loadAllFonts } from "./utils/fontLoader.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const ThumbnailCreator = lazy(() => import("./pages/ThumbnailCreator.jsx"));
const StatisticFrameCreator = lazy(
  () => import("./pages/StatisticFrameCreator.jsx"),
);
const DuotoneCreator = lazy(() => import("./pages/DuotoneCreator.jsx"));
const MetadataViewer = lazy(() => import("./pages/MetadataViewer.jsx"));
const BlackpinkCreator = lazy(() => import("./pages/BlackpinkCreator.jsx"));
const WastedCreator = lazy(() => import("./pages/WastedCreator.jsx"));
const PhLogoCreator = lazy(() => import("./pages/PhLogoCreator.jsx"));
const PaperWriterCreator = lazy(() => import("./pages/PaperWriterCreator.jsx"));
const PokemonCardCreator = lazy(() => import("./pages/PokemonCardCreator.jsx"));
const IcoConverter = lazy(() => import("./pages/IcoConverter.jsx"));
const PdfConverter = lazy(() => import("./pages/PdfConverter.jsx"));
const SvgConverter = lazy(() => import("./pages/SvgConverter.jsx"));
const LowResGenerator = lazy(() => import("./pages/LowResGenerator.jsx"));
const OcrReader = lazy(() => import("./pages/OcrReader.jsx"));
const AppIconGenerator = lazy(() => import("./pages/AppIconGenerator.jsx"));
const ImageToAsciiConverter = lazy(
  () => import("./pages/ImageToAsciiConverter.jsx"),
);
const ImageToPixelConverter = lazy(
  () => import("./pages/ImageToPixelConverter.jsx"),
);
const ColorPaletteExtractor = lazy(
  () => import("./pages/ColorPaletteExtractor.jsx"),
);
const ImageToEmojiMosaic = lazy(() => import("./pages/ImageToEmojiMosaic.jsx"));
const ImageToLineArt = lazy(() => import("./pages/ImageToLineArt.jsx"));
const ImageToAnsiArt = lazy(() => import("./pages/ImageToAnsiArt.jsx"));
const ImageUpscaler = lazy(() => import("./pages/ImageUpscaler.jsx"));
const HtmlToImage = lazy(() => import("./pages/HtmlToImage.jsx"));
const FaceBlurTool = lazy(() => import("./pages/FaceBlurTool.jsx"));
const AdvancedCropper = lazy(() => import("./pages/AdvancedCropper.jsx"));
const MemeGenerator = lazy(() => import("./pages/MemeGenerator.jsx"));
const WatermarkTool = lazy(() => import("./pages/WatermarkTool.jsx"));
const BackgroundRemover = lazy(() => import("./pages/BackgroundRemover.jsx"));

function NotFound() {
  const location = useLocation();

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-14 animate-fade-in">
      <div className="w-full max-w-3xl px-4 sm:px-6 text-center">
        <div
          className="inline-flex items-center rounded-full border px-3 py-1 text-xs mb-5"
          style={{
            borderColor: "rgba(76, 110, 245, 0.2)",
            backgroundColor: "rgba(76, 110, 245, 0.06)",
            color: "var(--color-primary-700)",
          }}
        >
          {location.pathname}
        </div>

        <h1
          className="text-[4.8rem] sm:text-[6.4rem] leading-none m-0"
          style={{
            color: "var(--text-primary)",
            fontFamily: '"DatatypeHero", "SpaceGrotesk", sans-serif',
          }}
        >
          404
        </h1>

        <p
          className="text-2xl sm:text-3xl mt-3 mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: '"DMSansBrand", "SpaceGrotesk", sans-serif',
          }}
        >
          Route not found
        </p>

        <p
          className="text-sm sm:text-base max-w-xl mx-auto mb-6 leading-7"
          style={{ color: "var(--text-tertiary)" }}
        >
          This path is not available in the current build. Check the URL or return to the homepage to open another tool.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium no-underline"
          style={{ color: "var(--color-primary-700)" }}
        >
          <ArrowLeft size={16} />
          <span>Return home</span>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: "var(--border-color)",
            borderTopColor: "transparent",
          }}
        />
        <p style={{ color: "var(--text-tertiary)" }} className="text-sm">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Preload fonts on app init so they're ready when user navigates to a creator page
  useEffect(() => {
    loadAllFonts().catch((err) => {
      console.warn("Font preloading failed (fonts will load on demand):", err);
    });
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thumbnail-creator" element={<ThumbnailCreator />} />
            <Route
              path="/statistic-frame-creator"
              element={<StatisticFrameCreator />}
            />
            <Route path="/duotone-creator" element={<DuotoneCreator />} />
            <Route path="/metadata-viewer" element={<MetadataViewer />} />
            <Route path="/blackpink-creator" element={<BlackpinkCreator />} />
            <Route path="/wasted-creator" element={<WastedCreator />} />
            <Route path="/phlogo-creator" element={<PhLogoCreator />} />
            <Route
              path="/paperwriter-creator"
              element={<PaperWriterCreator />}
            />
            <Route
              path="/pokemon-card-creator"
              element={<PokemonCardCreator />}
            />
            <Route path="/ico-converter" element={<IcoConverter />} />
            <Route path="/pdf-converter" element={<PdfConverter />} />
            <Route path="/svg-converter" element={<SvgConverter />} />
            <Route path="/lowres-generator" element={<LowResGenerator />} />
            <Route path="/ocr-reader" element={<OcrReader />} />
            <Route path="/app-icon-generator" element={<AppIconGenerator />} />
            <Route path="/image-to-ascii" element={<ImageToAsciiConverter />} />
            <Route path="/image-to-pixel" element={<ImageToPixelConverter />} />
            <Route
              path="/color-palette-extractor"
              element={<ColorPaletteExtractor />}
            />
            <Route
              path="/image-to-emoji-mosaic"
              element={<ImageToEmojiMosaic />}
            />
            <Route path="/image-to-line-art" element={<ImageToLineArt />} />
            <Route path="/image-to-ansi-art" element={<ImageToAnsiArt />} />
            <Route path="/image-upscaler" element={<ImageUpscaler />} />
            <Route path="/html-to-image" element={<HtmlToImage />} />
            <Route path="/face-blur" element={<FaceBlurTool />} />
            <Route path="/advanced-cropper" element={<AdvancedCropper />} />
            <Route path="/meme-generator" element={<MemeGenerator />} />
            <Route path="/watermark-tool" element={<WatermarkTool />} />
            <Route path="/background-remover" element={<BackgroundRemover />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
