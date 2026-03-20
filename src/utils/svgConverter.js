/**
 * Image to SVG converter utility
 * Converts raster images to SVG using edge detection and path tracing
 */

/**
 * Converts image to SVG using posterization
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {Object} options - Conversion options
 * @returns {string} SVG string
 */
export function convertToSvg(canvas, options = {}) {
  const {
    mode = "logo", // 'logo' or 'photo'
    colors = 8,
    smoothing = 2,
    detail = 5,
    width = canvas.width,
    height = canvas.height,
    preserveAspectRatio = true,
  } = options;

  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Posterize image
  const posterized = posterizeImage(imageData, colors, mode);

  // Extract color layers
  const colorLayers = extractColorLayers(posterized, colors);

  // Generate SVG paths for each color
  const paths = colorLayers.map((layer) => {
    const path = tracePath(layer, smoothing, detail);
    return { color: layer.color, path };
  });

  // Build SVG
  const svgWidth = preserveAspectRatio ? width : canvas.width;
  const svgHeight = preserveAspectRatio ? height : canvas.height;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${svgWidth}" height="${svgHeight}">`;

  for (const { color, path } of paths) {
    if (path) {
      svg += `<path fill="${color}" d="${path}"/>`;
    }
  }

  svg += "</svg>";

  return svg;
}

/**
 * Posterizes an image to reduce colors
 * @param {ImageData} imageData - Source image data
 * @param {number} colors - Number of colors
 * @param {string} mode - 'logo' or 'photo'
 * @returns {ImageData} Posterized image data
 */
function posterizeImage(imageData, colors, mode) {
  const data = new Uint8ClampedArray(imageData.data);
  const levels = mode === "logo" ? colors : Math.max(colors, 16);
  const step = 255 / (levels - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * Extracts color layers from posterized image
 * @param {ImageData} imageData - Posterized image data
 * @param {number} maxColors - Maximum number of colors
 * @returns {Array} Array of color layers
 */
function extractColorLayers(imageData, maxColors) {
  const colorMap = new Map();
  const data = imageData.data;

  // Count colors
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue; // Skip transparent pixels

    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by frequency and take top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors);

  // Create layers
  return sortedColors.map(([colorKey, count]) => {
    const [r, g, b] = colorKey.split(",").map(Number);
    const layer = new Uint8ClampedArray(imageData.width * imageData.height);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      if (
        data[i] === r &&
        data[i + 1] === g &&
        data[i + 2] === b &&
        data[i + 3] >= 128
      ) {
        layer[j] = 1;
      }
    }

    return {
      color: `rgb(${r},${g},${b})`,
      data: layer,
      width: imageData.width,
      height: imageData.height,
    };
  });
}

/**
 * Traces a path from a binary layer
 * @param {Object} layer - Color layer
 * @param {number} smoothing - Smoothing factor
 * @param {number} detail - Detail level
 * @returns {string} SVG path data
 */
function tracePath(layer, smoothing, detail) {
  const { data, width, height } = layer;
  const paths = [];
  const visited = new Uint8Array(data.length);

  // Find contours
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (data[idx] && !visited[idx]) {
        const contour = traceContour(data, visited, width, height, x, y);
        if (contour.length > 2) {
          paths.push(contourToPath(contour, smoothing));
        }
      }
    }
  }

  return paths.join(" ");
}

/**
 * Traces a contour starting from a point
 * @param {Uint8ClampedArray} data - Layer data
 * @param {Uint8Array} visited - Visited pixels
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} startX - Start X
 * @param {number} startY - Start Y
 * @returns {Array} Contour points
 */
function traceContour(data, visited, width, height, startX, startY) {
  const contour = [];
  const directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  let x = startX;
  let y = startY;
  let dir = 0;

  do {
    const idx = y * width + x;
    visited[idx] = 1;
    contour.push([x, y]);

    let found = false;
    for (let i = 0; i < 8; i++) {
      const newDir = (dir + i) % 8;
      const nx = x + directions[newDir][0];
      const ny = y + directions[newDir][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (data[nidx] && !visited[nidx]) {
          x = nx;
          y = ny;
          dir = newDir;
          found = true;
          break;
        }
      }
    }

    if (!found) break;
  } while (x !== startX || y !== startY);

  return contour;
}

/**
 * Converts contour points to SVG path
 * @param {Array} contour - Contour points
 * @param {number} smoothing - Smoothing factor
 * @returns {string} SVG path data
 */
function contourToPath(contour, smoothing) {
  if (contour.length === 0) return "";

  // Simplify contour
  const simplified = simplifyPath(contour, smoothing);

  if (simplified.length < 2) return "";

  let path = `M${simplified[0][0]},${simplified[0][1]}`;

  for (let i = 1; i < simplified.length; i++) {
    path += ` L${simplified[i][0]},${simplified[i][1]}`;
  }

  path += " Z";
  return path;
}

/**
 * Simplifies a path using Douglas-Peucker algorithm
 * @param {Array} points - Path points
 * @param {number} tolerance - Simplification tolerance
 * @returns {Array} Simplified points
 */
function simplifyPath(points, tolerance) {
  if (points.length <= 2) return points;

  const sqTolerance = tolerance * tolerance;

  // Find point with maximum distance
  let maxDist = 0;
  let maxIndex = 0;

  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistanceSq(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDist > sqTolerance) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPath(points.slice(maxIndex), tolerance);
    return left.slice(0, -1).concat(right);
  }

  return [first, last];
}

/**
 * Calculates squared perpendicular distance from point to line
 * @param {Array} point - Point [x, y]
 * @param {Array} lineStart - Line start [x, y]
 * @param {Array} lineEnd - Line end [x, y]
 * @returns {number} Squared distance
 */
function perpendicularDistanceSq(point, lineStart, lineEnd) {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];

  if (dx === 0 && dy === 0) {
    const pdx = point[0] - lineStart[0];
    const pdy = point[1] - lineStart[1];
    return pdx * pdx + pdy * pdy;
  }

  const t =
    ((point[0] - lineStart[0]) * dx + (point[1] - lineStart[1]) * dy) /
    (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));

  const projX = lineStart[0] + clampedT * dx;
  const projY = lineStart[1] + clampedT * dy;

  const pdx = point[0] - projX;
  const pdy = point[1] - projY;

  return pdx * pdx + pdy * pdy;
}
