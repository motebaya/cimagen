export const HTML_SCREEN_PRESETS = {
  desktop1920: 1920,
  desktop1440: 1440,
  tablet768: 768,
  mobile375: 375,
  mobile320: 320,
};

export const VIEWPORT_WIDTH_OPTIONS = [
  {
    value: "desktop1920",
    label: "Desktop 1920",
    description: "Large monitor capture",
  },
  {
    value: "desktop1440",
    label: "Desktop 1440",
    description: "Laptop and web hero",
  },
  {
    value: "tablet768",
    label: "Tablet 768",
    description: "Tablet portrait preview",
  },
  {
    value: "mobile375",
    label: "Mobile 375",
    description: "Common phone width",
  },
  {
    value: "mobile320",
    label: "Mobile 320",
    description: "Compact phone width",
  },
  { value: "custom", label: "Custom width", description: "Set your own width" },
];

export const VIEWPORT_HEIGHT_OPTIONS = [
  { value: "800", label: "800 px", description: "Short viewport" },
  { value: "900", label: "900 px", description: "Balanced default" },
  { value: "1080", label: "1080 px", description: "Tall screen" },
  { value: "1400", label: "1400 px", description: "Long landing page" },
  {
    value: "custom",
    label: "Custom height",
    description: "Set your own height",
  },
];

export const THEME_OPTIONS = [
  { value: "light", label: "Light", description: "Neutral canvas shell" },
  {
    value: "dark",
    label: "Dark",
    description: "Dark shell and browser chrome",
  },
];

export const SOURCE_MODE_OPTIONS = [
  { value: "html", label: "HTML Input" },
  { value: "url", label: "URL" },
];

export const EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export const DEFAULT_HTML_TO_IMAGE_SETTINGS = {
  sourceMode: "html",
  widthPreset: "desktop1440",
  customWidth: 1280,
  heightPreset: "900",
  customHeight: 900,
  scaleFactor: 1,
  delay: 160,
  padding: 32,
  backgroundColor: "#f8fafc",
  theme: "light",
  deviceFrame: false,
  shadow: true,
  fullPage: false,
};

export const SAMPLE_HTML_PATH = "samples/dummy-raw-html.html";
