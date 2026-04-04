import { createCanvas } from "../canvasUtils.js";
import { clamp } from "./faceBlurHelpers.js";

function extractRegion(sourceCanvas, x, y, width, height) {
  const regionCanvas = createCanvas(width, height);
  regionCanvas
    .getContext("2d")
    .drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
  return regionCanvas;
}

function createProcessedRegion(regionCanvas, settings) {
  const output = createCanvas(regionCanvas.width, regionCanvas.height);
  const context = output.getContext("2d");

  if (settings.effect === "pixelate" || settings.effect === "mosaic") {
    const amount = clamp(Math.round(settings.strength || 12), 4, 32);
    const widthScale = Math.max(1, Math.round(regionCanvas.width / amount));
    const heightScale = Math.max(1, Math.round(regionCanvas.height / amount));
    const tiny = createCanvas(widthScale, heightScale);
    const tinyContext = tiny.getContext("2d");
    tinyContext.imageSmoothingEnabled = true;
    tinyContext.drawImage(regionCanvas, 0, 0, widthScale, heightScale);
    context.imageSmoothingEnabled = false;
    context.drawImage(tiny, 0, 0, output.width, output.height);
    return output;
  }

  context.filter = `blur(${clamp(settings.strength || 14, 2, 36)}px)`;
  context.drawImage(regionCanvas, 0, 0);
  context.filter = "none";
  return output;
}

function applyMask(regionCanvas, processedCanvas, settings) {
  const masked = createCanvas(regionCanvas.width, regionCanvas.height);
  const context = masked.getContext("2d");
  context.drawImage(processedCanvas, 0, 0);
  context.globalCompositeOperation = "destination-in";

  const feather = clamp(settings.feather || 8, 0, 32);
  const maskCanvas = createCanvas(regionCanvas.width, regionCanvas.height);
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "#ffffff";

  if (settings.shape === "oval") {
    maskContext.beginPath();
    maskContext.ellipse(
      regionCanvas.width / 2,
      regionCanvas.height / 2,
      regionCanvas.width / 2 - 2,
      regionCanvas.height / 2 - 2,
      0,
      0,
      Math.PI * 2,
    );
    maskContext.fill();
  } else {
    maskContext.fillRect(0, 0, regionCanvas.width, regionCanvas.height);
  }

  if (feather > 0) {
    const softened = createCanvas(regionCanvas.width, regionCanvas.height);
    const softenedContext = softened.getContext("2d");
    softenedContext.filter = `blur(${feather / 2}px)`;
    softenedContext.drawImage(maskCanvas, 0, 0);
    softenedContext.filter = "none";
    context.drawImage(softened, 0, 0);
  } else {
    context.drawImage(maskCanvas, 0, 0);
  }

  context.globalCompositeOperation = "source-over";
  return masked;
}

export function applyFaceBlurToCanvas(sourceCanvas, faces, settings) {
  const output = createCanvas(sourceCanvas.width, sourceCanvas.height);
  const context = output.getContext("2d");
  context.drawImage(sourceCanvas, 0, 0);

  const expanded = settings.padding || 0.2;

  faces
    .filter((face) => face.active)
    .forEach((face) => {
      const x = clamp(face.x * sourceCanvas.width, 0, sourceCanvas.width);
      const y = clamp(face.y * sourceCanvas.height, 0, sourceCanvas.height);
      const width = clamp(
        face.width * sourceCanvas.width,
        1,
        sourceCanvas.width,
      );
      const height = clamp(
        face.height * sourceCanvas.height,
        1,
        sourceCanvas.height,
      );
      const padX = width * expanded;
      const padY = height * expanded;
      const regionX = clamp(Math.round(x - padX / 2), 0, sourceCanvas.width);
      const regionY = clamp(Math.round(y - padY / 2), 0, sourceCanvas.height);
      const regionWidth = Math.min(
        sourceCanvas.width - regionX,
        Math.round(width + padX),
      );
      const regionHeight = Math.min(
        sourceCanvas.height - regionY,
        Math.round(height + padY),
      );

      const regionCanvas = extractRegion(
        sourceCanvas,
        regionX,
        regionY,
        regionWidth,
        regionHeight,
      );
      const processedRegion = createProcessedRegion(regionCanvas, settings);
      const masked = applyMask(regionCanvas, processedRegion, settings);
      context.drawImage(masked, regionX, regionY);
    });

  return output;
}
