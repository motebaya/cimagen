export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function normalizeScale(scale) {
  if (Array.isArray(scale)) {
    return [Number(scale[0]) || 1, Number(scale[1]) || 1];
  }

  if (typeof scale === "number") {
    return [scale, scale];
  }

  return [1, 1];
}

export function resolveBackgroundValue(background, customBackground) {
  return background === "custom" ? customBackground : background;
}

export function getTextColorForBackground(background) {
  if (background === "transparent") {
    return "#0f172a";
  }

  const hex = background.replace("#", "");
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
  return luminance > 150 ? "#0f172a" : "#f8fafc";
}

export function getCharsetString(charset, fallback) {
  if (!charset) {
    return fallback;
  }

  if (Array.isArray(charset)) {
    return charset.join("");
  }

  return `${charset}`;
}
