import { useMemo } from "react";
import { getEmojiPresetOptions } from "../../utils/image-to-emoji-mosaic/index.js";

export default function useEmojiPalette() {
  const presetOptions = useMemo(() => getEmojiPresetOptions(), []);

  return {
    presetOptions,
  };
}
