export const DEFAULT_LINE_ART_SETTINGS = {
  mode: "sobel",
  threshold: 98,
  lowThreshold: 56,
  highThreshold: 98,
  brightness: 1,
  contrast: 1.15,
  blur: 1,
  sharpen: 0.4,
  noiseReduction: 0,
  edgeStrength: 1,
  cleanupLevel: 1,
  thickness: "normal",
  background: "#ffffff",
  customBackground: "#ffffff",
  invert: false,
  autoContrast: false,
  outputScale: 2,
};

export const LINE_ART_QUICK_MODES = [
  {
    id: "clean",
    label: "Clean",
    description: "Thin, tidy edges for diagrams and crisp outlines.",
    values: {
      mode: "sobel",
      threshold: 108,
      lowThreshold: 62,
      highThreshold: 108,
      blur: 1,
      cleanupLevel: 2,
      thickness: "thin",
    },
  },
  {
    id: "sketch",
    label: "Sketch",
    description: "Softer hand-drawn feeling with more texture left in place.",
    values: {
      mode: "dog",
      threshold: 78,
      lowThreshold: 45,
      highThreshold: 78,
      blur: 1,
      sharpen: 0.6,
      cleanupLevel: 0,
      thickness: "normal",
    },
  },
  {
    id: "bold",
    label: "Bold",
    description: "Heavier outlines with stronger edge emphasis.",
    values: {
      mode: "laplacian",
      threshold: 88,
      lowThreshold: 48,
      highThreshold: 88,
      blur: 0,
      cleanupLevel: 1,
      thickness: "thick",
      edgeStrength: 1.25,
    },
  },
  {
    id: "high-detail",
    label: "High Detail",
    description: "Keeps more fine structure for detailed illustrations.",
    values: {
      mode: "sobel",
      threshold: 74,
      lowThreshold: 36,
      highThreshold: 74,
      blur: 0,
      cleanupLevel: 0,
      thickness: "normal",
      sharpen: 0.8,
    },
  },
  {
    id: "stencil",
    label: "Stencil",
    description: "High-contrast graphic output suited for cut-out looks.",
    values: {
      mode: "threshold",
      threshold: 118,
      lowThreshold: 72,
      highThreshold: 118,
      contrast: 1.35,
      autoContrast: true,
      cleanupLevel: 2,
      thickness: "thick",
    },
  },
];

export const LINE_ART_MODE_OPTIONS = [
  {
    value: "sobel",
    label: "Sobel",
    description:
      "Balanced edge extraction with familiar directional gradients.",
  },
  {
    value: "laplacian",
    label: "Laplacian",
    description: "Sharper second-derivative edge response for bold contours.",
  },
  {
    value: "threshold",
    label: "Threshold",
    description: "Simpler hard-edge map for stencil-like output.",
  },
  {
    value: "dog",
    label: "Difference of Gaussian",
    description: "Softer edge isolation that feels more sketch-like.",
  },
];

export const LINE_ART_THICKNESS_OPTIONS = [
  { value: "thin", label: "Thin", description: "Light, minimal edge weight." },
  {
    value: "normal",
    label: "Normal",
    description: "Balanced stroke thickness.",
  },
  {
    value: "thick",
    label: "Thick",
    description: "Heavier lines for poster-like output.",
  },
];

export const LINE_ART_BACKGROUND_OPTIONS = [
  {
    value: "#ffffff",
    label: "White",
    description: "Standard paper-style background.",
  },
  { value: "#000000", label: "Black", description: "Dark reversed canvas." },
  {
    value: "transparent",
    label: "Transparent",
    description: "Transparent background for PNG export.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Choose any custom fill color.",
  },
];

export const LINE_ART_OUTPUT_SCALE_OPTIONS = [
  { value: 1, label: "1x", description: "Preview size export." },
  { value: 2, label: "2x", description: "Balanced high-resolution output." },
  {
    value: 4,
    label: "4x",
    description: "Large export with crisp pixel edges.",
  },
];

export const LINE_ART_EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
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

export const LINE_ART_PREVIEW_MAX_DIMENSION = 900;
