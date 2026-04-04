export function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvasSurface(target, source) {
  if (!target || !source) return;

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export function getPublicAssetPath(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path}`.replace(/([^:]\/)\/+/, "$1");
}

export function resolveViewportWidth(widthPreset, customWidth, widthMap) {
  return widthPreset === "custom"
    ? Math.max(320, Number(customWidth) || 1280)
    : widthMap[widthPreset] || widthMap.desktop1440;
}

export function resolveViewportHeight(heightPreset, customHeight) {
  return heightPreset === "custom"
    ? Math.max(320, Number(customHeight) || 900)
    : Math.max(320, Number(heightPreset) || 900);
}

export function normalizeUrlInput(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function loadSampleMarkup(assetPath) {
  const response = await fetch(getPublicAssetPath(assetPath));
  if (!response.ok) {
    throw new Error("Failed to load sample HTML.");
  }

  return response.text();
}
