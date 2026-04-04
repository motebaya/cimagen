import { getRotatedBound } from "./previewScaling.js";

function drawTextWithSpacing(context, text, x, y, letterSpacing, align) {
  const characters = [...text];
  if (!characters.length) {
    return;
  }

  const widths = characters.map(
    (character) => context.measureText(character).width,
  );
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    letterSpacing * Math.max(0, characters.length - 1);
  let cursorX = x;

  if (align === "center") {
    cursorX -= totalWidth / 2;
  }

  if (align === "right") {
    cursorX -= totalWidth;
  }

  characters.forEach((character, index) => {
    context.strokeText(character, cursorX, y);
    context.fillText(character, cursorX, y);
    cursorX += widths[index] + letterSpacing;
  });
}

function wrapText(context, text, maxWidth, letterSpacing) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines = [];
  let current = words[0];

  for (let index = 1; index < words.length; index += 1) {
    const nextLine = `${current} ${words[index]}`;
    const measured =
      context.measureText(nextLine).width +
      Math.max(0, nextLine.length - 1) * letterSpacing;

    if (measured <= maxWidth) {
      current = nextLine;
    } else {
      lines.push(current);
      current = words[index];
    }
  }

  lines.push(current);
  return lines;
}

function fitFontSize(context, layer, canvasWidth) {
  if (!layer.autoSize) {
    return layer.fontSize;
  }

  let size = layer.fontSize || 54;

  while (size > 14) {
    context.font = `${layer.fontWeight || 700} ${size}px ${layer.fontFamily || "Impact"}`;
    const lines = wrapText(
      context,
      layer.text || "",
      canvasWidth * (layer.maxWidth || 0.88),
      layer.letterSpacing || 0,
    );
    const widest = Math.max(
      ...lines.map(
        (line) =>
          context.measureText(line).width +
          Math.max(0, line.length - 1) * (layer.letterSpacing || 0),
      ),
      0,
    );

    if (widest <= canvasWidth * (layer.maxWidth || 0.88)) {
      break;
    }

    size -= 2;
  }

  return size;
}

function getTextAnchorX(align, widest) {
  if (align === "left") {
    return -widest / 2;
  }

  if (align === "right") {
    return widest / 2;
  }

  return 0;
}

export function drawTextLayer(context, layer, canvasWidth, canvasHeight) {
  if (!layer.text?.trim()) {
    return null;
  }

  const baseFontSize = fitFontSize(context, layer, canvasWidth);
  const fontSize = Math.max(12, baseFontSize * (layer.scale || 1));
  const centerX = (layer.x ?? 0.5) * canvasWidth;
  const centerY = (layer.y ?? 0.5) * canvasHeight;
  const letterSpacing = layer.letterSpacing || 0;

  context.save();
  context.font = `${layer.fontWeight || 700} ${fontSize}px ${layer.fontFamily || "Impact"}`;
  context.textBaseline = "top";
  context.fillStyle = layer.color || "#ffffff";
  context.strokeStyle = layer.strokeColor || "#000000";
  context.lineWidth = layer.strokeWidth || 0;
  context.lineJoin = "round";
  context.shadowColor = layer.shadowColor || "transparent";
  context.shadowBlur = layer.shadowBlur || 0;
  context.shadowOffsetX = layer.shadowOffsetX || 0;
  context.shadowOffsetY = layer.shadowOffsetY || 0;
  context.globalAlpha = layer.opacity ?? 1;

  const lines = wrapText(
    context,
    layer.text,
    canvasWidth * (layer.maxWidth || 0.88),
    letterSpacing,
  );
  const lineHeight = fontSize * (layer.lineHeight || 1.05);
  const widest = Math.max(
    ...lines.map(
      (line) =>
        context.measureText(line).width +
        Math.max(0, line.length - 1) * letterSpacing,
    ),
    0,
  );
  const boxPadding = layer.backgroundPadding || 0;
  const totalHeight = lines.length * lineHeight;
  const originY = -totalHeight / 2;

  context.translate(centerX, centerY);
  context.rotate(((layer.rotation || 0) * Math.PI) / 180);

  if (layer.backgroundColor && layer.backgroundColor !== "rgba(0,0,0,0)") {
    const boxWidth = widest + boxPadding * 2;
    const boxHeight = totalHeight + boxPadding * 2;
    const radius = layer.backgroundRadius || 0;
    const boxX = -widest / 2 - boxPadding;
    const boxY = originY - boxPadding;
    context.fillStyle = layer.backgroundColor;
    context.beginPath();
    context.moveTo(boxX + radius, boxY);
    context.arcTo(
      boxX + boxWidth,
      boxY,
      boxX + boxWidth,
      boxY + boxHeight,
      radius,
    );
    context.arcTo(
      boxX + boxWidth,
      boxY + boxHeight,
      boxX,
      boxY + boxHeight,
      radius,
    );
    context.arcTo(boxX, boxY + boxHeight, boxX, boxY, radius);
    context.arcTo(boxX, boxY, boxX + boxWidth, boxY, radius);
    context.closePath();
    context.fill();
    context.fillStyle = layer.color || "#ffffff";
  }

  lines.forEach((line, index) => {
    drawTextWithSpacing(
      context,
      line,
      getTextAnchorX(layer.align || "center", widest),
      originY + index * lineHeight,
      letterSpacing,
      layer.align || "center",
    );
  });

  context.restore();
  return getRotatedBound(
    centerX,
    centerY,
    widest + boxPadding * 2,
    totalHeight + boxPadding * 2,
    layer.rotation || 0,
  );
}
