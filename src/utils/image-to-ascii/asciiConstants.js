export const CONVERSION_CHARACTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

export const DEFAULT_SORTED_CHARSET =
  ".`',-:;_\"!Ii+l=r~|L]jt1T[/<>J\\^Ff{})nu?z(*7EHhPs4UYvxckZaoy#bdempq2KRBDN&35AVCX0689SgGO$wQM%W@";

export const ASCII_CHARSET_PRESETS = [
  {
    value: "sorted",
    label: "Sorted Default",
    description: "Matches the Python project default sorted luminance ramp.",
    charset: DEFAULT_SORTED_CHARSET,
  },
  {
    value: "classic",
    label: "Classic ASCII",
    description: "Familiar ASCII ramp from light to dark.",
    charset: " .:-=+*#%@",
  },
  {
    value: "dense",
    label: "Dense Blocks",
    description: "High-density characters for darker detailed output.",
    charset: " .,:;irsXA253hMHGS#9B&@",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Simple sparse ramp for clearer text-art silhouettes.",
    charset: " .:-=+*#%@",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Edit the character set manually.",
    charset: DEFAULT_SORTED_CHARSET,
  },
];

export const ASCII_BACKGROUND_OPTIONS = [
  {
    value: "#111318",
    label: "Terminal Dark",
    description: "Classic dark terminal background.",
  },
  {
    value: "#f8fafc",
    label: "Terminal Light",
    description: "Bright terminal canvas for print-like output.",
  },
  {
    value: "transparent",
    label: "Transparent",
    description: "Best for PNG export without background fill.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Choose any custom background color.",
  },
];

export const ASCII_EXPORT_FORMATS = [
  ["txt", "TXT"],
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export const DEFAULT_ASCII_SETTINGS = {
  width: 72,
  height: 48,
  scaleX: 1,
  scaleY: 1,
  brightness: 1,
  contrast: 1,
  sharpness: 1,
  fixScaling: true,
  invert: false,
  sortChars: false,
  colorful: false,
  charsetPreset: "sorted",
  charset: DEFAULT_SORTED_CHARSET,
  background: "#111318",
  customBackground: "#111318",
  fontSize: 10,
  lineHeight: 1.15,
};

export const ASCII_PREVIEW_MODE_OPTIONS = {
  ascii: "ASCII Result",
  original: "Original Image",
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
