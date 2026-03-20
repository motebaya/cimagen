import { loadFont } from "./fontLoader.js";

const BASE = import.meta.env.BASE_URL;
const FONT_SIZE = 108;
const PADDING_X = 50;
const PADDING_Y = 20;
const LINE_SPACING = 30;
const PADDING_BOTTOM = 50;
const LETTER_SPACING = 1.7;
const BORDER_RADIUS = 15;
const STROKE_WIDTH = 5;

/**
 * Draws a rounded rectangle path on the canvas context using quadratic curves.
 * Radius is automatically clamped to half of the smaller dimension.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {number} x - Top-left X coordinate
 * @param {number} y - Top-left Y coordinate
 * @param {number} w - Rectangle width
 * @param {number} h - Rectangle height
 * @param {number} r - Corner radius
 */
function roundedRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Measures the total width of a text line with custom letter spacing applied.
 * Matches Python's approach: sum(font.getlength(x) + spacing for x in line) - spacing
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context with font already set
 * @param {string} line - Text line to measure
 * @param {number} spacing - Letter spacing in pixels
 * @returns {number} Total width in pixels including letter spacing
 */
function measureLineWithSpacing(ctx, line, spacing) {
  let total = 0;
  for (let i = 0; i < line.length; i++) {
    total += ctx.measureText(line[i]).width;
    if (i < line.length - 1) {
      total += spacing;
    }
  }
  return total;
}

/**
 * Loads an image from a source URL and returns it as an HTMLImageElement.
 * Sets crossOrigin for non-data URLs to avoid CORS taint issues.
 *
 * @param {string} src - Image source URL or data URL
 * @returns {Promise<HTMLImageElement>} Loaded image element
 * @throws {Error} If image fails to load or is corrupted
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error(
          "Failed to load image. The file may be corrupted or unsupported.",
        ),
      );
    // data: URLs don't need crossOrigin, but remote URLs do
    if (src && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

/**
 * Renders a statistic frame overlay on a background image.
 * Port of statistic_frame.py - adds white rounded rectangles with text at top and bottom of image.
 * Text is rendered in uppercase with Helvetica LT Std Compressed font, white fill, and black stroke.
 *
 * @param {HTMLCanvasElement} canvas - Target canvas element to render on
 * @param {string} imageSrc - Background image source URL or data URL
 * @param {string} topText - Text for top overlay (supports newlines)
 * @param {string} bottomText - Text for bottom overlay (supports newlines)
 * @returns {Promise<void>} Resolves when rendering is complete
 * @throws {Error} If canvas or imageSrc is missing
 */
export async function renderStatisticFrame(
  canvas,
  imageSrc,
  topText,
  bottomText,
) {
  if (!canvas) throw new Error("Canvas element is required");
  if (!imageSrc) throw new Error("Image source is required");

  await loadFont("HelveticaLTStd", `${BASE}fonts/HelveticaLTStd-Comp.otf`);

  const img = await loadImage(imageSrc);

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");

  // Draw the background image
  ctx.drawImage(img, 0, 0);

  // Combine text and uppercase it (matching Python's text.upper())
  const fullText = [topText, bottomText]
    .filter(Boolean)
    .join("\n")
    .toUpperCase();
  if (!fullText.trim()) return;

  const lines = fullText.split("\n").filter((l) => l.length > 0);
  if (lines.length === 0) return;

  ctx.font = `${FONT_SIZE}px HelveticaLTStd`;

  // Measure each line - matching Python's approach:
  //   lboxs = [draw.textbbox((0, 0), line, font=font) for line in lines]
  //   lw = [x[2] - x[0] for x in lboxs]
  //   lh = [x[3] - x[1] for x in lboxs]
  const lineMetrics = lines.map((line) => {
    const metrics = ctx.measureText(line);
    const ascent = metrics.actualBoundingBoxAscent || FONT_SIZE * 0.8;
    const descent = metrics.actualBoundingBoxDescent || FONT_SIZE * 0.2;
    const h = ascent + descent;
    // Python: w = bbox[2] - bbox[0] (textbbox width, used for centering text)
    const textboxWidth = metrics.width;
    // Python: lwh = sum(font.getlength(x) + spacing for x in line) - spacing
    const widthWithSpacing = measureLineWithSpacing(ctx, line, LETTER_SPACING);
    // Python: lht = font.getbbox(line)[3] - font.getbbox(line)[1] (used for bg height)
    return {
      textboxWidth,
      height: h || FONT_SIZE,
      widthWithSpacing,
      ascent,
    };
  });

  // Calculate total text height (Python: th = sum(lh) + (len(lines) - 1) * line_spaces)
  const totalHeight =
    lineMetrics.reduce((sum, m) => sum + m.height, 0) +
    (lines.length - 1) * LINE_SPACING;

  // Starting y position (Python: y = img.height - th - 50)
  let y = canvas.height - totalHeight - PADDING_BOTTOM;

  // Draw each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { textboxWidth, height, widthWithSpacing } = lineMetrics[i];

    // Python: lx = (img.width - w) // 2
    // In Python, lx is based on textbbox width for text positioning
    const lx = (canvas.width - textboxWidth) / 2;

    // Background rectangle centered on widthWithSpacing
    // Python: bg_x1 = lx - px, bg_x2 = lx + lwh + px
    const bgX = lx - PADDING_X;
    const bgY = y - PADDING_Y;
    const bgW = widthWithSpacing + PADDING_X * 2;
    const bgH = height + PADDING_Y * 2;

    // Draw rounded rectangle background (white with ~70% opacity)
    // Python: fill=(255, 255, 255, 180) -> 180/255 = 0.706
    ctx.save();
    roundedRect(ctx, bgX, bgY, bgW, bgH, BORDER_RADIUS);
    ctx.fillStyle = "rgba(255, 255, 255, 0.706)";
    ctx.fill();
    ctx.restore();

    // Draw each character with stroke
    // Python draws stroke first (stroke_fill), then fill on top
    ctx.font = `${FONT_SIZE}px HelveticaLTStd`;
    ctx.textBaseline = "top";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let charX = lx;
    for (const char of line) {
      // Draw stroke (black outline)
      // Python: stroke_width=5 -> Canvas strokeText with lineWidth = STROKE_WIDTH * 2
      // because Canvas strokes centered on the path (half inside, half outside)
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.lineWidth = STROKE_WIDTH * 2;
      ctx.strokeText(char, charX, y);

      // Draw fill (white text on top)
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillText(char, charX, y);

      // Advance: Python: lx += font.getlength(char) + 1.7
      charX += ctx.measureText(char).width + LETTER_SPACING;
    }

    // Python: y += h + line_spaces
    y += height + LINE_SPACING;
  }
}
