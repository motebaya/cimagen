export const DEFAULT_EMOJI_MOSAIC_SETTINGS = {
  tileSize: 18,
  columns: 56,
  rows: 36,
  samplingDensity: 3,
  preset: "defaultMixed",
  customEmojiSet: "🟥 🟧 🟨 🟩 🟦 🟪 ⬛ ⬜",
  matchMode: "average",
  background: "transparent",
  customBackground: "#ffffff",
  preserveAspectRatio: true,
  invertBrightness: false,
  trimEmptyBorders: false,
  lineHeight: 1.08,
  luminanceWeight: 0.45,
  brightnessWeight: 0.65,
  saturationWeight: 0.35,
};

export const EMOJI_MATCH_MODE_OPTIONS = [
  {
    value: "average",
    label: "Average Color",
    description: "Matches emoji by overall RGB distance and luminance.",
  },
  {
    value: "brightness",
    label: "Brightness",
    description: "Biases towards tonal similarity over exact color.",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "Mixes color, brightness, and saturation scoring.",
  },
  {
    value: "palette",
    label: "Palette Restricted",
    description: "Leans into hue family matching for cleaner grouped palettes.",
  },
];

export const EMOJI_BACKGROUND_OPTIONS = [
  {
    value: "transparent",
    label: "Transparent",
    description: "Leaves empty cells transparent in PNG-style output.",
  },
  {
    value: "#ffffff",
    label: "White",
    description: "Bright background for print-like mosaic output.",
  },
  {
    value: "#000000",
    label: "Black",
    description: "Dark background for stronger emoji contrast.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Choose any custom background color.",
  },
];

export const EMOJI_PREVIEW_MODE_OPTIONS = {
  original: "Original",
  mosaic: "Mosaic Result",
};

export const EMOJI_EXPORT_FORMATS = [
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
