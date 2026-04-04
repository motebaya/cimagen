export const DEFAULT_PALETTE_SETTINGS = {
  colorCount: 8,
  sampleLimit: 9000,
  sortMode: "prominence",
  showPercentages: true,
};

export const PALETTE_SORT_OPTIONS = [
  {
    value: "prominence",
    label: "Prominence",
    description: "Show the most dominant colors first.",
  },
  {
    value: "hue",
    label: "Hue",
    description: "Arrange colors by their hue angle.",
  },
  {
    value: "lightness",
    label: "Lightness",
    description: "Sort colors from darker to lighter values.",
  },
];

export const PALETTE_EXPORT_FORMATS = [
  { id: "hex", label: "HEX List" },
  { id: "css", label: "CSS Variables" },
  { id: "txt", label: "Download TXT" },
  { id: "json", label: "Download JSON" },
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
