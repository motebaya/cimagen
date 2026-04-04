import { createCanvas, sourceToCanvas } from "../canvasUtils.js";
import {
  autoContrast,
  boxBlur,
  cleanupSpecks,
  dilate,
  erode,
  hysteresisThreshold,
  imageDataToGray,
  normalizeMap,
  runDifferenceOfGaussian,
  runLaplacian,
  runSobel,
  runThresholdEdges,
  sharpen,
} from "./lineArtFilters.js";
import {
  getPreviewSize,
  parseHexColor,
  resolveColors,
} from "./lineArtHelpers.js";

export async function createLineArt(source, options = {}) {
  const sourceCanvas = await sourceToCanvas(source);
  const previewSize = getPreviewSize(
    sourceCanvas.width,
    sourceCanvas.height,
    options.maxDimension || 1200,
  );
  const workingCanvas = createCanvas(previewSize.width, previewSize.height);
  const workingContext = workingCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  workingContext.imageSmoothingEnabled = true;
  workingContext.imageSmoothingQuality = "high";
  workingContext.drawImage(
    sourceCanvas,
    0,
    0,
    previewSize.width,
    previewSize.height,
  );
  const imageData = workingContext.getImageData(
    0,
    0,
    previewSize.width,
    previewSize.height,
  );
  const brightness = options.brightness ?? 1;
  const contrast = options.contrast ?? 1;
  const blur = Math.round(options.blur || 0);
  const sharpenAmount = options.sharpen || 0;
  const noiseReduction = options.noiseReduction || 0;
  const cleanupLevel = Math.round(options.cleanupLevel || 0);
  const threshold = options.threshold ?? 95;
  const lowThreshold = options.lowThreshold ?? Math.max(20, threshold * 0.55);
  const highThreshold = options.highThreshold ?? threshold;
  const edgeStrength = options.edgeStrength ?? 1;
  const thickness = options.thickness || "normal";

  let grayscale = imageDataToGray(imageData, brightness, contrast);
  if (options.autoContrast) {
    grayscale = autoContrast(grayscale);
  }
  grayscale = boxBlur(grayscale, previewSize.width, previewSize.height, blur);
  grayscale = sharpen(
    grayscale,
    previewSize.width,
    previewSize.height,
    sharpenAmount,
  );
  if (noiseReduction > 0) {
    grayscale = boxBlur(
      grayscale,
      previewSize.width,
      previewSize.height,
      Math.round(noiseReduction),
    );
  }

  let edgeMap;
  switch (options.mode) {
    case "laplacian":
      edgeMap = runLaplacian(grayscale, previewSize.width, previewSize.height);
      break;
    case "threshold":
      edgeMap = runThresholdEdges(
        grayscale,
        previewSize.width,
        previewSize.height,
      );
      break;
    case "dog":
      edgeMap = runDifferenceOfGaussian(
        grayscale,
        previewSize.width,
        previewSize.height,
      );
      break;
    default:
      edgeMap = runSobel(grayscale, previewSize.width, previewSize.height);
      break;
  }

  edgeMap = normalizeMap(edgeMap, edgeStrength);
  let binary = hysteresisThreshold(
    edgeMap,
    previewSize.width,
    previewSize.height,
    lowThreshold,
    highThreshold,
  );
  binary = cleanupSpecks(
    binary,
    previewSize.width,
    previewSize.height,
    cleanupLevel,
  );

  if (thickness === "thick") {
    binary = dilate(binary, previewSize.width, previewSize.height, 1);
  }

  if (thickness === "thin") {
    binary = erode(binary, previewSize.width, previewSize.height, 1);
  }

  return {
    width: previewSize.width,
    height: previewSize.height,
    sourceWidth: sourceCanvas.width,
    sourceHeight: sourceCanvas.height,
    binary,
    coverage:
      binary.reduce((total, value) => total + (value ? 1 : 0), 0) /
      (previewSize.width * previewSize.height),
  };
}

export function renderLineArtCanvas(result, options = {}) {
  const scale = Math.max(1, options.scale || 1);
  const colors = resolveColors(
    options.background || "#ffffff",
    options.customBackground || "#ffffff",
    options.invert || false,
  );
  const baseCanvas = createCanvas(result.width, result.height);
  const baseContext = baseCanvas.getContext("2d");
  const imageData = baseContext.createImageData(result.width, result.height);
  const [backgroundRed, backgroundGreen, backgroundBlue] =
    colors.background === "transparent"
      ? [0, 0, 0]
      : parseHexColor(colors.background);
  const [lineRed, lineGreen, lineBlue] = parseHexColor(colors.line);

  for (let index = 0; index < result.binary.length; index += 1) {
    const pixelIndex = index * 4;
    const active = Boolean(result.binary[index]);
    const isTransparentBackground = colors.background === "transparent";
    const red = active ? lineRed : backgroundRed;
    const green = active ? lineGreen : backgroundGreen;
    const blue = active ? lineBlue : backgroundBlue;
    const alpha = active ? 255 : isTransparentBackground ? 0 : 255;

    imageData.data[pixelIndex] = red;
    imageData.data[pixelIndex + 1] = green;
    imageData.data[pixelIndex + 2] = blue;
    imageData.data[pixelIndex + 3] = alpha;
  }

  baseContext.putImageData(imageData, 0, 0);

  if (scale === 1) {
    return baseCanvas;
  }

  const scaledCanvas = createCanvas(
    result.width * scale,
    result.height * scale,
  );
  const scaledContext = scaledCanvas.getContext("2d");
  scaledContext.imageSmoothingEnabled = false;
  scaledContext.drawImage(
    baseCanvas,
    0,
    0,
    scaledCanvas.width,
    scaledCanvas.height,
  );
  return scaledCanvas;
}
