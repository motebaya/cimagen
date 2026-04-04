export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function colorDistance(left, right) {
  return Math.sqrt(
    (left.r - right.r) ** 2 + (left.g - right.g) ** 2 + (left.b - right.b) ** 2,
  );
}

export function sortPaletteColors(palette, sortMode) {
  const nextPalette = [...palette];

  if (sortMode === "hue") {
    nextPalette.sort(
      (left, right) =>
        left.hsl.h - right.hsl.h || right.percentage - left.percentage,
    );
    return nextPalette;
  }

  if (sortMode === "lightness") {
    nextPalette.sort(
      (left, right) =>
        left.hsl.l - right.hsl.l || right.percentage - left.percentage,
    );
    return nextPalette;
  }

  nextPalette.sort((left, right) => right.percentage - left.percentage);
  return nextPalette;
}

export function createColorId(color, index) {
  return `${color.hex}-${index}`;
}
