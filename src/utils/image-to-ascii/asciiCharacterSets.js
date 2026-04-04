import {
  ASCII_CHARSET_PRESETS,
  DEFAULT_SORTED_CHARSET,
} from "./asciiConstants.js";

export function getCharsetPresetOptions() {
  return ASCII_CHARSET_PRESETS.map(({ value, label, description }) => ({
    value,
    label,
    description,
  }));
}

export function getCharsetFromPreset(preset) {
  return (
    ASCII_CHARSET_PRESETS.find((entry) => entry.value === preset)?.charset ||
    DEFAULT_SORTED_CHARSET
  );
}
