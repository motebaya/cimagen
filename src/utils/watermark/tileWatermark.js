import { drawTextWatermark } from "./textWatermark.js";

export function drawTiledWatermark(context, layer, canvasWidth, canvasHeight) {
  const spacing = layer.spacing || 120;
  const pattern = layer.pattern || "grid";
  const offsetX = layer.offsetX || 0;
  const offsetY = layer.offsetY || 0;
  const stepY = spacing;
  const stepX = spacing * (pattern === "diagonal" ? 1.1 : 1);

  for (let y = -spacing; y < canvasHeight + spacing; y += stepY) {
    for (let x = -spacing; x < canvasWidth + spacing; x += stepX) {
      const brickOffset =
        pattern === "brick" && Math.floor((y + spacing) / stepY) % 2 === 1
          ? stepX / 2
          : 0;
      const diagonalOffset =
        pattern === "diagonal" ? (y / stepY) * (stepX * 0.3) : 0;
      const tileLayer = {
        ...layer,
        x: (x + brickOffset + diagonalOffset + offsetX) / canvasWidth,
        y: (y + offsetY) / canvasHeight,
      };
      drawTextWatermark(context, tileLayer, canvasWidth, canvasHeight);
    }
  }

  return null;
}
