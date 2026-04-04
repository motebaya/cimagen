import { LINE_ART_QUICK_MODES } from "./lineArtConstants.js";

export function getLineArtQuickModes() {
  return LINE_ART_QUICK_MODES;
}

export function getLineArtQuickModeById(modeId) {
  return LINE_ART_QUICK_MODES.find((mode) => mode.id === modeId) || null;
}
