import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import { EMOJI_FONT_FAMILY, clamp, getBackgroundRgb } from "./emojiHelpers.js";
import { getEmojiDataset } from "./emojiPalette.js";
import {
  getNearestEmoji,
  getWorkingGrid,
  sampleBlockAverage,
  trimMosaic,
} from "./emojiMatchEngine.js";

export async function createEmojiMosaic(source, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const settings = {
    columns: options.columns || 48,
    rows: options.rows || 32,
    preserveAspectRatio: options.preserveAspectRatio !== false,
    aspectCompensation: options.aspectCompensation || 0.58,
    samplingDensity: clamp(Math.round(options.samplingDensity || 3), 1, 6),
    matchMode: options.matchMode || "average",
    preset: options.preset || "defaultMixed",
    customEmojiSet: options.customEmojiSet || "",
    luminanceWeight: options.luminanceWeight ?? 0.45,
    brightnessWeight: options.brightnessWeight ?? 0.65,
    saturationWeight: options.saturationWeight ?? 0.35,
    invertBrightness: options.invertBrightness || false,
    background: options.background || "transparent",
    customBackground: options.customBackground || "#ffffff",
    trimEmptyBorders: options.trimEmptyBorders || false,
    transparentThreshold: options.transparentThreshold ?? 0.1,
  };
  const dataset = getEmojiDataset(settings.preset, settings.customEmojiSet);
  const { columns, rows } = getWorkingGrid(
    sourceCanvas.width,
    sourceCanvas.height,
    settings,
  );
  const workingWidth = columns * settings.samplingDensity;
  const workingHeight = rows * settings.samplingDensity;
  const backgroundRgb = getBackgroundRgb(
    settings.background,
    settings.customBackground,
  );
  const workingCanvas = createCanvas(workingWidth, workingHeight);
  const workingContext = workingCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  workingContext.imageSmoothingEnabled = true;
  workingContext.imageSmoothingQuality = "high";
  workingContext.clearRect(0, 0, workingWidth, workingHeight);
  workingContext.drawImage(sourceCanvas, 0, 0, workingWidth, workingHeight);
  const imageData = workingContext.getImageData(
    0,
    0,
    workingWidth,
    workingHeight,
  );

  const gridRows = [];

  for (let row = 0; row < rows; row += 1) {
    const cells = [];

    for (let column = 0; column < columns; column += 1) {
      const sample = sampleBlockAverage(
        imageData,
        workingWidth,
        workingHeight,
        column,
        row,
        settings.samplingDensity,
        backgroundRgb,
      );

      if (settings.invertBrightness) {
        sample.luminance = 255 - sample.luminance;
        sample.r = 255 - sample.r;
        sample.g = 255 - sample.g;
        sample.b = 255 - sample.b;
      }

      const transparentCell =
        settings.background === "transparent" &&
        sample.alpha <= settings.transparentThreshold;

      if (transparentCell) {
        cells.push({
          emoji: " ",
          isEmpty: true,
          rgb: [0, 0, 0],
          alpha: 0,
        });
        continue;
      }

      const emoji = getNearestEmoji(
        sample,
        dataset,
        settings.matchMode,
        settings,
      );
      cells.push({
        emoji: emoji.emoji,
        isEmpty: false,
        rgb: emoji.rgb,
        alpha: sample.alpha,
        match: {
          category: emoji.category,
          luminance: emoji.luminance,
        },
      });
    }

    gridRows.push(cells);
  }

  const baseResult = {
    rows: gridRows,
    columns,
    rowCount: rows,
    text: gridRows
      .map((row) => row.map((cell) => cell.emoji).join(""))
      .join("\n"),
    emojiCount: gridRows.flat().filter((cell) => !cell.isEmpty).length,
    datasetSize: dataset.length,
    background: settings.background,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
  };

  return settings.trimEmptyBorders ? trimMosaic(baseResult) : baseResult;
}

export function renderEmojiMosaicCanvas(mosaic, options = {}) {
  const fontSize = options.fontSize || 18;
  const lineHeight = options.lineHeight || 1.15;
  const padding = options.padding || 20;
  const background = options.background || "#ffffff";
  const transparentBackground = background === "transparent";
  const tempCanvas = createCanvas(1, 1);
  const tempContext = tempCanvas.getContext("2d");
  tempContext.font = `${fontSize}px ${EMOJI_FONT_FAMILY}`;
  tempContext.textBaseline = "middle";
  const cellWidth = Math.max(
    fontSize,
    Math.ceil(tempContext.measureText("🟨").width),
  );
  const cellHeight = Math.ceil(fontSize * lineHeight);
  const canvas = createCanvas(
    mosaic.columns * cellWidth + padding * 2,
    mosaic.rowCount * cellHeight + padding * 2,
  );
  const context = canvas.getContext("2d");

  if (!transparentBackground) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.font = `${fontSize}px ${EMOJI_FONT_FAMILY}`;
  context.textBaseline = "middle";
  context.textAlign = "center";

  mosaic.rows.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell.isEmpty) {
        return;
      }

      const x = padding + columnIndex * cellWidth + cellWidth / 2;
      const y = padding + rowIndex * cellHeight + cellHeight / 2;
      context.fillText(cell.emoji, x, y);
    });
  });

  return canvas;
}

export function createEmojiMosaicJson(mosaic) {
  return JSON.stringify(
    {
      columns: mosaic.columns,
      rows: mosaic.rowCount,
      emojiCount: mosaic.emojiCount,
      text: mosaic.text,
      cells: mosaic.rows.map((row) =>
        row.map((cell) => ({
          emoji: cell.emoji,
          rgb: cell.rgb,
          alpha: cell.alpha,
          empty: cell.isEmpty,
          match: cell.match || null,
        })),
      ),
    },
    null,
    2,
  );
}
