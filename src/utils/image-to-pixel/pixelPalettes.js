import { hexToRgb } from "./pixelHelpers.js";

export const PALETTE_PRESETS = {
  original: [],
  grayscale: ["#000000", "#404040", "#808080", "#bfbfbf", "#ffffff"],
  gameboy: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
  nes: [
    "#0f380f",
    "#0037c0",
    "#7c3f58",
    "#8b6d00",
    "#00a800",
    "#c84c0c",
    "#f8b800",
    "#f8f8f8",
  ],
  commodore64: [
    "#000000",
    "#ffffff",
    "#813338",
    "#75cec8",
    "#8e3c97",
    "#56ac4d",
    "#2e2c9b",
    "#edf171",
  ],
  vga: [
    "#000000",
    "#0000aa",
    "#00aa00",
    "#00aaaa",
    "#aa0000",
    "#aa00aa",
    "#aa5500",
    "#aaaaaa",
    "#555555",
    "#5555ff",
    "#55ff55",
    "#55ffff",
    "#ff5555",
    "#ff55ff",
    "#ffff55",
    "#ffffff",
  ],
  pastel: [
    "#ffd6e0",
    "#f8edeb",
    "#d8f3dc",
    "#caf0f8",
    "#cddafd",
    "#e4c1f9",
    "#fff1b6",
    "#f1f1f1",
  ],
  neon: [
    "#050505",
    "#00f5d4",
    "#00bbf9",
    "#fee440",
    "#f15bb5",
    "#9b5de5",
    "#fb5607",
    "#f8f9fa",
  ],
  custom: [],
};

export const PALETTE_PRESET_OPTIONS = [
  {
    value: "original",
    label: "Original",
    description: "Adaptive palette sampled from the image itself.",
  },
  {
    value: "grayscale",
    label: "Grayscale",
    description: "Monochrome tonal ramp.",
  },
  {
    value: "gameboy",
    label: "GameBoy",
    description: "Classic green handheld palette.",
  },
  {
    value: "nes",
    label: "NES",
    description: "Retro console palette with bolder contrast.",
  },
  {
    value: "commodore64",
    label: "Commodore 64",
    description: "Iconic 8-bit computer colors.",
  },
  {
    value: "vga",
    label: "VGA",
    description: "Old-school full 16-color VGA set.",
  },
  {
    value: "pastel",
    label: "Pastel",
    description: "Soft, playful pastel tones.",
  },
  {
    value: "neon",
    label: "Neon",
    description: "High-contrast fluorescent palette.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Use your own comma- or line-separated hex list.",
  },
];

export function parsePaletteInput(customPalette = []) {
  return customPalette
    .map((hex) => hex.trim())
    .filter(Boolean)
    .map(hexToRgb);
}
