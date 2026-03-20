/**
 * Blackpink text generator
 * date: 2026-03-20 - 4:38 PM
 * @github.com/motebaya
 */

/**
 * Renders text in Blackpink style with pink text on black background and pink border.
 * Creates a three-layer composition: text layer, border layer, and final padded canvas.
 *
 * @param {string} text - Text to render in Blackpink style
 * @param {string} fontPath - URL path to the Blackpink font file (blackpink.otf)
 * @returns {Promise<HTMLCanvasElement>} Canvas containing the rendered Blackpink-style text with border and padding
 */
export async function renderBlackpink(text, fontPath) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Load font
  const font = new FontFace("Blackpink", `url(${fontPath})`);
  await font.load();
  document.fonts.add(font);

  // Measure text with font size 230
  ctx.font = "230px Blackpink";
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = 230; // Font size

  // Create initial canvas with text
  const imgWidth = textWidth + 100;
  const imgHeight = textHeight;
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, imgWidth, imgHeight);

  // Draw pink text
  ctx.font = "230px Blackpink";
  ctx.fillStyle = "#FF94E0"; // rgb(255, 148, 224)
  ctx.textBaseline = "top";
  const textX = imgWidth / 2 - textWidth / 2;
  ctx.fillText(text, textX, -25);

  // Create border layer (paste function)
  const borderCanvas = document.createElement("canvas");
  const borderCtx = borderCanvas.getContext("2d");
  borderCanvas.width = imgWidth + 20;
  borderCanvas.height = imgHeight + 20;
  borderCtx.fillStyle = "#FF94E0";
  borderCtx.fillRect(0, 0, borderCanvas.width, borderCanvas.height);

  // Paste original image centered
  const pasteX = borderCanvas.width / 2 - imgWidth / 2;
  const pasteY = borderCanvas.height / 2 - imgHeight / 2;
  borderCtx.drawImage(canvas, pasteX, pasteY);

  // Create final canvas with padding
  const finalCanvas = document.createElement("canvas");
  const finalCtx = finalCanvas.getContext("2d");
  finalCanvas.width = borderCanvas.width + 400;
  finalCanvas.height = borderCanvas.height + 400;
  finalCtx.fillStyle = "#000000";
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Center the bordered image
  const finalX = finalCanvas.width / 2 - borderCanvas.width / 2;
  const finalY = finalCanvas.height / 2 - borderCanvas.height / 2;
  finalCtx.drawImage(borderCanvas, finalX, finalY);

  return finalCanvas;
}
