/**
 * Wasted overlay generator
 * date: 2026-03-20 - 4:38 PM
 * @github.com/motebaya
 */

/**
 * Calculates proportional resize dimensions maintaining aspect ratio.
 * Ensures the larger dimension matches the target width while scaling the smaller dimension proportionally.
 *
 * @param {number} x - Original width
 * @param {number} y - Original height
 * @param {number} [width_=1000] - Target width for the larger dimension
 * @returns {number[]} Array containing [width, height] as integers
 */
export function resizeTo(x, y, width_ = 1000) {
  let width, height;
  if (x === y) {
    width = width_;
    height = width_;
  } else if (x > y) {
    width = width_;
    height = y / (x / width_);
  } else {
    width = x / (y / width_);
    height = width_;
  }
  return [Math.floor(width), Math.floor(height)];
}

/**
 * Renders GTA-style "wasted" overlay on an image.
 * Converts image to grayscale, adds semi-transparent black overlay, and renders red "wasted" text with black stroke.
 * Automatically resizes images smaller than 1000px to improve text visibility.
 *
 * @param {string|HTMLImageElement} image - Image source (data URL, path) or HTMLImageElement
 * @param {string} fontPath - URL path to the Pricedown font file (pricedown bl.ttf)
 * @returns {Promise<HTMLCanvasElement>} Canvas containing the grayscale image with "wasted" overlay
 */
export async function renderWasted(image, fontPath) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Load image
  let img;
  if (typeof image === "string") {
    img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = image;
    });
  } else {
    img = image;
  }

  // Resize if needed
  let targetWidth = img.width;
  let targetHeight = img.height;
  if (Math.max(img.width, img.height) < 1000) {
    [targetWidth, targetHeight] = resizeTo(img.width, img.height);
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw image and convert to grayscale
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);

  // Load font
  const fontSize = Math.floor(canvas.height / 7);
  const font = new FontFace("Pricedown", `url(${fontPath})`);
  await font.load();
  document.fonts.add(font);

  // Create overlay canvas
  const overlayCanvas = document.createElement("canvas");
  const overlayCtx = overlayCanvas.getContext("2d");
  overlayCanvas.width = canvas.width;
  overlayCanvas.height = Math.floor((canvas.height / 8) * 1.5);

  // Fill with semi-transparent black
  overlayCtx.fillStyle = "rgba(0, 0, 0, 0.39)"; // 100/255 ≈ 0.39
  overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // Draw "wasted" text
  overlayCtx.font = `${fontSize}px Pricedown`;
  overlayCtx.textBaseline = "middle";
  const text = "wasted";
  const textMetrics = overlayCtx.measureText(text);
  const textX = canvas.width / 2 - textMetrics.width / 2;
  const textY = overlayCanvas.height / 2;

  // Stroke
  overlayCtx.strokeStyle = "#000000";
  overlayCtx.lineWidth = Math.floor(fontSize / 10);
  overlayCtx.strokeText(text, textX, textY);

  // Fill
  overlayCtx.fillStyle = "#FF0044"; // rgb(255, 0, 68)
  overlayCtx.fillText(text, textX, textY);

  // Composite overlay onto main canvas
  const overlayY = canvas.height / 2 - overlayCanvas.height / 2;
  ctx.drawImage(overlayCanvas, 0, overlayY);

  return canvas;
}
