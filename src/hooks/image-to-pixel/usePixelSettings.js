import { useState } from "react";
import { DEFAULT_PIXEL_SETTINGS } from "../../utils/image-to-pixel/index.js";

export default function usePixelSettings() {
  const [settings, setSettings] = useState(DEFAULT_PIXEL_SETTINGS);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return {
    settings,
    setSettings,
    updateSetting,
  };
}
