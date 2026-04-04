function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(left, right) {
  return Math.sqrt(
    (left[0] - right[0]) ** 2 +
      (left[1] - right[1]) ** 2 +
      (left[2] - right[2]) ** 2,
  );
}

function averageColors(colors) {
  const totals = colors.reduce(
    (accumulator, color) => {
      accumulator[0] += color[0];
      accumulator[1] += color[1];
      accumulator[2] += color[2];
      return accumulator;
    },
    [0, 0, 0],
  );
  return totals.map((value) => value / Math.max(colors.length, 1));
}

function getPixel(imageData, width, x, y) {
  const index = (y * width + x) * 4;
  return [imageData[index], imageData[index + 1], imageData[index + 2]];
}

function sampleBorderColors(imageData, width, height) {
  const colors = [];
  const stride = Math.max(1, Math.round(Math.min(width, height) / 28));

  for (let x = 0; x < width; x += stride) {
    colors.push(getPixel(imageData, width, x, 0));
    colors.push(getPixel(imageData, width, x, height - 1));
  }

  for (let y = 0; y < height; y += stride) {
    colors.push(getPixel(imageData, width, 0, y));
    colors.push(getPixel(imageData, width, width - 1, y));
  }

  return averageColors(colors);
}

function createHeuristicMask(
  imageData,
  width,
  height,
  threshold,
  edgeTolerance,
) {
  const backgroundColor = sampleBorderColors(imageData, width, height);
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let queueStart = 0;
  let queueEnd = 0;

  const push = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    visited[index] = 1;
    queue[queueEnd] = index;
    queueEnd += 1;
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (queueStart < queueEnd) {
    const index = queue[queueStart];
    queueStart += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    const pixel = getPixel(imageData, width, x, y);
    const centerBias = Math.abs(x / width - 0.5) + Math.abs(y / height - 0.5);
    const localThreshold = threshold + centerBias * edgeTolerance;

    if (distance(pixel, backgroundColor) > localThreshold) {
      continue;
    }

    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  const mask = new Uint8ClampedArray(width * height);
  for (let index = 0; index < mask.length; index += 1) {
    mask[index] = visited[index] ? 0 : 255;
  }
  return mask;
}

function getNeighborAlpha(mask, width, height, x, y) {
  const sampleX = clamp(x, 0, width - 1);
  const sampleY = clamp(y, 0, height - 1);
  return mask[sampleY * width + sampleX] / 255;
}

function computeEdgeStrength(imageData, width, height, x, y) {
  const pixel = getPixel(imageData, width, x, y);
  const right = getPixel(imageData, width, clamp(x + 1, 0, width - 1), y);
  const bottom = getPixel(imageData, width, x, clamp(y + 1, 0, height - 1));
  const dx = distance(pixel, right);
  const dy = distance(pixel, bottom);
  return clamp((dx + dy) / 130, 0, 1);
}

function refineMask(
  imageData,
  width,
  height,
  baseMask,
  threshold,
  edgeTolerance,
  aggressiveness,
) {
  const backgroundColor = sampleBorderColors(imageData, width, height);
  const refined = new Uint8ClampedArray(width * height);
  const thresholdScale = Math.max(20, threshold + edgeTolerance * 0.8);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const pixel = getPixel(imageData, width, x, y);
      const baseAlpha = baseMask[index] / 255;
      const edgeStrength = computeEdgeStrength(imageData, width, height, x, y);
      const colorDistance = distance(pixel, backgroundColor);
      const colorScore = clamp(
        (colorDistance - thresholdScale * 0.18) / (thresholdScale * 0.92),
        0,
        1,
      );
      const neighborAverage =
        (getNeighborAlpha(baseMask, width, height, x + 1, y) +
          getNeighborAlpha(baseMask, width, height, x - 1, y) +
          getNeighborAlpha(baseMask, width, height, x, y + 1) +
          getNeighborAlpha(baseMask, width, height, x, y - 1)) /
        4;
      const boundaryBoost = Math.abs(baseAlpha - neighborAverage);
      const uncertainty = 1 - Math.abs(baseAlpha * 2 - 1);
      const refineInfluence = clamp(
        uncertainty * 0.72 +
          boundaryBoost * (0.85 + aggressiveness * 0.15) +
          edgeStrength * (0.18 + aggressiveness * 0.12),
        0,
        1,
      );
      const detailTarget = clamp(
        colorScore * (0.7 + aggressiveness * 0.05) +
          edgeStrength * (0.18 + aggressiveness * 0.07) +
          boundaryBoost * (0.12 + aggressiveness * 0.08),
        0,
        1,
      );

      let blended =
        baseAlpha * (1 - refineInfluence * 0.52) +
        detailTarget * (refineInfluence * 0.52);

      if (baseAlpha <= 0.08 && colorScore <= 0.6 && boundaryBoost <= 0.22) {
        blended = 0;
      } else if (
        baseAlpha <= 0.16 &&
        colorScore <= 0.5 &&
        edgeStrength <= 0.22 &&
        boundaryBoost <= 0.18
      ) {
        blended = Math.min(blended, 0.08);
      }

      if (baseAlpha > 0.96 && detailTarget > 0.45) {
        blended = 1;
      } else if (baseAlpha < 0.05 && detailTarget < 0.24) {
        blended = 0;
      }

      refined[index] = Math.round(clamp(blended, 0, 1) * 255);
    }
  }

  return refined;
}

function featherMask(mask, width, height, feather) {
  if (feather <= 0) return mask;

  const radius = Math.max(1, Math.round(feather / 4));
  const output = new Uint8ClampedArray(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      let total = 0;

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const sampleY = clamp(y + offsetY, 0, height - 1);
          sum += mask[sampleY * width + sampleX];
          total += 1;
        }
      }

      output[y * width + x] = sum / total;
    }
  }

  return output;
}

function handleSegmentHeuristic(payload) {
  const imageData = Uint8ClampedArray.from(payload.imageData);
  const mask = featherMask(
    createHeuristicMask(
      imageData,
      payload.width,
      payload.height,
      payload.threshold || 52,
      payload.edgeTolerance || 42,
    ),
    payload.width,
    payload.height,
    payload.feather || 12,
  );

  return {
    mask: Array.from(mask),
    width: payload.width,
    height: payload.height,
  };
}

function handleRefineMask(payload) {
  const imageData = Uint8ClampedArray.from(payload.imageData);
  const baseMask = Uint8ClampedArray.from(payload.baseMask);
  const refined = refineMask(
    imageData,
    payload.width,
    payload.height,
    baseMask,
    payload.threshold || 52,
    payload.edgeTolerance || 42,
    payload.aggressiveness || 0.55,
  );
  const feathered = featherMask(
    refined,
    payload.width,
    payload.height,
    Math.max(0, (payload.feather || 12) / 2),
  );

  return {
    mask: Array.from(feathered),
    width: payload.width,
    height: payload.height,
  };
}

self.onmessage = (event) => {
  const { id, task, payload } = event.data;

  try {
    let result;

    if (task === "segment-heuristic") {
      result = handleSegmentHeuristic(payload);
    } else if (task === "refine-mask") {
      result = handleRefineMask(payload);
    } else {
      throw new Error("Unsupported background removal worker task.");
    }

    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({
      id,
      error:
        error instanceof Error ? error.message : "Background removal failed",
    });
  }
};
