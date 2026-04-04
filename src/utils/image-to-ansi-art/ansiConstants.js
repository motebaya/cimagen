export const DEFAULT_ANSI_SETTINGS = {
  columns: 80,
  renderMode: "half",
  colorMode: "truecolor",
  aspectCompensation: 1,
  background: "#000000",
  customBackground: "#0f172a",
  customChar: "█",
  charsetPreset: "classic-ascii",
  optimizeEscapeCodes: true,
  addResetAtEnd: true,
  trimEmptyRows: false,
  outputFormat: "raw",
  fontSize: 12,
  lineHeight: 1.2,
  terminalTheme: "dark",
};

export const ANSI_RENDER_MODE_OPTIONS = [
  {
    value: "half",
    label: "Half Block",
    description:
      "Top and bottom color per cell for the densest terminal output.",
  },
  {
    value: "full",
    label: "Full Block",
    description: "Uses a single block character with foreground coloring.",
  },
  {
    value: "background",
    label: "Background Color",
    description: "Uses empty glyphs with ANSI background fills.",
  },
];

export const ANSI_COLOR_MODE_OPTIONS = [
  {
    value: "truecolor",
    label: "Truecolor RGB",
    description: "Best fidelity when your terminal supports 24-bit ANSI color.",
  },
  {
    value: "ansi256",
    label: "ANSI 256",
    description: "Reduced palette for wider terminal compatibility.",
  },
  {
    value: "grayscale",
    label: "Grayscale",
    description: "Monochrome luminance with tonal shading preserved.",
  },
  {
    value: "monochrome",
    label: "Monochrome",
    description: "Binary black and white terminal output.",
  },
];

export const ANSI_BACKGROUND_OPTIONS = [
  {
    value: "transparent",
    label: "Transparent-like",
    description:
      "Leaves empty terminal cells without forcing a background color.",
  },
  {
    value: "#000000",
    label: "Black",
    description: "Classic dark terminal background.",
  },
  {
    value: "#ffffff",
    label: "White",
    description: "Bright terminal background.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Choose any custom terminal background.",
  },
];

export const ANSI_OUTPUT_FORMAT_OPTIONS = [
  {
    value: "raw",
    label: "Raw ANSI",
    description: "Plain escape-code output ready for terminal use.",
  },
  {
    value: "javascript",
    label: "JavaScript String",
    description: "Escaped string literal for code snippets.",
  },
  {
    value: "json",
    label: "JSON-safe",
    description: "JSON object payload containing the ANSI output.",
  },
];

export const ANSI_COLUMN_PRESETS = [
  [40, "Small"],
  [80, "Medium"],
  [120, "Wide"],
  [160, "Banner"],
];

export const ANSI_BLOCK_CHARACTER_OPTIONS = [
  { value: "█", label: "Solid Block" },
  { value: "▓", label: "Dense Shade" },
  { value: "■", label: "Square" },
  { value: "#", label: "Hash" },
];

export const ANSI_CHARSET_PRESET_OPTIONS = [
  {
    value: "classic-ascii",
    label: "Classic ASCII",
    description: "Traditional terminal shading with symbols like @, #, and .",
  },
  {
    value: "dense-shade",
    label: "Dense Shade",
    description: "Uses block and shade glyphs for a bolder text-art look.",
  },
  {
    value: "technical",
    label: "Technical",
    description:
      "Sharper geometric symbols that feel closer to old system dumps.",
  },
  {
    value: "dot-matrix",
    label: "Dot Matrix",
    description: "Lighter dotted characters for a softer retro printer look.",
  },
  {
    value: "custom-char",
    label: "Single Character",
    description: "Use one custom glyph across the entire render.",
  },
];

export const ANSI_TERMINAL_THEME_OPTIONS = {
  dark: {
    label: "Dark Terminal",
    background: "#0b1220",
    text: "#f8fafc",
  },
  light: {
    label: "Light Terminal",
    background: "#f8fafc",
    text: "#0f172a",
  },
};

export const ANSI_PREVIEW_MODE_OPTIONS = {
  ansi: "ANSI Preview",
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
