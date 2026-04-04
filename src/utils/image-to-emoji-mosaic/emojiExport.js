import { downloadBlob, downloadCanvas } from "../exportImage.js";
import { getTimestamp } from "./emojiHelpers.js";
import {
  createEmojiMosaicJson,
  renderEmojiMosaicCanvas,
} from "./emojiMosaicRenderer.js";

export function downloadEmojiText(mosaic) {
  downloadBlob(
    new Blob([mosaic.text], { type: "text/plain;charset=utf-8" }),
    `emoji_mosaic_${getTimestamp()}.txt`,
  );
}

export function downloadEmojiJson(mosaic) {
  downloadBlob(
    new Blob([createEmojiMosaicJson(mosaic)], {
      type: "application/json;charset=utf-8",
    }),
    `emoji_mosaic_${getTimestamp()}.json`,
  );
}

export async function downloadEmojiImage(mosaic, options = {}, format = "png") {
  const canvas = renderEmojiMosaicCanvas(mosaic, options);
  await downloadCanvas(
    canvas,
    `emoji_mosaic_${getTimestamp()}`,
    format,
    format === "webp" ? 0.9 : 0.92,
  );
}
