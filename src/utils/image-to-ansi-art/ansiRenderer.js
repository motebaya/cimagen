import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import { resolveCharsetGlyph } from "./ansiCharacterSets.js";
import { buildAnsiText, formatAnsiOutput } from "./ansiFormatters.js";
import { clamp, getBackgroundRgb } from "./ansiHelpers.js";
import { mapColor } from "./ansiPalette.js";

function getDimensions(width, height, options) {
  const columns = clamp(Math.round(options.columns || 80), 20, 200);
  const aspect =
    options.aspectCompensation || (options.renderMode === "half" ? 1 : 0.5);
  const rows = Math.max(1, Math.round((height / width) * columns * aspect));
  return { columns, rows };
}

function sampleCanvas(sourceCanvas, width, height) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
}

function getPixel(imageData, width, x, y, backgroundRgb) {
  const index = (y * width + x) * 4;
  const alpha = imageData.data[index + 3] / 255;

  if (alpha === 0 && !backgroundRgb) {
    return null;
  }

  const red = backgroundRgb
    ? imageData.data[index] * alpha + backgroundRgb[0] * (1 - alpha)
    : imageData.data[index];
  const green = backgroundRgb
    ? imageData.data[index + 1] * alpha + backgroundRgb[1] * (1 - alpha)
    : imageData.data[index + 1];
  const blue = backgroundRgb
    ? imageData.data[index + 2] * alpha + backgroundRgb[2] * (1 - alpha)
    : imageData.data[index + 2];

  return [red, green, blue];
}

function getLuminance(pixel) {
  if (!pixel) {
    return 0;
  }

  return pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114;
}

export async function createAnsiArt(source, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const settings = {
    columns: options.columns || 80,
    renderMode: options.renderMode || "half",
    colorMode: options.colorMode || "truecolor",
    aspectCompensation: options.aspectCompensation,
    background: options.background || "#000000",
    customBackground: options.customBackground || "#000000",
    customChar: options.customChar || "█",
    charsetPreset: options.charsetPreset || "classic-ascii",
    optimizeEscapeCodes: options.optimizeEscapeCodes !== false,
    addResetAtEnd: options.addResetAtEnd !== false,
    trimEmptyRows: options.trimEmptyRows || false,
    outputFormat: options.outputFormat || "raw",
  };
  const dimensions = getDimensions(
    sourceCanvas.width,
    sourceCanvas.height,
    settings,
  );
  const backgroundRgb = getBackgroundRgb(
    settings.background,
    settings.customBackground,
  );
  const sampleHeight =
    settings.renderMode === "half" ? dimensions.rows * 2 : dimensions.rows;
  const sampled = sampleCanvas(sourceCanvas, dimensions.columns, sampleHeight);
  const rows = [];

  for (let row = 0; row < dimensions.rows; row += 1) {
    const cells = [];

    for (let column = 0; column < dimensions.columns; column += 1) {
      if (settings.renderMode === "half") {
        const topPixel = getPixel(
          sampled,
          dimensions.columns,
          column,
          row * 2,
          backgroundRgb,
        );
        const bottomPixel = getPixel(
          sampled,
          dimensions.columns,
          column,
          row * 2 + 1,
          backgroundRgb,
        );

        if (!topPixel && !bottomPixel) {
          cells.push({
            char: " ",
            foreground: null,
            background: null,
            colorMode: settings.colorMode,
          });
          continue;
        }

        const topColor = mapColor(
          topPixel || backgroundRgb || [0, 0, 0],
          settings.colorMode,
        );
        const bottomColor = mapColor(
          bottomPixel || backgroundRgb || [0, 0, 0],
          settings.colorMode,
        );
        cells.push({
          char: "▀",
          foreground: topColor,
          background: bottomColor,
          colorMode: settings.colorMode,
        });
        continue;
      }

      const pixel = getPixel(
        sampled,
        dimensions.columns,
        column,
        row,
        backgroundRgb,
      );
      if (!pixel) {
        cells.push({
          char: " ",
          foreground: null,
          background: null,
          colorMode: settings.colorMode,
        });
        continue;
      }

      const mapped = mapColor(pixel, settings.colorMode);
      cells.push({
        char:
          settings.renderMode === "background"
            ? " "
            : resolveCharsetGlyph(
                getLuminance(pixel),
                settings.charsetPreset,
                settings.customChar,
              ),
        foreground: settings.renderMode === "background" ? null : mapped,
        background: settings.renderMode === "background" ? mapped : null,
        colorMode: settings.colorMode,
      });
    }

    rows.push(cells);
  }

  const trimmedRows = settings.trimEmptyRows
    ? rows.filter((row) =>
        row.some(
          (cell) => cell.char.trim() || cell.background || cell.foreground,
        ),
      )
    : rows;
  const ansiText = buildAnsiText(
    trimmedRows,
    settings.optimizeEscapeCodes,
    settings.addResetAtEnd,
  );
  const characterCount = trimmedRows.reduce(
    (total, row) => total + row.length,
    0,
  );

  return {
    columns: dimensions.columns,
    rows: trimmedRows.length,
    characterCount,
    grid: trimmedRows,
    ansiText,
    formattedText: formatAnsiOutput(ansiText, settings.outputFormat),
    charsetPreset: settings.charsetPreset,
    renderMode: settings.renderMode,
    colorMode: settings.colorMode,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
  };
}

export function renderAnsiArtCanvas(result, options = {}) {
  const fontSize = options.fontSize || 12;
  const padding = options.padding || 18;
  const lineHeight = options.lineHeight || 1.2;
  const themeBackground = options.themeBackground || "#0b1220";
  const themeText = options.themeText || "#f8fafc";
  const tempCanvas = createCanvas(1, 1);
  const tempContext = tempCanvas.getContext("2d");
  tempContext.font = `${fontSize}px monospace`;
  const cellWidth = Math.max(1, Math.ceil(tempContext.measureText("M").width));
  const rowHeight = Math.max(1, Math.ceil(fontSize * lineHeight));
  const canvas = createCanvas(
    result.columns * cellWidth + padding * 2,
    result.rows * rowHeight + padding * 2,
  );
  const context = canvas.getContext("2d");
  context.fillStyle = themeBackground;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = `${fontSize}px monospace`;
  context.textBaseline = "top";

  result.grid.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const x = padding + columnIndex * cellWidth;
      const y = padding + rowIndex * rowHeight;

      if (cell.background?.css) {
        context.fillStyle = cell.background.css;
        context.fillRect(x, y, cellWidth, rowHeight);
      }

      context.fillStyle = cell.foreground?.css || themeText;
      context.fillText(cell.char, x, y);
    });
  });

  return canvas;
}
