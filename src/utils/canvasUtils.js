export function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  return canvas;
}

export function cloneCanvas(source) {
  const canvas = createCanvas(source.width, source.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export function imageDataToCanvas(imageData) {
  const canvas = createCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function loadImageElement(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let objectUrl = null;

    image.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      resolve(image);
    };

    image.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error("Unable to load image source"));
    };

    if (typeof source === "string") {
      image.crossOrigin = "anonymous";
      image.src = source;
      return;
    }

    if (source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      image.src = objectUrl;
      return;
    }

    reject(new Error("Unsupported image source"));
  });
}

export async function sourceToCanvas(source) {
  if (!source) {
    throw new Error("Image source is required");
  }

  if (
    typeof HTMLCanvasElement !== "undefined" &&
    source instanceof HTMLCanvasElement
  ) {
    return cloneCanvas(source);
  }

  if (
    typeof OffscreenCanvas !== "undefined" &&
    source instanceof OffscreenCanvas
  ) {
    const canvas = createCanvas(source.width, source.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0);
    return canvas;
  }

  if (typeof ImageData !== "undefined" && source instanceof ImageData) {
    return imageDataToCanvas(source);
  }

  if (
    typeof HTMLImageElement !== "undefined" &&
    source instanceof HTMLImageElement
  ) {
    const canvas = createCanvas(
      source.naturalWidth || source.width,
      source.naturalHeight || source.height,
    );
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0);
    return canvas;
  }

  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    const canvas = createCanvas(source.width, source.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0);
    return canvas;
  }

  const image = await loadImageElement(source);
  const canvas = createCanvas(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
  );
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export function getAspectFitScale(width, height, maxWidth, maxHeight) {
  const widthScale = maxWidth / width;
  const heightScale = maxHeight / height;
  return Math.min(widthScale, heightScale);
}
