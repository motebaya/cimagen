export const PIXEL_SIZE_OPTIONS = [4, 8, 16, 32, 64];
export const COLOR_COUNT_OPTIONS = [2, 8, 16, 32, 64, 128];
export const OUTPUT_SCALE_OPTIONS = [1, 2, 4, 8, 16];

export const DEFAULT_PIXEL_SETTINGS = {
  pixelSize: 16,
  colorCount: 16,
  palette: "original",
  customPaletteText: "#0f172a, #f8fafc, #f59e0b",
  dithering: "floyd-steinberg",
  sharpen: 0.6,
  blur: 0,
  contrast: 1,
  outline: "off",
  showGrid: true,
  outputScale: 8,
  background: "transparent",
  customBackground: "#ffffff",
};

export const PIXEL_DITHERING_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "Clean nearest-color mapping without dithering noise.",
  },
  {
    value: "floyd-steinberg",
    label: "Floyd-Steinberg",
    description: "Classic error diffusion for softer gradients.",
  },
  {
    value: "bayer",
    label: "Bayer",
    description: "Ordered dithering with a retro patterned look.",
  },
  {
    value: "atkinson",
    label: "Atkinson",
    description: "Apple-era diffusion with lighter grain.",
  },
];

export const PIXEL_OUTLINE_OPTIONS = [
  { value: "off", label: "Off", description: "No extra edge outline." },
  { value: "thin", label: "Thin", description: "Subtle one-pixel contour." },
  {
    value: "thick",
    label: "Thick",
    description: "Heavier outline around color changes.",
  },
  {
    value: "only-edges",
    label: "Only Edges",
    description: "Show the detected outline map without fills.",
  },
];

export const PIXEL_BACKGROUND_OPTIONS = [
  {
    value: "transparent",
    label: "Transparent",
    description: "Best for PNG export with no solid background fill.",
  },
  {
    value: "#ffffff",
    label: "White",
    description: "Clean bright pixel-art canvas.",
  },
  {
    value: "#000000",
    label: "Black",
    description: "Dark background for neon or game-art looks.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Choose your own export background color.",
  },
];

export const HIDDEN_INPUT_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export const PIXEL_PREVIEW_MAX_EDGE = 560;
