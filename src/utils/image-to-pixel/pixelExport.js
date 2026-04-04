import { downloadBlob, downloadCanvas } from "../exportImage.js";
import { getTimestamp, rgbToHex } from "./pixelHelpers.js";

export function createPixelSvg(pixelArt, options = {}) {
  const { scale = 8, background = "transparent" } = options;
  const width = pixelArt.width * scale;
  const height = pixelArt.height * scale;
  const backgroundRect =
    background === "transparent"
      ? ""
      : `<rect width="100%" height="100%" fill="${background}" />`;

  const rects = pixelArt.pixels
    .map((pixel, index) => {
      if (!pixel.a) {
        return "";
      }

      const x = (index % pixelArt.width) * scale;
      const y = Math.floor(index / pixelArt.width) * scale;
      return `<rect x="${x}" y="${y}" width="${scale}" height="${scale}" fill="${rgbToHex(pixel.r, pixel.g, pixel.b)}" fill-opacity="${(pixel.a / 255).toFixed(3)}" />`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${backgroundRect}${rects}</svg>`;
}

export function createPixelJson(pixelArt) {
  return JSON.stringify(
    {
      width: pixelArt.width,
      height: pixelArt.height,
      sourceWidth: pixelArt.sourceWidth,
      sourceHeight: pixelArt.sourceHeight,
      pixelSize: pixelArt.pixelSize,
      palette: pixelArt.palette,
      pixels: pixelArt.pixels.map((pixel) => ({
        hex: rgbToHex(pixel.r, pixel.g, pixel.b),
        alpha: pixel.a,
      })),
    },
    null,
    2,
  );
}

export async function exportPixelCanvas(canvas) {
  await downloadCanvas(canvas, `pixel_${getTimestamp()}`, "png", 0.92);
}

export function exportPixelBlob(content, extension, mimeType) {
  downloadBlob(
    new Blob([content], { type: mimeType }),
    `pixel_${getTimestamp()}.${extension}`,
  );
}
