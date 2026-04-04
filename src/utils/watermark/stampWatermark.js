import { clamp, createSeed, drawStar } from "./graphicsUtils.js";

function createMeasureContext() {
  return document.createElement("canvas").getContext("2d");
}

function measureTextBox(context, text, font) {
  context.save();
  context.font = font;
  const metrics = context.measureText(text || " ");
  context.restore();
  const fontSizeMatch = font.match(/(\d+)px/);
  const fontSize = fontSizeMatch ? Number(fontSizeMatch[1]) : 16;
  const width = metrics.width;
  const height =
    (metrics.actualBoundingBoxAscent || 0) +
      (metrics.actualBoundingBoxDescent || 0) || 0;
  return { width, height: Math.max(height, fontSize * 0.72 || 1) };
}

function createRng(seedInput) {
  let seed = createSeed(`${seedInput}`) || 1;
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function trimTransparentCanvas(sourceCanvas, padding = 4) {
  const context = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
  );
  let minX = sourceCanvas.width;
  let minY = sourceCanvas.height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < sourceCanvas.height; y += 1) {
    for (let x = 0; x < sourceCanvas.width; x += 1) {
      const alpha = imageData.data[(y * sourceCanvas.width + x) * 4 + 3];
      if (alpha > 0) {
        found = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!found) {
    return sourceCanvas;
  }

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(sourceCanvas.width - 1, maxX + padding);
  maxY = Math.min(sourceCanvas.height - 1, maxY + padding);
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const trimmed = document.createElement("canvas");
  trimmed.width = width;
  trimmed.height = height;
  trimmed
    .getContext("2d")
    .drawImage(sourceCanvas, minX, minY, width, height, 0, 0, width, height);
  return trimmed;
}

function parseTextParts(text = "") {
  const parts = `${text}`
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return ["STAMP", "STAMP", "STAMP"];
  }

  if (parts.length === 1) {
    return [parts[0], parts[0], parts[0]];
  }

  if (parts.length === 2) {
    return [parts[0], parts[1], parts[0]];
  }

  return [parts[0], parts[1], parts[2]];
}

function getExpandedSize(width, height, rotation, padding = 40) {
  const radians = Math.abs(rotation);
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));
  return {
    width: Math.ceil(width * cosine + height * sine + padding * 2),
    height: Math.ceil(width * sine + height * cosine + padding * 2),
  };
}

function withCenteredRotation(
  context,
  canvasWidth,
  canvasHeight,
  rotation,
  draw,
) {
  context.save();
  context.translate(canvasWidth / 2, canvasHeight / 2);
  context.rotate(rotation);
  draw();
  context.restore();
}

