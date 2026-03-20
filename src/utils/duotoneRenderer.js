/**
 * Duotone image renderer.
 * Port of green_duotone.py — converts images to Pink x Green duotone.
 *
 * Uses Rec. 709 luminance formula with a contrast S-curve,
 * then maps normalized luminance to a two-color gradient.
 */

// Color presets matching the Python constants
const PRESETS = {
  optimized: {
    shadow: [22, 80, 39], // #165027
    highlight: [249, 159, 210], // #F99FD2
  },
  classic: {
    shadow: [27, 96, 47], // #1b602f
    highlight: [247, 132, 197], // #f784c5
  },
};

/**
 * Available duotone filter modes.
 */
export const DUOTONE_FILTERS = [
  { id: "original", label: "Original", classic: false, reverse: false },
  { id: "classic", label: "Classic", classic: true, reverse: false },
  { id: "reverse", label: "Reverse", classic: false, reverse: true },
  {
    id: "classic_reverse",
    label: "Classic & Reverse",
    classic: true,
    reverse: true,
  },
];

/**
 * Loads an image from a source URL and returns it as an HTMLImageElement.
 * Sets crossOrigin for non-data URLs to avoid CORS taint issues.
 *
 * @param {string} src - Image source URL or data URL
 * @returns {Promise<HTMLImageElement>} Loaded image element
 * @throws {Error} If image fails to load
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    if (src && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

/**
 * Applies a contrast S-curve to a normalized luminance value.
 * Matches Python implementation: enhances contrast by darkening shadows and brightening highlights.
 * Formula: norm < 0.5 → pow(norm * 2, 1.8) / 2, else → 1 - pow((1 - norm) * 2, 1.8) / 2
 *
 * @param {number} value - Normalized luminance value (0.0-1.0)
 * @returns {number} Contrast-adjusted value (0.0-1.0)
 */
function contrastCurve(value) {
  if (value < 0.5) {
    return Math.pow(value * 2, 1.8) / 2;
  }
  return 1 - Math.pow((1 - value) * 2, 1.8) / 2;
}

/**
 * Renders a duotone effect on a canvas.
 *
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {string} imageSrc - Image source (data URL or path)
 * @param {object} options
 * @param {boolean} options.classic - Use classic color preset
 * @param {boolean} options.reverse - Swap shadow and highlight colors
 */
export async function renderDuotone(
  canvas,
  imageSrc,
  { classic = false, reverse = false } = {},
) {
  if (!canvas) throw new Error("Canvas element is required");
  if (!imageSrc) throw new Error("Image source is required");

  const img = await loadImage(imageSrc);

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data; // Uint8ClampedArray [R,G,B,A, R,G,B,A, ...]

  // Select color preset
  const preset = classic ? PRESETS.classic : PRESETS.optimized;
  let shadow = preset.shadow;
  let highlight = preset.highlight;

  // Reverse swaps shadow and highlight
  if (reverse) {
    [shadow, highlight] = [highlight, shadow];
  }

  // --- Step 1: Calculate luminance for all pixels (Rec. 709) ---
  const totalPixels = canvas.width * canvas.height;
  const luminance = new Float32Array(totalPixels);

  let minL = Infinity;
  let maxL = -Infinity;

  for (let i = 0; i < totalPixels; i++) {
    const offset = i * 4;
    const l =
      0.2126 * pixels[offset] +
      0.7152 * pixels[offset + 1] +
      0.0722 * pixels[offset + 2];
    luminance[i] = l;
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
  }

  // --- Step 2: Normalize and apply contrast curve ---
  const range = maxL - minL + 1e-6; // avoid division by zero (matching Python's 1e-6)

  for (let i = 0; i < totalPixels; i++) {
    luminance[i] = contrastCurve((luminance[i] - minL) / range);
  }

  // --- Step 3: Map to duotone colors ---
  // Python: result = shadow + norm * (highlight - shadow)
  const dR = highlight[0] - shadow[0];
  const dG = highlight[1] - shadow[1];
  const dB = highlight[2] - shadow[2];

  for (let i = 0; i < totalPixels; i++) {
    const offset = i * 4;
    const n = luminance[i];
    pixels[offset] = Math.min(255, Math.max(0, shadow[0] + n * dR)); // R
    pixels[offset + 1] = Math.min(255, Math.max(0, shadow[1] + n * dG)); // G
    pixels[offset + 2] = Math.min(255, Math.max(0, shadow[2] + n * dB)); // B
    // Alpha channel (offset + 3) left unchanged
  }

  ctx.putImageData(imageData, 0, 0);
}
