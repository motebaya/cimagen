import { downloadBlob, downloadCanvas } from "../exportImage.js";
import { getTimestamp } from "./asciiHelpers.js";
import { renderAsciiToCanvas } from "./asciiRenderer.js";

export function downloadAsciiText(text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `ascii_${getTimestamp()}.txt`);
}

export async function downloadAsciiImage(result, format, options) {
  const canvas = renderAsciiToCanvas(result, options);
  const quality = format === "webp" ? 0.85 : 0.92;
  await downloadCanvas(canvas, `ascii_${getTimestamp()}`, format, quality);
}