function applyGrunge(context, width, height, intensity = 150, seedBase = 1) {
  const scratches = Math.max(24, intensity);
  const dots = Math.max(160, intensity * 15);
  const random = createRng(seedBase);
  context.save();
  context.globalCompositeOperation = "destination-out";
  context.lineCap = "round";
  context.strokeStyle = "rgba(0,0,0,0.9)";

  for (let index = 0; index < scratches; index += 1) {
    const x1 = -50 + random() * (width + 100);
    const y1 = -50 + random() * (height + 100);
    const length = 20 + random() * 180;
    const angle = random() * Math.PI;
    const x2 = x1 + Math.cos(angle) * length;
    const y2 = y1 + Math.sin(angle) * length;
    context.lineWidth = 1 + Math.floor(random() * 4);
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  for (let index = 0; index < dots; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const size = 1 + Math.floor(random() * 2);
    context.fillRect(x, y, size, size);
  }

  context.restore();
}

function drawCurvedText(
  context,
  text,
  centerX,
  centerY,
  radius,
  fontSize,
  color,
  isTop,
) {
  const content = `${text || ""}`.trim();
  if (!content) {
    return 0;
  }

  context.save();
  context.fillStyle = color;
  context.font = `800 ${fontSize}px Impact, "Arial Black", sans-serif`;
  context.textBaseline = "middle";
  context.textAlign = "center";

  const tracking = fontSize * 0.15;
  const charAngles = [...content].map((character) => {
    const width = context.measureText(character).width + tracking;
    return width / radius;
  });
  const totalAngle = charAngles.reduce((sum, value) => sum + value, 0);
  let currentAngle = -totalAngle / 2;

  [...content].forEach((character, index) => {
    const angle = currentAngle + charAngles[index] / 2;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(isTop ? -angle : angle);
    context.translate(0, isTop ? -radius : radius);
    context.fillText(character, 0, 0);
    context.restore();
    currentAngle += charAngles[index];
  });

  context.restore();
  return totalAngle;
}

function createRectStampCanvas(layer, rotation) {
  const measure = createMeasureContext();
  const fontSize = Math.max(42, layer.fontSize || 54);
  measure.font = `800 ${fontSize}px Impact, "Arial Black", sans-serif`;
  const metrics = measure.measureText(layer.text || "STAMP");
  const textWidth = metrics.width;
  const textHeight = fontSize * 0.82;
  const unit = fontSize / 54;
  const stampWidth = textWidth + 80 * unit;
  const stampHeight = textHeight + 60 * unit;
  const expanded = getExpandedSize(
    stampWidth,
    stampHeight,
    rotation,
    48 * unit,
  );
  const canvas = document.createElement("canvas");
  canvas.width = expanded.width;
  canvas.height = expanded.height;
  const context = canvas.getContext("2d");

  withCenteredRotation(context, canvas.width, canvas.height, rotation, () => {
    const x = -stampWidth / 2;
    const y = -stampHeight / 2;
    context.strokeStyle = layer.stampColor;
    context.lineWidth = 10 * unit;
    context.strokeRect(x, y, stampWidth, stampHeight);
    context.lineWidth = 4 * unit;
    context.strokeRect(
      x + 15 * unit,
      y + 15 * unit,
      stampWidth - 30 * unit,
      stampHeight - 30 * unit,
    );
    context.font = `800 ${fontSize}px Impact, "Arial Black", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = layer.textColor || layer.stampColor;
    context.fillText(layer.text || "STAMP", 0, 0);
  });

  if (layer.distressed) {
    applyGrunge(
      canvas.getContext("2d"),
      canvas.width,
      canvas.height,
      150,
      layer.text || layer.id,
    );
  }

  return canvas;
}

function createRosetteStampCanvas(layer, rotation) {
  const [, midText] = parseTextParts(layer.text || "OFFICIAL");
  const midFontSize = Math.max(120, (layer.fontSize || 42) * 4.2857);
  const measure = createMeasureContext();
  measure.font = `800 ${midFontSize}px Impact, "Arial Black", sans-serif`;
  const textWidth = measure.measureText(midText).width;
  const charCount = Math.max(midText.length, 1);
  const avgCharWidth = textWidth / charCount;
  const diameter = Math.max(textWidth - 2.5 * avgCharWidth, 400);
  const radius = diameter / 2;
  const size = Math.ceil(Math.max(textWidth + 400, diameter + 400));
  const expanded = getExpandedSize(size, size, rotation, 40);
  const canvas = document.createElement("canvas");
  canvas.width = expanded.width;
  canvas.height = expanded.height;
  const context = canvas.getContext("2d");

  withCenteredRotation(context, canvas.width, canvas.height, rotation, () => {
    const cx = 0;
    const cy = 0;
    context.fillStyle = layer.stampColor;
    context.beginPath();
    for (let angleDeg = 0; angleDeg <= 360; angleDeg += 2) {
      const angle = (angleDeg * Math.PI) / 180;
      const r = radius + radius * 0.025 * Math.sin(20 * angle);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (angleDeg === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.ellipse(cx, cy, radius * 0.85, radius * 0.85, 0, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";

    context.strokeStyle = layer.stampColor;
    context.lineWidth = radius * 0.03;
    context.beginPath();
    context.ellipse(cx, cy, radius * 0.75, radius * 0.75, 0, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = Math.max(2, radius * 0.01);
    context.beginPath();
    context.ellipse(cx, cy, radius * 0.68, radius * 0.68, 0, 0, Math.PI * 2);
    context.stroke();

    const starPositions = [
      [-0.9, -1.0, 0.225],
      [0, -1.25, 0.275],
      [0.9, -1.0, 0.225],
      [-0.9, 1.0, 0.225],
      [0, 1.25, 0.275],
      [0.9, 1.0, 0.225],
    ];
    starPositions.forEach(([xFactor, yFactor, sizeFactor]) => {
      const starSize = radius * sizeFactor;
      drawStar(
        context,
        cx + radius * xFactor,
        cy + radius * yFactor,
        starSize,
        starSize / 2.5,
        layer.stampColor,
      );
    });

    const boxWidth = textWidth + 60;
    const boxHeight = midFontSize * 0.78 + 40;
    context.globalCompositeOperation = "destination-out";
    context.fillRect(
      cx - boxWidth / 2,
      cy - boxHeight / 2,
      boxWidth,
      boxHeight,
    );
    context.globalCompositeOperation = "source-over";
    context.fillStyle = layer.stampColor;
    context.font = `800 ${midFontSize}px Impact, "Arial Black", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(midText, cx, cy);
  });

  applyGrunge(
    canvas.getContext("2d"),
    canvas.width,
    canvas.height,
    300,
    layer.text || layer.id,
  );
  return canvas;
}

function createCircleBannerStampCanvas(layer, rotation) {
  const topText = `${layer.text ?? ""}`;
  const middleText = `${layer.secondaryText ?? ""}`;
  const bottomText = `${layer.tertiaryText ?? ""}`;
  const outerR = 700;
  const innerR = 450;
  const size = 2800;
  const expanded = getExpandedSize(size, size, rotation, 40);
  const canvas = document.createElement("canvas");
  canvas.width = expanded.width;
  canvas.height = expanded.height;
  const context = canvas.getContext("2d");

  withCenteredRotation(context, canvas.width, canvas.height, rotation, () => {
    const cx = 0;
    const cy = 0;
    context.strokeStyle = layer.stampColor;
    context.lineWidth = 20;
    context.beginPath();
    context.arc(cx, cy, outerR, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = 8;
    context.beginPath();
    context.arc(cx, cy, outerR - 30, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(cx, cy, innerR, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = 20;
    context.beginPath();
    context.arc(cx, cy, innerR - 20, 0, Math.PI * 2);
    context.stroke();

    const textRadius = (outerR + innerR) / 2.1;
    const topAngle = drawCurvedText(
      context,
      topText,
      cx,
      cy,
      textRadius,
      130,
      layer.stampColor,
      true,
    );
    const bottomAngle = drawCurvedText(
      context,
      bottomText,
      cx,
      cy,
      textRadius,
      130,
      layer.stampColor,
      false,
    );

    const pad = 0.12;
    const starSize = 40;
    if (topText.trim()) {
      const topLeft = -Math.PI / 2 - (topAngle / 2 + pad);
      const topRight = -Math.PI / 2 + (topAngle / 2 + pad);
      [topLeft, topRight].forEach((angle) => {
        drawStar(
          context,
          cx + textRadius * Math.cos(angle),
          cy + textRadius * Math.sin(angle),
          starSize,
          starSize / 2.5,
          layer.stampColor,
        );
      });
    }
    if (bottomText.trim()) {
      const bottomLeft = Math.PI / 2 + (bottomAngle / 2 + pad);
      const bottomRight = Math.PI / 2 - (bottomAngle / 2 + pad);
      [bottomLeft, bottomRight].forEach((angle) => {
        drawStar(
          context,
          cx + textRadius * Math.cos(angle),
          cy + textRadius * Math.sin(angle),
          starSize,
          starSize / 2.5,
          layer.stampColor,
        );
      });
    }

    const starSizes = [25, 40, 55, 40, 25];
    const starAngles = [-50, -25, 0, 25, 50];
    const arcRadius = innerR - 120;
    starAngles.forEach((angleDeg, index) => {
      const angle = (angleDeg * Math.PI) / 180;
      const sx = cx + arcRadius * Math.sin(angle);
      const topY = cy - arcRadius * Math.cos(angle);
      const bottomY = cy + arcRadius * Math.cos(angle);
      drawStar(
        context,
        sx,
        topY,
        starSizes[index],
        starSizes[index] / 2.5,
        layer.stampColor,
      );
      drawStar(
        context,
        sx,
        bottomY,
        starSizes[index],
        starSizes[index] / 2.5,
        layer.stampColor,
      );
    });

    const midFontSize = 250;
    const measure = createMeasureContext();
    const middleFont = `800 ${midFontSize}px Impact, "Arial Black", sans-serif`;
    const middleBox = measureTextBox(measure, middleText, middleFont);
    const boxWidth = Math.max(middleBox.width + 150, outerR * 2 + 100);
    const boxHeight = middleBox.height + 60;
    const radius = 60;
    context.fillStyle = layer.stampColor;
    context.beginPath();
    context.moveTo(cx - boxWidth / 2 + radius, cy - boxHeight / 2);
    context.arcTo(
      cx + boxWidth / 2,
      cy - boxHeight / 2,
      cx + boxWidth / 2,
      cy + boxHeight / 2,
      radius,
    );
    context.arcTo(
      cx + boxWidth / 2,
      cy + boxHeight / 2,
      cx - boxWidth / 2,
      cy + boxHeight / 2,
      radius,
    );
    context.arcTo(
      cx - boxWidth / 2,
      cy + boxHeight / 2,
      cx - boxWidth / 2,
      cy - boxHeight / 2,
      radius,
    );
    context.arcTo(
      cx - boxWidth / 2,
      cy - boxHeight / 2,
      cx + boxWidth / 2,
      cy - boxHeight / 2,
      radius,
    );
    context.closePath();
    context.fill();
    context.globalCompositeOperation = "destination-out";
    context.font = middleFont;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(middleText, cx, cy);
    context.globalCompositeOperation = "source-over";
  });

  applyGrunge(
    canvas.getContext("2d"),
    canvas.width,
    canvas.height,
    400,
    layer.text || layer.id,
  );
  return canvas;
}

export function drawStampWatermark(context, layer, canvasWidth, canvasHeight) {
  const centerX = layer.x * canvasWidth;
  const centerY = layer.y * canvasHeight;
  const scale = layer.scale || 1;
  const rotation = ((layer.rotation || 0) * Math.PI) / 180;
  const colorLayer = {
    ...layer,
    stampColor: layer.stampColor || layer.textColor || "#dc2626",
  };
  let stampCanvas;

  if (
    [
      "stamp-clean",
      "stamp-grunger",
      "stamp-grunge-black",
      "stamp-grunge-green",
    ].includes(layer.type)
  ) {
    stampCanvas = createRectStampCanvas(
      {
        ...colorLayer,
        fontSize: (layer.fontSize || 54) * scale,
        distressed: layer.type !== "stamp-clean",
      },
      rotation,
    );
  } else if (layer.type === "stamp-rosette") {
    stampCanvas = createRosetteStampCanvas(
      {
        ...colorLayer,
        fontSize: (layer.fontSize || 42) * scale,
      },
      rotation,
    );
  } else {
    stampCanvas = createCircleBannerStampCanvas(
      {
        ...colorLayer,
        fontSize: (layer.fontSize || 40) * scale,
      },
      rotation,
    );
  }

  stampCanvas = trimTransparentCanvas(stampCanvas, 2);

  const drawWidth = stampCanvas.width * 0.24;
  const drawHeight = stampCanvas.height * 0.24;
  context.save();
  context.globalAlpha = layer.opacity ?? 1;
  context.drawImage(
    stampCanvas,
    centerX - drawWidth / 2,
    centerY - drawHeight / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();
  return {
    x: centerX - drawWidth / 2,
    y: centerY - drawHeight / 2,
    width: drawWidth,
    height: drawHeight,
  };
}
