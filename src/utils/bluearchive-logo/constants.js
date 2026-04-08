export const BLUEARCHIVE_CANVAS_HEIGHT = 250;
export const BLUEARCHIVE_CANVAS_WIDTH = 900;
export const BLUEARCHIVE_FONT_SIZE = 84;
export const BLUEARCHIVE_TEXT_BASELINE = 0.68;
export const BLUEARCHIVE_HORIZONTAL_TILT = -0.4;
export const BLUEARCHIVE_PADDING_X = 10;

export const DEFAULT_HALO_OFFSET = {
  x: -15,
  y: 0,
};

export const DEFAULT_CROSS_OFFSET = {
  x: -15,
  y: 0,
};

export const BLUEARCHIVE_HOLLOW_PATH = [
  [284, 136],
  [321, 153],
  [159, 410],
  [148, 403],
];

export const BLUEARCHIVE_FONT_DECLARATION = `${BLUEARCHIVE_FONT_SIZE}px "RoGSanSrfStd-Bd", "GlowSansSC-Normal-Heavy_diff", apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif`;

export const BLUEARCHIVE_EXPORT_FORMAT_OPTIONS = [
  { value: "png", label: "PNG", description: "Lossless export with alpha support." },
  { value: "jpg", label: "JPG", description: "Smaller file size with a white background." },
  { value: "webp", label: "WEBP", description: "Compressed export with good quality at smaller sizes." },
];
