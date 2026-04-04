import { useState } from "react";
import {
  DEFAULT_ASCII_SETTINGS,
  DEFAULT_SORTED_CHARSET,
} from "../../utils/image-to-ascii/index.js";
import { getCharsetFromPreset } from "../../utils/image-to-ascii/asciiCharacterSets.js";

export default function useAsciiSettings() {
  const [settings, setSettings] = useState(DEFAULT_ASCII_SETTINGS);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateCharsetPreset = (preset) => {
    setSettings((current) => ({
      ...current,
      charsetPreset: preset,
      charset:
        preset === "custom"
          ? current.charset || DEFAULT_SORTED_CHARSET
          : getCharsetFromPreset(preset),
    }));
  };

  const updateCharset = (value) => {
    setSettings((current) => ({
      ...current,
      charsetPreset: "custom",
      charset: value || DEFAULT_SORTED_CHARSET,
    }));
  };

  return {
    settings,
    updateCharset,
    updateCharsetPreset,
    updateSetting,
  };
}
