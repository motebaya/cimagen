/**
 * Paper Writer renderer
 * date: 2026-03-20 - 4:38 PM
 * @github.com/motebaya
 */

/**
 * Renders text onto lined paper template pages with handwritten-style font.
 * Automatically wraps text to fit line width (734px) and splits into multiple pages (25 lines per page).
 * Each page uses the same template background with text positioned at consistent coordinates.
 *
 * @param {string} text - Text content to render on paper pages
 * @param {string} fontPath - URL path to the IndieFlower font file (IndieFlower.ttf)
 * @param {string} templatePath - URL path to the lined paper template image (before.jpg)
 * @returns {Promise<HTMLCanvasElement[]>} Array of canvas elements, each representing one page
 */
export async function renderPaperWriter(text, fontPath, templatePath) {
  const font = new FontFace("IndieFlower", `url(${fontPath})`);
  await font.load();
  document.fonts.add(font);

  // Load template
  const template = new Image();
  await new Promise((resolve, reject) => {
    template.onload = resolve;
    template.onerror = reject;
    template.src = templatePath;
  });

  // Parse text into lines
  const lines = parseTextToLines(text, fontPath);

  // Split into pages (25 lines per page)
  const pages = [];
  for (let i = 0; i < lines.length; i += 25) {
    pages.push(lines.slice(i, i + 25));
  }

  // Render each page
  const canvases = [];
  for (const pageLines of pages) {
    const canvas = document.createElement("canvas");
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext("2d");

    // Draw template
    ctx.drawImage(template, 0, 0);

    // Draw text
    ctx.font = "24px IndieFlower";
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";

    let lineY = 190;
    for (const line of pageLines) {
      ctx.fillText(line, 170, lineY);
      lineY += 37 + 2.2;
    }

    canvases.push(canvas);
  }

  return canvases;
}

/**
 * Parses text into lines that fit within the paper template's line width.
 * Measures each character addition and breaks into new line when width exceeds 734px.
 *
 * @param {string} text - Text content to parse into lines
 * @param {string} fontPath - Font path (unused but kept for API consistency)
 * @returns {string[]} Array of text lines, each fitting within 734px width at 24px IndieFlower font
 */
function parseTextToLines(text, fontPath) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "24px IndieFlower";

  const lines = [];
  let currentLine = "";

  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width < 734) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = char;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
