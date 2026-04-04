import {
  createLinearGradient,
  createRadialGradient,
  roundedRect,
} from "./graphicsUtils.js";

const TIKTOK_SVG_PATH = new Path2D(
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
);

const TWITCH_OUTER_PATH = new Path2D(
  "M6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0z",
);
const TWITCH_EYE_LEFT = new Path2D("M11.571 4.714h1.715v5.143H11.571z");
const TWITCH_EYE_RIGHT = new Path2D("M16.286 4.714H18v5.143h-1.714z");

function drawBrokenLine(context, xStart, xEnd, y, pattern, color, width) {
  const totalLength = xEnd - xStart;
  let currentX = xStart;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";

  pattern.forEach((percentage, index) => {
    const segmentLength = totalLength * percentage;
    if (index % 2 === 0) {
      context.beginPath();
      context.moveTo(currentX, y);
      context.lineTo(currentX + segmentLength, y);
      context.stroke();
    }
    currentX += segmentLength;
  });
  context.restore();
}

function drawDynamicCursorHand(context, offsetX, offsetY, scale = 4.2) {
  const perimeter = [
    [4, 1],
    [4.2, 0.2],
    [5, -0.4],
    [5.8, 0.2],
    [6, 1],
    [6, 2],
    [6.2, 1.7],
    [7, 1.4],
    [7.8, 1.7],
    [8, 2.2],
    [8, 3],
    [8.2, 2.7],
    [9, 2.4],
    [9.8, 2.7],
    [10, 3.2],
    [10, 4],
    [10.2, 3.7],
    [11, 3.4],
    [11.8, 3.7],
    [12, 4.5],
    [12, 10],
    [9, 14],
    [9, 18],
    [4, 18],
    [4, 15],
    [2.5, 12.5],
    [1.0, 10.5],
    [0.2, 8.5],
    [0.2, 7.2],
    [0.8, 6.5],
    [2.0, 6.5],
    [4, 8],
    [4, 1],
  ].map(([x, y]) => [x * scale + offsetX, y * scale + offsetY]);

  context.save();
  context.shadowColor = "rgba(0,0,0,0.18)";
  context.shadowBlur = 8;
  context.shadowOffsetX = 8;
  context.shadowOffsetY = 8;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#0f172a";
  context.lineWidth = Math.max(2, scale * 0.6);
  context.lineJoin = "round";
  context.beginPath();
  perimeter.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
  context.fill();
  context.shadowColor = "transparent";
  context.stroke();
  [
    [6, 2, 6, 8],
    [8, 3, 8, 9],
    [10, 4, 10, 9],
  ].forEach(([x1, y1, x2, y2]) => {
    context.beginPath();
    context.moveTo(x1 * scale + offsetX, y1 * scale + offsetY);
    context.lineTo(x2 * scale + offsetX, y2 * scale + offsetY);
    context.stroke();
  });
  context.restore();
}

function drawTikTokGlyph(context, x, y, size) {
  const scale = size / 24;
  const renderLayer = (offsetX, offsetY, color, alpha) => {
    context.save();
    context.translate(x + offsetX, y + offsetY);
    context.scale(scale, scale);
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.fill(TIKTOK_SVG_PATH);
    context.restore();
  };
  renderLayer(-4 * scale, 3 * scale, "#25f4ee", 0.72);
  renderLayer(4 * scale, -3 * scale, "#fe2c55", 0.72);
  renderLayer(0, 0, "#ffffff", 1);
}

