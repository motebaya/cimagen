export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvas(target, source) {
  if (!target || !source) return;
  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

function toHexChannel(value) {
  return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
}

export function getColorInputValue(value, fallback = "#000000") {
  if (typeof value !== "string") {
    return fallback;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  const rgbaMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbaMatch) {
    return `#${toHexChannel(Number(rgbaMatch[1]))}${toHexChannel(Number(rgbaMatch[2]))}${toHexChannel(Number(rgbaMatch[3]))}`;
  }

  return fallback;
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function nudgeRangeInput(target, direction) {
  const min = Number(target.min || 0);
  const max = Number(target.max || 100);
  const step = Number(target.step || 1);
  const nextValue = Math.min(
    max,
    Math.max(min, Number(target.value) + step * direction),
  );
  target.value = `${nextValue}`;
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

export function createTextLayer(template = null) {
  return {
    id: `layer-${Math.random().toString(36).slice(2, 9)}`,
    type: template?.type || "text",
    templateCategory: template?.category || null,
    templateLabel: template?.label || null,
    text: template?.text || "CONFIDENTIAL",
    secondaryText: template?.secondaryText || "",
    tertiaryText: template?.tertiaryText || "",
    x: template?.x ?? 0.5,
    y: template?.y ?? 0.5,
    fontFamily: template?.fontFamily || "Inter",
    fontSize: template?.fontSize || 42,
    fontWeight: template?.fontWeight || 700,
    letterSpacing: template?.letterSpacing || 0,
    lineHeight: template?.lineHeight || 1.1,
    color: template?.color || template?.textColor || "#ffffff",
    textColor: template?.textColor || template?.color || "#ffffff",
    strokeColor: template?.strokeColor || "rgba(0,0,0,0.65)",
    strokeWidth: template?.strokeWidth || 2,
    shadowColor: template?.shadowColor || "rgba(0,0,0,0.25)",
    shadowBlur: template?.shadowBlur ?? 6,
    shadowOffsetX: template?.shadowOffsetX ?? 0,
    shadowOffsetY: template?.shadowOffsetY ?? 4,
    opacity: template?.opacity ?? 1,
    rotation: template?.rotation || 0,
    align: template?.align || "center",
    backgroundColor: template?.backgroundColor || "rgba(0,0,0,0)",
    backgroundPadding: template?.backgroundPadding || 0,
    backgroundRadius: template?.backgroundRadius || 12,
    maxWidth: template?.maxWidth || 0.8,
    tiled: template?.tiled || false,
    spacing: template?.spacing || 110,
    density: template?.density || 1,
    pattern: template?.pattern || "diagonal",
    blendMode: template?.blendMode || "source-over",
    lock: false,
    hidden: false,
    scale: template?.scale || 1,
    shape: template?.shape || "rectangle",
    borderWidth: template?.borderWidth || 4,
    doubleBorder: template?.doubleBorder || false,
    distressed: template?.distressed || false,
    distressLevel: template?.distressLevel || 0,
    stampColor: template?.stampColor || template?.textColor || "#dc2626",
    padding: template?.padding || 16,
    sealStars: template?.sealStars || false,
    showBanner: template?.showBanner || false,
    accentColor: template?.accentColor || "#5c7cfa",
    accentColorAlt: template?.accentColorAlt || "#fb7185",
    borderColor: template?.borderColor || template?.accentColor || "#ffffff",
    iconScale: template?.iconScale || 1,
  };
}

export function createImageLayer(src = null) {
  return {
    id: `layer-${Math.random().toString(36).slice(2, 9)}`,
    type: "image",
    imageSrc: src,
    x: 0.82,
    y: 0.82,
    scale: 1,
    rotation: 0,
    opacity: 1,
    blendMode: "source-over",
    flipX: false,
    flipY: false,
    baseWidth: 0.22,
    shadowColor: "rgba(0,0,0,0.22)",
    shadowBlur: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    lock: false,
    hidden: false,
  };
}
