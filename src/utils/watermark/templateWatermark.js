import { drawSocialWatermark } from "./socialWatermark.js";
import { drawStampWatermark } from "./stampWatermark.js";
import { drawTextWatermark } from "./textWatermark.js";
import { drawTiledWatermark } from "./tileWatermark.js";

export function drawTemplateWatermark(
  context,
  layer,
  canvasWidth,
  canvasHeight,
) {
  if (layer.type?.startsWith("stamp-")) {
    return drawStampWatermark(context, layer, canvasWidth, canvasHeight);
  }

  if (layer.type?.startsWith("social-")) {
    return drawSocialWatermark(context, layer, canvasWidth, canvasHeight);
  }

  if (layer.type === "pattern-watermark") {
    return drawTiledWatermark(
      context,
      {
        ...layer,
        type: "text",
        tiled: true,
        pattern: "diagonal",
        maxWidth: 0.9,
      },
      canvasWidth,
      canvasHeight,
    );
  }

  return drawTextWatermark(context, layer, canvasWidth, canvasHeight);
}
