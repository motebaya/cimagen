export const UPSCALE_EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export const UPSCALE_SCALE_OPTIONS = [2, 4];

export const UPSCALE_TIER_OPTIONS = [
  {
    id: "fast",
    label: "Fast",
    description:
      "Quick canvas resizing for fast previews and low-power devices.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Sharper interpolation with a practical quality-to-speed tradeoff.",
  },
  {
    id: "quality",
    label: "Quality",
    description:
      "Adds stronger detail recovery and adaptive enhancement passes.",
  },
  {
    id: "heavy",
    label: "Heavy",
    description:
      "Multi-pass enhancement tuned for the best local browser output.",
  },
];

export const DEFAULT_UPSCALER_SETTINGS = {
  scale: 2,
  detailStrength: 0.35,
  sharpenStrength: 0.24,
  noiseReduction: 0.08,
  preserveEdges: true,
  adaptiveSharpen: true,
};

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

export const PREVIEW_MAX_DIMENSIONS = {
  fast: 760,
  balanced: 700,
  quality: 560,
  heavy: 460,
};
