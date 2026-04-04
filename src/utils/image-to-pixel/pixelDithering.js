import { clamp, colorDistance } from "./pixelHelpers.js";

export function getNearestPaletteColor(pixel, palette) {
  let nearest = palette[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  palette.forEach((color) => {
    const distance = colorDistance(pixel, color);
    if (distance < nearestDistance) {
      nearest = color;
      nearestDistance = distance;
    }
  });

  return {
    ...nearest,
    a: pixel.a ?? 255,
  };
}

function createBayerMap() {
  return [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
}

export function ditherPixels(pixels, width, height, palette, dithering) {
  if (dithering === "none") {
    return pixels.map((pixel) => getNearestPaletteColor(pixel, palette));
  }

  const working = pixels.map((pixel) => ({ ...pixel }));
  const output = new Array(pixels.length);

  if (dithering === "bayer") {
    const matrix = createBayerMap();
    const matrixSize = matrix.length;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        const threshold = (matrix[y % matrixSize][x % matrixSize] - 7.5) * 4;
        const adjusted = {
          r: clamp(working[index].r + threshold, 0, 255),
          g: clamp(working[index].g + threshold, 0, 255),
          b: clamp(working[index].b + threshold, 0, 255),
          a: working[index].a,
        };
        output[index] = getNearestPaletteColor(adjusted, palette);
      }
    }

    return output;
  }

  const distribute = (x, y, error, factor) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    }

    const index = y * width + x;
    working[index].r = clamp(working[index].r + error.r * factor, 0, 255);
    working[index].g = clamp(working[index].g + error.g * factor, 0, 255);
    working[index].b = clamp(working[index].b + error.b * factor, 0, 255);
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const current = working[index];
      const nearest = getNearestPaletteColor(current, palette);
      output[index] = nearest;

      const error = {
        r: current.r - nearest.r,
        g: current.g - nearest.g,
        b: current.b - nearest.b,
      };

      if (dithering === "floyd-steinberg") {
        distribute(x + 1, y, error, 7 / 16);
        distribute(x - 1, y + 1, error, 3 / 16);
        distribute(x, y + 1, error, 5 / 16);
        distribute(x + 1, y + 1, error, 1 / 16);
      }

      if (dithering === "atkinson") {
        distribute(x + 1, y, error, 1 / 8);
        distribute(x + 2, y, error, 1 / 8);
        distribute(x - 1, y + 1, error, 1 / 8);
        distribute(x, y + 1, error, 1 / 8);
        distribute(x + 1, y + 1, error, 1 / 8);
        distribute(x, y + 2, error, 1 / 8);
      }
    }
  }

  return output;
}