function drawInstagramGlyph(context, x, y, size) {
  context.save();
  const gradient = createRadialGradient(
    context,
    x + size * 0.7,
    y + size * 0.3,
    size,
    [
      [0, "#fed564"],
      [0.2, "#f77737"],
      [0.5, "#d62976"],
      [0.7, "#962fbf"],
      [1, "#4f5bd5"],
    ],
  );
  context.fillStyle = gradient;
  roundedRect(context, x, y, size, size, size * 0.22);
  context.fill();
  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(3, size * 0.055);
  roundedRect(
    context,
    x + size * 0.22,
    y + size * 0.22,
    size * 0.56,
    size * 0.56,
    size * 0.15,
  );
  context.stroke();
  context.beginPath();
  context.arc(x + size * 0.5, y + size * 0.5, size * 0.17, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(x + size * 0.73, y + size * 0.28, size * 0.04, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();
  context.restore();
}

function drawTwitchGlyph(context, x, y, size) {
  context.save();
  const gradient = createLinearGradient(context, x, y, x, y + size, [
    "#6441a5",
    "#5a37a0",
    "#7346be",
    "#693caf",
  ]);
  context.fillStyle = gradient;
  roundedRect(context, x, y, size, size, size * 0.22);
  context.fill();
  const margin = size * 0.16;
  const iconArea = size - margin * 2;
  const scale = iconArea / 24;
  context.translate(x + margin, y + margin);
  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fill(TWITCH_OUTER_PATH);
  context.fillStyle = "#6441a5";
  context.fill(TWITCH_EYE_LEFT);
  context.fill(TWITCH_EYE_RIGHT);
  context.restore();
}

function drawFollowCard(context, centerX, centerY, layer, platform) {
  const scale = layer.scale || 1;
  const logoSize = 200 * scale * 0.42;
  const panelHeight = logoSize;
  const minPanelWidth = 400 * scale * 0.42;
  const textPadding = 100 * scale * 0.42;
  context.save();
  context.font = `600 ${panelHeight * 0.28}px Inter`;
  const textWidth = context.measureText(layer.text || "@username").width;
  const panelWidth = Math.max(minPanelWidth, textWidth + textPadding);
  const badgeWidth = Math.min(
    200 * scale * 0.42,
    panelWidth - 40 * scale * 0.42,
  );
  const badgeHeight = 55 * scale * 0.42;
  const gap = 15 * scale * 0.42;
  const badgeOverlapY = 18 * scale * 0.42;
  const totalWidth = logoSize + gap + panelWidth;
  const totalHeight = Math.max(logoSize, panelHeight + badgeHeight * 0.55);
  const x = centerX - totalWidth / 2;
  const y = centerY - totalHeight / 2;
  const logoX = x;
  const logoY = y;
  const panelX = x + logoSize + gap;
  const panelY = y;
  const badgeX = panelX + (panelWidth - badgeWidth) / 2;
  const badgeY = panelY + panelHeight - badgeHeight + badgeOverlapY;

  context.shadowColor = "rgba(0,0,0,0.12)";
  context.shadowBlur = 10 * scale;
  context.shadowOffsetY = 6 * scale;
  context.fillStyle = "rgba(255,255,255,0.001)";
  roundedRect(
    context,
    panelX + 3 * scale,
    panelY + 6 * scale,
    panelWidth,
    panelHeight,
    panelHeight * 0.18,
  );
  context.fill();
  roundedRect(
    context,
    logoX + 3 * scale,
    logoY + 6 * scale,
    logoSize,
    logoSize,
    logoSize * 0.22,
  );
  context.fill();
  roundedRect(
    context,
    badgeX + 2 * scale,
    badgeY + 4 * scale,
    badgeWidth,
    badgeHeight,
    badgeHeight * 0.25,
  );
  context.fill();
  context.shadowColor = "transparent";

  if (platform === "twitch") drawTwitchGlyph(context, logoX, logoY, logoSize);
  if (platform === "tiktok") {
    const darkGradient = createLinearGradient(
      context,
      logoX,
      logoY,
      logoX,
      logoY + logoSize,
      ["#1e1e23", "#121217", "#17171b", "#1f1f23"],
    );
    context.fillStyle = darkGradient;
    roundedRect(context, logoX, logoY, logoSize, logoSize, logoSize * 0.22);
    context.fill();
    drawTikTokGlyph(
      context,
      logoX + logoSize * 0.17,
      logoY + logoSize * 0.17,
      logoSize * 0.66,
    );
  }
  if (platform === "instagram")
    drawInstagramGlyph(context, logoX, logoY, logoSize);

  const panelGradient = createLinearGradient(
    context,
    panelX,
    panelY,
    panelX + panelWidth,
    panelY,
    [
      "rgba(255,255,255,0.95)",
      "rgba(248,248,250,0.94)",
      "rgba(225,225,232,0.9)",
    ],
  );
  context.fillStyle = panelGradient;
  roundedRect(
    context,
    panelX,
    panelY,
    panelWidth,
    panelHeight,
    panelHeight * 0.18,
  );
  context.fill();
  context.fillStyle = "rgba(50,50,55,0.92)";
  context.font = `600 ${panelHeight * 0.28}px Inter`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    layer.text || "@username",
    panelX + panelWidth / 2,
    panelY + panelHeight / 2,
  );

  const badgeGradient =
    platform === "instagram"
      ? createLinearGradient(
          context,
          badgeX,
          badgeY,
          badgeX + badgeWidth,
          badgeY,
          ["#fed564", "#f77737", "#d62976", "#962fbf", "#4f5bd5"],
        )
      : platform === "twitch"
        ? createLinearGradient(
            context,
            badgeX,
            badgeY,
            badgeX + badgeWidth,
            badgeY,
            ["#9146ff", "#7c3aed"],
          )
        : createLinearGradient(
            context,
            badgeX,
            badgeY,
            badgeX + badgeWidth,
            badgeY,
            ["#28282a", "#3a3a3d"],
          );
  context.fillStyle = badgeGradient;
  roundedRect(
    context,
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    badgeHeight * 0.25,
  );
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = `800 ${badgeHeight * 0.42}px Inter`;
  context.fillText("FOLLOW", badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
  context.restore();
  return { x, y, width: totalWidth, height: totalHeight + badgeHeight * 0.45 };
}

function drawYoutubeButton(context, centerX, centerY, layer) {
  const scale = layer.scale || 1;
  const iconW = 130 * scale * 0.4;
  const iconH = 90 * scale * 0.4;
  context.save();
  context.font = `800 ${34 * scale * 0.62}px SpaceGrotesk, Inter, sans-serif`;
  const textWidth = context.measureText(layer.text || "SUBSCRIBE").width;
  const gap = 40 * scale * 0.4;
  const padX = 60 * scale * 0.4;
  const padY = 40 * scale * 0.4;
  const buttonWidth = iconW + gap + textWidth + padX * 2;
  const buttonHeight = Math.max(iconH, 34 * scale * 0.62) + padY * 2;
  const x = centerX - buttonWidth / 2;
  const y = centerY - buttonHeight / 2;
  const lineGap = Math.max(8 * scale, buttonHeight * 0.16);

  context.shadowColor = "rgba(0,0,0,0.16)";
  context.shadowBlur = 15 * scale * 0.5;
  context.shadowOffsetY = 15 * scale * 0.35;
  context.fillStyle = "rgba(255,255,255,0.001)";
  roundedRect(context, x, y, buttonWidth, buttonHeight, 20 * scale * 0.5);
  context.fill();
  context.shadowColor = "transparent";

  const lineStart = x + 30 * scale * 0.5;
  const lineEnd = x + buttonWidth - 30 * scale * 0.5;
  drawBrokenLine(
    context,
    lineStart,
    lineEnd,
    y - lineGap,
    [0.1, 0.1, 0.4, 0.05, 0.05, 0.15, 0.15],
    layer.borderColor || "#ff2222",
    2 * scale,
  );
  drawBrokenLine(
    context,
    lineStart,
    lineEnd,
    y + buttonHeight + lineGap,
    [0.05, 0.15, 0.45, 0.15, 0.2],
    layer.borderColor || "#ff2222",
    2 * scale,
  );

  context.fillStyle = layer.backgroundColor || "#ffffff";
  roundedRect(context, x, y, buttonWidth, buttonHeight, 20 * scale * 0.5);
  context.fill();

  const iconX = x + padX;
  const iconY = y + (buttonHeight - iconH) / 2;
  context.fillStyle = layer.accentColor || "#ff0033";
  roundedRect(context, iconX, iconY, iconW, iconH, 22 * scale * 0.45);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.moveTo(iconX + iconW * 0.42, iconY + iconH * 0.24);
  context.lineTo(iconX + iconW * 0.42, iconY + iconH * 0.76);
  context.lineTo(iconX + iconW * 0.7, iconY + iconH * 0.5);
  context.closePath();
  context.fill();

  context.fillStyle = layer.textColor || "#0f172a";
  context.font = `800 ${34 * scale * 0.62}px SpaceGrotesk, Inter, sans-serif`;
  context.textBaseline = "middle";
  context.fillText(
    layer.text || "SUBSCRIBE",
    iconX + iconW + gap,
    y + buttonHeight / 2,
  );

  drawDynamicCursorHand(
    context,
    x + buttonWidth - 30 * scale,
    y + buttonHeight - 12 * scale,
    2.1 * scale,
  );
  context.restore();
  return {
    x,
    y: y - lineGap - 4 * scale,
    width: buttonWidth,
    height: buttonHeight + lineGap * 2 + 8 * scale,
  };
}

export function drawSocialWatermark(context, layer, canvasWidth, canvasHeight) {
  const centerX = layer.x * canvasWidth;
  const centerY = layer.y * canvasHeight;
  context.save();
  context.globalAlpha = layer.opacity ?? 1;
  context.translate(centerX, centerY);
  context.rotate(((layer.rotation || 0) * Math.PI) / 180);
  context.translate(-centerX, -centerY);

  let bound = null;
  if (layer.type === "social-youtube-button")
    bound = drawYoutubeButton(context, centerX, centerY, layer);
  if (layer.type === "social-twitch")
    bound = drawFollowCard(context, centerX, centerY, layer, "twitch");
  if (layer.type === "social-tiktok")
    bound = drawFollowCard(context, centerX, centerY, layer, "tiktok");
  if (layer.type === "social-instagram")
    bound = drawFollowCard(context, centerX, centerY, layer, "instagram");
  context.restore();
  return bound;
}
