export const PREVIEW_MAX_DIMENSION = 960;
export const PREVIEW_SEGMENTATION_DIMENSION = 640;
export const EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export const BACKGROUND_MODE_OPTIONS = [
  ["transparent", "Transparent PNG"],
  ["color", "Solid color"],
  ["gradient", "Gradient"],
  ["blur", "Blur background"],
  ["image", "Replace with image"],
];

export const BACKGROUND_REMOVAL_TIERS = [
  {
    id: "fast",
    label: "Fast",
    description: "Quick local removal for previews and low-power devices.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Best default for most browser-based background removal tasks.",
  },
  {
    id: "quality",
    label: "Quality",
    description: "Adds local edge refinement for cleaner object boundaries.",
  },
  {
    id: "heavy",
    label: "Heavy",
    description:
      "Runs a higher-cost multipass refinement for slower but stronger extraction.",
  },
];

export const DEFAULT_BACKGROUND_REMOVAL_SETTINGS = {
  threshold: 52,
  edgeTolerance: 42,
  feather: 12,
  backgroundMode: "transparent",
  backgroundColor: "#ffffff",
  gradientFrom: "#eff6ff",
  gradientTo: "#dbeafe",
  backgroundBlur: 18,
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
