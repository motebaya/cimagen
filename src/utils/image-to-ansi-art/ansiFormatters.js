import { colorsEqual, escapeSequence } from "./ansiPalette.js";

export function buildAnsiText(rows, optimizeEscapeCodes, addResetAtEnd) {
  let activeForeground = null;
  let activeBackground = null;

  const output = rows.map((row) => {
    let line = "";

    row.forEach((cell) => {
      if (
        !optimizeEscapeCodes ||
        !colorsEqual(activeForeground, cell.foreground)
      ) {
        line += escapeSequence(cell.foreground, false);
        activeForeground = cell.foreground;
      }

      if (
        !optimizeEscapeCodes ||
        !colorsEqual(activeBackground, cell.background)
      ) {
        line += escapeSequence(cell.background, true);
        activeBackground = cell.background;
      }

      line += cell.char;
    });

    line += "\u001b[0m";
    activeForeground = null;
    activeBackground = null;
    return line;
  });

  let text = output.join("\n");
  if (addResetAtEnd && !text.endsWith("\u001b[0m")) {
    text += "\u001b[0m";
  }

  return text;
}

export function formatAnsiOutput(text, format) {
  if (format === "javascript") {
    return JSON.stringify(text);
  }

  if (format === "json") {
    return JSON.stringify({ ansi: text }, null, 2);
  }

  return text;
}
