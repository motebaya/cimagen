import { useState } from "react";
import { getLineArtQuickModeById } from "../../utils/image-to-line-art/index.js";

export default function useLineArtQuickModes(setSettings) {
  const [activeQuickMode, setActiveQuickMode] = useState(null);

  const updateSetting = (key, value) => {
    setActiveQuickMode(null);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const applyQuickMode = (modeId) => {
    const mode = getLineArtQuickModeById(modeId);
    if (!mode) {
      return;
    }

    setActiveQuickMode(modeId);
    setSettings((current) => ({ ...current, ...mode.values }));
  };

  return {
    activeQuickMode,
    applyQuickMode,
    updateSetting,
  };
}
