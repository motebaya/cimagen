import {
  ANSI_BLOCK_CHARACTER_OPTIONS,
  ANSI_CHARSET_PRESET_OPTIONS,
} from "./ansiConstants.js";

const ANSI_CHARSET_MAP = {
  "classic-ascii": "@%#*+=-:. ",
  "dense-shade": "█▓▒░. ",
  technical: "MNHQ$OC?7>!:-. ",
  "dot-matrix": "#xo;:,. ",
};

export function getDefaultBlockCharacter() {
  return ANSI_BLOCK_CHARACTER_OPTIONS[0]?.value || "█";
}

export function getBlockCharacterOptions() {
  return ANSI_BLOCK_CHARACTER_OPTIONS;
}

export function getCharsetPresetOptions() {
  return ANSI_CHARSET_PRESET_OPTIONS;
}

export function resolveCharsetGlyph(luminance, preset, customChar) {
  if (preset === "custom-char") {
    return customChar || getDefaultBlockCharacter();
  }

  const charset = ANSI_CHARSET_MAP[preset] || ANSI_CHARSET_MAP["classic-ascii"];
  const normalized = Math.min(1, Math.max(0, luminance / 255));
  const index = Math.min(
    charset.length - 1,
    Math.max(0, Math.floor(normalized * (charset.length - 1))),
  );
  return charset[index] || " ";
}
