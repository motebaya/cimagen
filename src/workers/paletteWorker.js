function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map((value) =>
      clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function colorDistance(left, right) {
  return Math.sqrt(
    (left.r - right.r) ** 2 + (left.g - right.g) ** 2 + (left.b - right.b) ** 2,
  );
}

function clusterPixels(pixels, count) {
  const clusters = [];
  const limit = Math.min(count, pixels.length);

  for (let index = 0; index < limit; index += 1) {
    const pixel =
      pixels[Math.floor((index / limit) * pixels.length)] || pixels[0];
    clusters.push({ ...pixel });
  }

  for (let iteration = 0; iteration < 12; iteration += 1) {
    const buckets = clusters.map(() => ({ r: 0, g: 0, b: 0, total: 0 }));

    pixels.forEach((pixel) => {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      clusters.forEach((cluster, clusterIndex) => {
        const distance = colorDistance(pixel, cluster);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = clusterIndex;
        }
      });

      buckets[nearestIndex].r += pixel.r;
      buckets[nearestIndex].g += pixel.g;
      buckets[nearestIndex].b += pixel.b;
      buckets[nearestIndex].total += 1;
    });

    buckets.forEach((bucket, index) => {
      if (!bucket.total) {
        return;
      }

      clusters[index] = {
        r: bucket.r / bucket.total,
        g: bucket.g / bucket.total,
        b: bucket.b / bucket.total,
      };
    });
  }

  return clusters;
}

function assignPercentages(pixels, clusters) {
  const totals = clusters.map(() => 0);

  pixels.forEach((pixel) => {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    clusters.forEach((cluster, clusterIndex) => {
      const distance = colorDistance(pixel, cluster);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = clusterIndex;
      }
    });

    totals[nearestIndex] += 1;
  });

  return clusters
    .map((cluster, index) => {
      const hsl = rgbToHsl(cluster.r, cluster.g, cluster.b);
      return {
        rgb: {
          r: Math.round(cluster.r),
          g: Math.round(cluster.g),
          b: Math.round(cluster.b),
        },
        hex: rgbToHex(cluster.r, cluster.g, cluster.b),
        hsl,
        percentage: pixels.length ? (totals[index] / pixels.length) * 100 : 0,
      };
    })
    .sort((left, right) => right.percentage - left.percentage);
}

function averageColor(pixels) {
  const totals = pixels.reduce(
    (accumulator, pixel) => {
      accumulator.r += pixel.r;
      accumulator.g += pixel.g;
      accumulator.b += pixel.b;
      return accumulator;
    },
    { r: 0, g: 0, b: 0 },
  );

  if (pixels.length === 0) {
    return {
      rgb: { r: 0, g: 0, b: 0 },
      hex: "#000000",
      hsl: { h: 0, s: 0, l: 0 },
    };
  }

  const red = totals.r / pixels.length;
  const green = totals.g / pixels.length;
  const blue = totals.b / pixels.length;

  return {
    rgb: {
      r: Math.round(red),
      g: Math.round(green),
      b: Math.round(blue),
    },
    hex: rgbToHex(red, green, blue),
    hsl: rgbToHsl(red, green, blue),
  };
}

self.onmessage = (event) => {
  const { id, pixels, colorCount = 8 } = event.data;

  try {
    const clusters = clusterPixels(pixels, colorCount);
    const palette = assignPercentages(pixels, clusters);

    self.postMessage({
      id,
      palette,
      average: averageColor(pixels),
      sampleCount: pixels.length,
    });
  } catch (error) {
    self.postMessage({
      id,
      error:
        error instanceof Error ? error.message : "Palette extraction failed",
    });
  }
};
