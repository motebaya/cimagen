export const PREVIEW_MAX_DIMENSION = 1100;

export const FACE_BLUR_TIERS = [
  {
    id: "fast",
    label: "Fast",
    description:
      "Uses the browser native face detector when available for the quickest scan.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Runs the local MediaPipe detector once for stable everyday use.",
  },
  {
    id: "quality",
    label: "Quality",
    description: "Runs multiple local detection passes to catch harder faces.",
  },
  {
    id: "heavy",
    label: "Heavy",
    description:
      "Combines local and browser detection strategies when available.",
  },
];

export const BLUR_EFFECT_OPTIONS = [
  ["blur", "Gaussian Blur"],
  ["pixelate", "Pixelate"],
  ["mosaic", "Mosaic"],
];

export const FACE_MASK_SHAPE_OPTIONS = [
  ["oval", "Oval"],
  ["rectangle", "Rectangle"],
];

export const EXPORT_FORMATS = [
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

export const DEFAULT_FACE_BLUR_SETTINGS = {
  effect: "blur",
  strength: 18,
  padding: 0.25,
  feather: 10,
  shape: "oval",
  showBoxes: true,
  detectionSensitivity: 0.35,
  maxDetectedFaces: 12,
};
