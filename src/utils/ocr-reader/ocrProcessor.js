import { cloneCanvas, sourceToCanvas } from "../canvasUtils.js";

function normalizeProgress(progress) {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(progress * 100)));
}

export async function preprocessOcrImage(imageSource) {
  const sourceCanvas = await sourceToCanvas(imageSource);
  const canvas = cloneCanvas(sourceCanvas);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to prepare image for OCR.");
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const gray =
      data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
    data[index] = gray;
    data[index + 1] = gray;
    data[index + 2] = gray;
  }

  const threshold = 128;

  for (let index = 0; index < data.length; index += 4) {
    const value = data[index] > threshold ? 255 : 0;
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

export async function recognizeImageText({
  imageSource,
  language,
  onProgress,
}) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(language, undefined, {
    logger: (message) => {
      onProgress?.({
        progress: normalizeProgress(message.progress),
        status: message.status,
      });
    },
  });

  try {
    const canvas = await preprocessOcrImage(imageSource);
    const result = await worker.recognize(canvas);
    return result.data.text || "";
  } finally {
    await worker.terminate();
  }
}
