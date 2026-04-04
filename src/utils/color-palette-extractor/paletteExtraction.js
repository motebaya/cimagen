import { sourceToCanvas } from "../canvasUtils.js";

export async function sampleImagePixels(source, maxSamples = 8000) {
  const canvas = await sourceToCanvas(source);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = [];
  const totalPixels = canvas.width * canvas.height;
  const step = Math.max(1, Math.floor(totalPixels / maxSamples));

  for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += step) {
    const dataIndex = pixelIndex * 4;
    const alpha = imageData.data[dataIndex + 3];
    if (alpha === 0) {
      continue;
    }

    const x = pixelIndex % canvas.width;
    const y = Math.floor(pixelIndex / canvas.width);

    pixels.push({
      r: imageData.data[dataIndex],
      g: imageData.data[dataIndex + 1],
      b: imageData.data[dataIndex + 2],
      a: alpha,
      x,
      y,
      nx: x / canvas.width,
      ny: y / canvas.height,
    });
  }

  return {
    width: canvas.width,
    height: canvas.height,
    pixels,
  };
}

export function createPaletteWorker() {
  return new Worker(
    new URL("../../workers/paletteWorker.js", import.meta.url),
    {
      type: "module",
    },
  );
}
