import { ANSI_TERMINAL_THEME_OPTIONS } from "./ansiConstants.js";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function parseHexColor(hex) {
  const value = hex.replace("#", "").trim();
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value;

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

export function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((value) =>
      clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

export function resolveBackgroundValue(settings) {
  if (settings.background === "custom") {
    return settings.customBackground;
  }

  return settings.background;
}

export function getBackgroundRgb(background, customBackground) {
  if (background === "transparent") {
    return null;
  }

  return parseHexColor(background === "custom" ? customBackground : background);
}

export function getTerminalThemeConfig(theme) {
  return ANSI_TERMINAL_THEME_OPTIONS[theme] || ANSI_TERMINAL_THEME_OPTIONS.dark;
}
