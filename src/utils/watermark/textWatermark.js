function drawLetterSpacedText(context, text, x, y, letterSpacing, align) {
  const characters = [...text];
  const widths = characters.map(
    (character) => context.measureText(character).width,
  );
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    letterSpacing * Math.max(0, characters.length - 1);
  let cursorX = x;

  if (align === "center") cursorX -= totalWidth / 2;
  if (align === "right") cursorX -= totalWidth;

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
    const next = `${current} ${words[index]}`;
    const width =
      context.measureText(next).width +
      letterSpacing * Math.max(0, next.length - 1);
    if (width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[index];
    }
  }

  lines.push(current);
  return lines;
}

export function drawTextWatermark(context, layer, canvasWidth, canvasHeight) {
  const centerX = layer.x * canvasWidth;
  const centerY = layer.y * canvasHeight;
  const fontSize = layer.fontSize || 42;
  const letterSpacing = layer.letterSpacing || 0;
  const lineHeight = fontSize * (layer.lineHeight || 1.1);
  context.save();
  context.font = `${layer.fontWeight || 700} ${fontSize}px ${layer.fontFamily || "Inter"}`;
  context.textBaseline = "top";
  context.fillStyle = layer.color || "#ffffff";
  context.strokeStyle = layer.strokeColor || "rgba(0,0,0,0.6)";
  context.lineWidth = layer.strokeWidth || 0;
  context.shadowColor = layer.shadowColor || "transparent";
  context.shadowBlur = layer.shadowBlur || 0;
  context.shadowOffsetX = layer.shadowOffsetX || 0;
  context.shadowOffsetY = layer.shadowOffsetY || 0;
  context.globalAlpha = layer.opacity ?? 1;
  context.globalCompositeOperation = layer.blendMode || "source-over";
  context.translate(centerX, centerY);
  context.rotate(((layer.rotation || 0) * Math.PI) / 180);
  context.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);

  const maxWidth = canvasWidth * (layer.maxWidth || 0.9);
  const lines = wrapText(context, layer.text || "", maxWidth, letterSpacing);
  const widest = Math.max(
    ...lines.map(
      (line) =>
        context.measureText(line).width +
        letterSpacing * Math.max(0, line.length - 1),
    ),
    0,
  );
  const totalHeight = lineHeight * lines.length;
  const padding = layer.backgroundPadding || 0;
  const originX = -widest / 2;
  const originY = -totalHeight / 2;

  if (layer.backgroundColor && layer.backgroundColor !== "rgba(0,0,0,0)") {
    const radius = layer.backgroundRadius || 0;
    const x = originX - padding;
    const y = originY - padding;
    const width = widest + padding * 2;
    const height = totalHeight + padding * 2;
    context.fillStyle = layer.backgroundColor;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
    context.fill();
    context.fillStyle = layer.color || "#ffffff";
  }

  lines.forEach((line, index) => {
    drawLetterSpacedText(
      context,
      line,
      0,
      originY + index * lineHeight,
      letterSpacing,
      layer.align || "center",
    );
  });

  context.restore();
  return {
    x: centerX - widest / 2 - padding,
    y: centerY - totalHeight / 2 - padding,
    width: widest + padding * 2,
    height: totalHeight + padding * 2,
  };
}
