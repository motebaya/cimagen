import { downloadBlob, downloadCanvas } from "../exportImage.js";
import { getTimestamp } from "./ansiHelpers.js";
import { renderAnsiArtCanvas } from "./ansiRenderer.js";

export function getAnsiClipboardText(result, mode) {
  return mode === "formatted" ? result.formattedText : result.ansiText;
}

export function downloadAnsiText(result, extension) {
  downloadBlob(
    new Blob([result.formattedText], { type: "text/plain;charset=utf-8" }),
    `ansi_art_${getTimestamp()}.${extension}`,
  );
}

export async function downloadAnsiPreviewImage(result, options) {
  const canvas = renderAnsiArtCanvas(result, options);
  await downloadCanvas(canvas, `ansi_art_${getTimestamp()}`, "png", 0.92);
}
