import { createLineArt, renderLineArtCanvas } from "./lineArtProcessor.js";

export async function createLineArtExportCanvas(source, options = {}) {
  const lineArt = await createLineArt(source, {
    ...options,
    maxDimension: Number.POSITIVE_INFINITY,
  });

  return renderLineArtCanvas(lineArt, {
    background: options.background,
    customBackground: options.customBackground,
    invert: options.invert,
    scale: options.outputScale,
  });
}
