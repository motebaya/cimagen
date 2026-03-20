/**
 * Image degradation utility
 * Creates realistic low-resolution effects with multiple degradation techniques
 */

/**
 * Degrades an image to simulate low resolution
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {Object} options - Degradation options
 * @returns {Promise<HTMLCanvasElement>} Degraded canvas
 */
export async function degradeImage(canvas, options = {}) {
  const {
    level = 5, // 1-100
    addJpegArtifacts = true,
    addBlur = true,
    reduceColors = false,
  } = options;

  // Recalibrated scale factor for 1-100 range
  // Level 1 = 98% (minimal), Level 100 = 5% (maximum)
  const scaleFactor = Math.max(0.05, 1 - level * 0.0093);

  // Step 1: Downscale
  const downscaled = downscaleCanvas(canvas, scaleFactor);

  // Step 2: Apply JPEG compression artifacts
  let result = downscaled;
  if (addJpegArtifacts) {
    // Quality: level 1 = 0.98, level 100 = 0.1
    const quality = Math.max(0.1, 1 - level * 0.0088);
    result = await applyJpegArtifacts(result, quality);
  }

  // Step 3: Apply blur (more conservative)
  if (addBlur) {
    // Blur radius: level 1 = 0.05px, level 100 = 3px
    const blurRadius = level * 0.03;
    result = applyBlur(result, blurRadius);
  }

  // Step 4: Reduce colors
  if (reduceColors) {
    // Color levels: level 1 = 256, level 100 = 8
    const colorLevels = Math.max(8, Math.floor(256 - level * 2.48));
    result = reduceColorDepth(result, colorLevels);
  }

  // Step 5: Upscale back to original size
  const upscaled = upscaleCanvas(result, canvas.width, canvas.height);

  return upscaled;
}

/**
 * Downscales a canvas
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} scale - Scale factor (0-1)
 * @returns {HTMLCanvasElement} Downscaled canvas
 */
function downscaleCanvas(canvas, scale) {
  const newWidth = Math.max(1, Math.floor(canvas.width * scale));
  const newHeight = Math.max(1, Math.floor(canvas.height * scale));

  const result = document.createElement("canvas");
  result.width = newWidth;
  result.height = newHeight;
  const ctx = result.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return result;
}

/**
 * Upscales a canvas
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {HTMLCanvasElement} Upscaled canvas
 */
function upscaleCanvas(canvas, width, height) {
  const result = document.createElement("canvas");
  result.width = width;
  result.height = height;
  const ctx = result.getContext("2d");

  // Use nearest neighbor for pixelated effect
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, width, height);

  return result;
}

/**
 * Applies JPEG compression artifacts
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<HTMLCanvasElement>} Canvas with artifacts
 */
function applyJpegArtifacts(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const img = new Image();
        img.onload = () => {
          const result = document.createElement("canvas");
          result.width = canvas.width;
          result.height = canvas.height;
          const ctx = result.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(result);
        };
        img.src = URL.createObjectURL(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Applies blur effect
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} radius - Blur radius
 * @returns {HTMLCanvasElement} Blurred canvas
 */
function applyBlur(canvas, radius) {
  if (radius < 0.5) return canvas;

  const result = document.createElement("canvas");
  result.width = canvas.width;
  result.height = canvas.height;
  const ctx = result.getContext("2d");

  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(canvas, 0, 0);

  return result;
}

/**
 * Reduces color depth
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} levels - Number of color levels per channel
 * @returns {HTMLCanvasElement} Color-reduced canvas
 */
function reduceColorDepth(canvas, levels) {
  const result = document.createElement("canvas");
  result.width = canvas.width;
  result.height = canvas.height;
  const ctx = result.getContext("2d");

  ctx.drawImage(canvas, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const step = 255 / (levels - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }

  ctx.putImageData(imageData, 0, 0);
  return result;
}

/**
 * Creates a comparison between original and degraded
 * @param {HTMLCanvasElement} original - Original canvas
 * @param {HTMLCanvasElement} degraded - Degraded canvas
 * @param {number} splitPosition - Split position (0-1)
 * @returns {HTMLCanvasElement} Comparison canvas
 */
export function createComparison(original, degraded, splitPosition = 0.5) {
  const canvas = document.createElement("canvas");
  canvas.width = original.width;
  canvas.height = original.height;
  const ctx = canvas.getContext("2d");

  const splitX = canvas.width * splitPosition;

  // Draw degraded (left side)
  ctx.drawImage(degraded, 0, 0);

  // Draw original (right side)
  ctx.save();
  ctx.beginPath();
  ctx.rect(splitX, 0, canvas.width - splitX, canvas.height);
  ctx.clip();
  ctx.drawImage(original, 0, 0);
  ctx.restore();

  // Draw split line
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, canvas.height);
  ctx.stroke();

  return canvas;
}
