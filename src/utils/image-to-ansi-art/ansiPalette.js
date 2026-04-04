import { rgbToHex } from "./ansiHelpers.js";

function quantizeAnsi256(red, green, blue) {
  const grayscale = red === green && green === blue;
  if (grayscale) {
    if (red < 8) return 16;
    if (red > 248) return 231;
    return Math.round(((red - 8) / 247) * 24) + 232;
  }

  const r = Math.round((red / 255) * 5);
  const g = Math.round((green / 255) * 5);
  const b = Math.round((blue / 255) * 5);
  return 16 + 36 * r + 6 * g + b;
}

export function mapColor(rgb, colorMode) {
  const [red, green, blue] = rgb;

  if (colorMode === "ansi256") {
    const ansi = quantizeAnsi256(red, green, blue);
    return { type: "ansi256", value: ansi, css: rgbToHex(red, green, blue) };
  }

  if (colorMode === "grayscale") {
    const gray = Math.round(red * 0.299 + green * 0.587 + blue * 0.114);
    return {
      type: "truecolor",
      value: [gray, gray, gray],
      css: rgbToHex(gray, gray, gray),
    };
  }

  if (colorMode === "monochrome") {
    const gray = red * 0.299 + green * 0.587 + blue * 0.114;
    const mono = gray >= 128 ? [255, 255, 255] : [0, 0, 0];
    return {
      type: "truecolor",
      value: mono,
      css: rgbToHex(mono[0], mono[1], mono[2]),
    };
  }

  return {
    type: "truecolor",
    value: [red, green, blue],
    css: rgbToHex(red, green, blue),
  };
}

export function escapeSequence(color, isBackground) {
  if (!color) {
    return "";
  }

  if (color.type === "ansi256") {
    return `\u001b[${isBackground ? 48 : 38};5;${color.value}m`;
  }

  return `\u001b[${isBackground ? 48 : 38};2;${color.value.join(";")}m`;
}

export function colorsEqual(left, right) {
  if (left === right) {
    return true;
  }

  if (!left || !right || left.type !== right.type) {
    return false;
  }

  if (left.type === "ansi256") {
    return left.value === right.value;
  }

  return left.value.every((value, index) => value === right.value[index]);
}
