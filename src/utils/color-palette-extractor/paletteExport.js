import { downloadBlob } from "../exportImage.js";
import { getTimestamp } from "./paletteHelpers.js";

export function downloadPaletteText(value, extension) {
  if (!value) {
    return;
  }

  const mimeType =
    extension === "json"
      ? "application/json;charset=utf-8"
      : "text/plain;charset=utf-8";
  const blob = new Blob([value], { type: mimeType });
  downloadBlob(blob, `palette_${getTimestamp()}.${extension}`);
}
