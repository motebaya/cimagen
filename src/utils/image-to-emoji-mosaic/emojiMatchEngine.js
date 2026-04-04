import { clamp, getBackgroundRgb, toColorMeta } from "./emojiHelpers.js";

function colorDistance(left, right) {
  return Math.sqrt(
    (left.r - right.rgb[0]) ** 2 +
      (left.g - right.rgb[1]) ** 2 +
      (left.b - right.rgb[2]) ** 2,
  );
}

function hueDistance(left, right) {
  const difference = Math.abs(left - right);
  return Math.min(difference, 360 - difference) / 180;
}

export function getWorkingGrid(sourceWidth, sourceHeight, options) {
  const columns = Math.max(4, Math.round(options.columns || 48));

  if (!options.preserveAspectRatio) {
    return {
      columns,
      rows: Math.max(4, Math.round(options.rows || 32)),
    };
  }

  const aspectCompensation = options.aspectCompensation || 0.58;
  return {
    columns,
    rows: Math.max(
      4,
      Math.round((sourceHeight / sourceWidth) * columns * aspectCompensation),
    ),
  };
}

export function sampleBlockAverage(
  imageData,
  width,
  height,
  tileX,
  tileY,
  density,
  backgroundRgb,
) {
  const startX = tileX * density;
  const startY = tileY * density;
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let totalAlpha = 0;
  let samples = 0;

  for (let y = startY; y < Math.min(height, startY + density); y += 1) {
    for (let x = startX; x < Math.min(width, startX + density); x += 1) {
      const index = (y * width + x) * 4;
      const alpha = imageData.data[index + 3] / 255;
      let red = imageData.data[index];
      let green = imageData.data[index + 1];
      let blue = imageData.data[index + 2];

      if (backgroundRgb) {
        red = red * alpha + backgroundRgb[0] * (1 - alpha);
        green = green * alpha + backgroundRgb[1] * (1 - alpha);
        blue = blue * alpha + backgroundRgb[2] * (1 - alpha);
      }

      totalRed += red;
      totalGreen += green;
      totalBlue += blue;
      totalAlpha += alpha;
      samples += 1;
    }
  }

  const averageRed = totalRed / samples;
  const averageGreen = totalGreen / samples;
  const averageBlue = totalBlue / samples;
  const max = Math.max(averageRed, averageGreen, averageBlue);
  const min = Math.min(averageRed, averageGreen, averageBlue);

  return {
    r: averageRed,
    g: averageGreen,
    b: averageBlue,
    alpha: totalAlpha / samples,
    luminance: 0.299 * averageRed + 0.587 * averageGreen + 0.114 * averageBlue,
    saturation: max === 0 ? 0 : (max - min) / max,
    hue: toColorMeta("_", [averageRed, averageGreen, averageBlue], "sample")
      .hue,
  };
}

function scoreEmoji(sample, candidate, matchMode, weights) {
  const colorScore = colorDistance(sample, candidate) / 255;
  const brightnessScore =
    Math.abs(sample.luminance - candidate.luminance) / 255;
  const saturationScore = Math.abs(sample.saturation - candidate.saturation);
  const hueScore = hueDistance(sample.hue, candidate.hue);

  if (matchMode === "brightness") {
    return brightnessScore + saturationScore * 0.35;
  }

  if (matchMode === "hybrid") {
    return (
      colorScore +
      brightnessScore * (weights.brightnessWeight || 0.65) +
      saturationScore * (weights.saturationWeight || 0.35)
    );
  }

  if (matchMode === "palette") {
    return hueScore * 0.8 + saturationScore * 0.8 + brightnessScore * 0.3;
  }

  return colorScore + brightnessScore * (weights.luminanceWeight || 0.45);
}

export function getNearestEmoji(sample, dataset, matchMode, weights) {
  let winner = dataset[0];
  let bestScore = Number.POSITIVE_INFINITY;

  dataset.forEach((candidate) => {
    const score = scoreEmoji(sample, candidate, matchMode, weights);
    if (score < bestScore) {
      bestScore = score;
      winner = candidate;
    }
  });

  return winner;
}

export function trimMosaic(result) {
  let top = 0;
  let bottom = result.rows.length - 1;
  let left = 0;
  let right = result.columns - 1;

  while (top <= bottom && result.rows[top].every((cell) => cell.isEmpty)) {
    top += 1;
  }

  while (bottom >= top && result.rows[bottom].every((cell) => cell.isEmpty)) {
    bottom -= 1;
  }

  while (
    left <= right &&
    result.rows.every((row, index) =>
      index < top || index > bottom ? true : row[left].isEmpty,
    )
  ) {
    left += 1;
  }

  while (
    right >= left &&
    result.rows.every((row, index) =>
      index < top || index > bottom ? true : row[right].isEmpty,
    )
  ) {
    right -= 1;
  }

  const nextRows = result.rows
    .slice(top, bottom + 1)
    .map((row) => row.slice(left, right + 1));

  return {
    ...result,
    rows: nextRows,
    columns: nextRows[0]?.length || 0,
    rowCount: nextRows.length,
    text: nextRows
      .map((row) => row.map((cell) => cell.emoji).join(""))
      .join("\n"),
  };
}

export { getBackgroundRgb, clamp };
