/**
 * P*or*n Hub logo generator
 * date: 2026-03-20 - 4:38 PM
 * @github.com/motebaya
 */

/**
 * Applies rounded corners to a canvas using ellipse clipping.
 * Creates a new canvas with the same dimensions and clips the content to a rounded rectangle path.
 *
 * @param {HTMLCanvasElement} canvas - Source canvas to apply rounded corners to
 * @param {number} radius - Corner radius in pixels
 * @returns {HTMLCanvasElement} New canvas with rounded corners applied
 */
export function addRoundedCorners(canvas, radius) {
  const result = document.createElement("canvas");
  result.width = canvas.width;
  result.height = canvas.height;
  const ctx = result.getContext("2d");

  // Create rounded rectangle mask using arcs for proper circular corners
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(canvas.width - radius, 0);
  ctx.arc(canvas.width - radius, radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(canvas.width, canvas.height - radius);
  ctx.arc(
    canvas.width - radius,
    canvas.height - radius,
    radius,
    0,
    Math.PI / 2,
  );
  ctx.lineTo(radius, canvas.height);
  ctx.arc(radius, canvas.height - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(0, radius);
  ctx.arc(radius, radius, radius, Math.PI, -Math.PI / 2);
  ctx.closePath();
  ctx.clip();

  // Draw original image
  ctx.drawImage(canvas, 0, 0);

  return result;
}

/**
 * Renders P*or*n Hub style logo with white text and orange box with rounded corners.
 * Creates a horizontal composition on black background with 110px Expressway font.
 *
 * @param {string} text1 - Left text rendered in white
 * @param {string} text2 - Right text rendered in black on orange background box
 * @param {string} fontPath - URL path to the Expressway font file (expressway-rg.ttf)
 * @returns {Promise<HTMLCanvasElement>} Canvas containing the complete logo composition
 */
export async function renderPhLogo(text1, text2, fontPath) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Load font
  const font = new FontFace("Expressway", `url(${fontPath})`);
  await font.load();
  document.fonts.add(font);

  // Measure text
  ctx.font = "110px Expressway";
  const text1Metrics = ctx.measureText(text1);
  const text2Metrics = ctx.measureText(text2);

  // Create orange box for text2 with rounded corners
  const orangeWidth = text2Metrics.width + 20;
  const orangeHeight = 140;

  // Create orange box canvas
  const orangeCanvas = document.createElement("canvas");
  orangeCanvas.width = orangeWidth;
  orangeCanvas.height = orangeHeight;
  const orangeCtx = orangeCanvas.getContext("2d");

  // Fill orange background
  orangeCtx.fillStyle = "#F09800"; // rgb(240, 152, 0)
  orangeCtx.fillRect(0, 0, orangeWidth, orangeHeight);

  // Draw text2 on orange canvas
  orangeCtx.font = "110px Expressway";
  orangeCtx.fillStyle = "#000000";
  orangeCtx.textBaseline = "top";
  const text2Y = (orangeHeight - text2Metrics.actualBoundingBoxAscent) / 2 - 10;
  orangeCtx.fillText(text2, 10, text2Y);

  // Apply rounded corners to orange box
  const roundedOrange = addRoundedCorners(orangeCanvas, 17);

  // Calculate final canvas size
  const padding = 80;
  const finalWidth = padding + text1Metrics.width + 20 + orangeWidth + padding;
  const finalHeight = 600;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Fill black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, finalWidth, finalHeight);

  // Calculate vertical centering
  const centerY = (finalHeight - orangeHeight) / 2;

  // Draw text1 (white)
  ctx.font = "110px Expressway";
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "top";
  ctx.fillText(text1, padding, centerY);

  // Draw rounded orange box with text2
  const orangeX = padding + text1Metrics.width + 20;
  const orangeY = centerY;
  ctx.drawImage(roundedOrange, orangeX, orangeY);

  return canvas;
}
