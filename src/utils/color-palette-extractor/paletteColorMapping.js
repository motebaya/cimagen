import { colorDistance } from "./paletteHelpers.js";

function chooseRepresentativeHotspots(points, maxHotspots = 8) {
  if (!points.length) {
    return [];
  }

  const grid = new Map();

  points.forEach((point) => {
    const bucketX = Math.min(7, Math.max(0, Math.floor(point.nx * 8)));
    const bucketY = Math.min(7, Math.max(0, Math.floor(point.ny * 8)));
    const key = `${bucketX}-${bucketY}`;
    if (!grid.has(key)) {
      grid.set(key, {
        count: 0,
        nx: 0,
        ny: 0,
      });
    }

    const bucket = grid.get(key);
    bucket.count += 1;
    bucket.nx += point.nx;
    bucket.ny += point.ny;
  });

  return [...grid.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, maxHotspots)
    .map((bucket) => ({
      nx: bucket.nx / bucket.count,
      ny: bucket.ny / bucket.count,
      weight: bucket.count,
    }));
}

export function buildPaletteOverlayMap(sampledPixels, palette) {
  const grouped = palette.map(() => []);

  sampledPixels.forEach((pixel) => {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    palette.forEach((color, colorIndex) => {
      const distance = colorDistance(pixel, color.rgb);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = colorIndex;
      }
    });

    grouped[bestIndex].push(pixel);
  });

  return grouped.map((points) => {
    if (!points.length) {
      return {
        bounds: null,
        hotspots: [],
      };
    }

    let minX = 1;
    let minY = 1;
    let maxX = 0;
    let maxY = 0;

    points.forEach((point) => {
      minX = Math.min(minX, point.nx);
      minY = Math.min(minY, point.ny);
      maxX = Math.max(maxX, point.nx);
      maxY = Math.max(maxY, point.ny);
    });

    return {
      bounds: {
        x: minX,
        y: minY,
        width: Math.max(0.08, maxX - minX),
        height: Math.max(0.08, maxY - minY),
      },
      hotspots: chooseRepresentativeHotspots(points),
    };
  });
}
