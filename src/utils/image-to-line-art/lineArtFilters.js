import { clamp } from "./lineArtHelpers.js";

export function imageDataToGray(imageData, brightness, contrast) {
  const gray = new Float32Array(imageData.width * imageData.height);

  for (let index = 0; index < gray.length; index += 1) {
    const pixelIndex = index * 4;
    const alpha = imageData.data[pixelIndex + 3] / 255;
    const luminance =
      imageData.data[pixelIndex] * 0.299 +
      imageData.data[pixelIndex + 1] * 0.587 +
      imageData.data[pixelIndex + 2] * 0.114;
    const brightened = luminance * brightness;
    gray[index] = clamp(128 + (brightened - 128) * contrast, 0, 255) * alpha;
  }

  return gray;
}

export function boxBlur(values, width, height, radius) {
  if (radius <= 0) {
    return values;
  }

  const result = new Float32Array(values.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      let total = 0;

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const sampleY = clamp(y + offsetY, 0, height - 1);
          sum += values[sampleY * width + sampleX];
          total += 1;
        }
      }

      result[y * width + x] = sum / total;
    }
  }

  return result;
}

export function sharpen(values, width, height, amount) {
  if (amount <= 0) {
    return values;
  }

  const blurred = boxBlur(values, width, height, 1);
  const result = new Float32Array(values.length);

  for (let index = 0; index < values.length; index += 1) {
    result[index] = clamp(
      values[index] + (values[index] - blurred[index]) * amount,
      0,
      255,
    );
  }

  return result;
}

export function autoContrast(values) {
  let min = 255;
  let max = 0;

  values.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  if (max <= min) {
    return values;
  }

  const result = new Float32Array(values.length);
  const scale = 255 / (max - min);

  for (let index = 0; index < values.length; index += 1) {
    result[index] = clamp((values[index] - min) * scale, 0, 255);
  }

  return result;
}

export function runSobel(values, width, height) {
  const result = new Float32Array(values.length);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const topLeft = values[index - width - 1];
      const top = values[index - width];
      const topRight = values[index - width + 1];
      const left = values[index - 1];
      const right = values[index + 1];
      const bottomLeft = values[index + width - 1];
      const bottom = values[index + width];
      const bottomRight = values[index + width + 1];

      const gx =
        -topLeft - 2 * left - bottomLeft + topRight + 2 * right + bottomRight;
      const gy =
        topLeft + 2 * top + topRight - bottomLeft - 2 * bottom - bottomRight;
      result[index] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return result;
}

export function runLaplacian(values, width, height) {
  const result = new Float32Array(values.length);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const value =
        8 * values[index] -
        values[index - width - 1] -
        values[index - width] -
        values[index - width + 1] -
        values[index - 1] -
        values[index + 1] -
        values[index + width - 1] -
        values[index + width] -
        values[index + width + 1];
      result[index] = Math.abs(value);
    }
  }

  return result;
}

export function runThresholdEdges(values, width, height) {
  const result = new Float32Array(values.length);

  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const index = y * width + x;
      const horizontal = Math.abs(values[index] - values[index + 1]);
      const vertical = Math.abs(values[index] - values[index + width]);
      result[index] = Math.max(horizontal, vertical);
    }
  }

  return result;
}

export function runDifferenceOfGaussian(values, width, height) {
  const smallBlur = boxBlur(values, width, height, 1);
  const largeBlur = boxBlur(values, width, height, 3);
  const result = new Float32Array(values.length);

  for (let index = 0; index < values.length; index += 1) {
    result[index] = Math.abs(smallBlur[index] - largeBlur[index]) * 3;
  }

  return result;
}

export function normalizeMap(values, strength) {
  let max = 0;
  values.forEach((value) => {
    max = Math.max(max, value);
  });

  if (max === 0) {
    return values;
  }

  const result = new Float32Array(values.length);
  for (let index = 0; index < values.length; index += 1) {
    result[index] = clamp((values[index] / max) * 255 * strength, 0, 255);
  }

  return result;
}

export function hysteresisThreshold(
  values,
  width,
  height,
  lowThreshold,
  highThreshold,
) {
  const result = new Uint8Array(values.length);
  const queue = [];

  for (let index = 0; index < values.length; index += 1) {
    if (values[index] >= highThreshold) {
      result[index] = 255;
      queue.push(index);
    }
  }

  while (queue.length > 0) {
    const current = queue.pop();
    const x = current % width;
    const y = Math.floor(current / width);

    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        if (offsetX === 0 && offsetY === 0) {
          continue;
        }

        const sampleX = x + offsetX;
        const sampleY = y + offsetY;
        if (
          sampleX < 0 ||
          sampleX >= width ||
          sampleY < 0 ||
          sampleY >= height
        ) {
          continue;
        }

        const neighborIndex = sampleY * width + sampleX;
        if (result[neighborIndex] || values[neighborIndex] < lowThreshold) {
          continue;
        }

        result[neighborIndex] = 255;
        queue.push(neighborIndex);
      }
    }
  }

  return result;
}

export function cleanupSpecks(binary, width, height, cleanupLevel) {
  if (cleanupLevel <= 0) {
    return binary;
  }

  let current = binary;

  for (let iteration = 0; iteration < cleanupLevel; iteration += 1) {
    const next = new Uint8Array(current.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (!current[index]) {
          continue;
        }

        let neighbors = 0;
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if (offsetX === 0 && offsetY === 0) {
              continue;
            }

            const sampleX = x + offsetX;
            const sampleY = y + offsetY;
            if (
              sampleX < 0 ||
              sampleX >= width ||
              sampleY < 0 ||
              sampleY >= height
            ) {
              continue;
            }

            if (current[sampleY * width + sampleX]) {
              neighbors += 1;
            }
          }
        }

        if (neighbors >= 2) {
          next[index] = 255;
        }
      }
    }

    current = next;
  }

  return current;
}

export function dilate(binary, width, height, iterations) {
  let current = binary;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const next = new Uint8Array(current.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (!current[index]) {
          continue;
        }

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const sampleX = x + offsetX;
            const sampleY = y + offsetY;
            if (
              sampleX < 0 ||
              sampleX >= width ||
              sampleY < 0 ||
              sampleY >= height
            ) {
              continue;
            }

            next[sampleY * width + sampleX] = 255;
          }
        }
      }
    }

    current = next;
  }

  return current;
}

export function erode(binary, width, height, iterations) {
  let current = binary;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const next = new Uint8Array(current.length);

    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        let keep = true;

        for (let offsetY = -1; offsetY <= 1 && keep; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const sampleIndex = (y + offsetY) * width + (x + offsetX);
            if (!current[sampleIndex]) {
              keep = false;
              break;
            }
          }
        }

        if (keep) {
          next[index] = 255;
        }
      }
    }

    current = next;
  }

  return current;
}
