export function buildPaletteHexList(result) {
  return result ? result.palette.map((color) => color.hex).join("\n") : "";
}

export function buildPaletteCssVariables(result) {
  if (!result) {
    return "";
  }

  return result.palette
    .map((color, index) => `--palette-${index + 1}: ${color.hex};`)
    .join("\n");
}

export function buildPaletteJson(result, imageMeta, imageFilename) {
  if (!result) {
    return "";
  }

  return JSON.stringify(
    {
      image: {
        filename: imageFilename,
        width: imageMeta.width,
        height: imageMeta.height,
      },
      average: result.average,
      sampleCount: result.sampleCount,
      colors: result.palette,
    },
    null,
    2,
  );
}
