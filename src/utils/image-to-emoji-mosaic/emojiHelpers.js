export const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

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

export function toColorMeta(emoji, rgb, category) {
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  return {
    emoji,
    rgb,
    luminance: 0.299 * r + 0.587 * g + 0.114 * b,
    saturation: max === 0 ? 0 : delta / max,
    hue: (hue * 60 + 360) % 360,
    category,
  };
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

  if (background === "custom") {
    return parseHexColor(customBackground);
  }

  return parseHexColor(background);
}

export function getEmojiPreviewStyles(options = {}) {
  return {
    fontFamily: EMOJI_FONT_FAMILY,
    fontSize: `${options.fontSize || 18}px`,
    lineHeight: options.lineHeight || 1.15,
  };
}
