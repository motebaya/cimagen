import { createCanvas } from "../canvasUtils.js";

function blurBackground(context, canvas, blurAmount) {
  const blurred = createCanvas(canvas.width, canvas.height);
  const blurredContext = blurred.getContext("2d");
  blurredContext.filter = `blur(${blurAmount}px)`;
  blurredContext.drawImage(canvas, 0, 0);
  blurredContext.filter = "none";
  context.drawImage(blurred, 0, 0);
}

export function drawBackground(
  context,
  width,
  height,
  settings,
  sourceCanvas,
  backgroundImage,
) {
  if (settings.backgroundMode === "transparent") {
    return;
  }

  if (settings.backgroundMode === "color") {
    context.fillStyle = settings.backgroundColor || "#ffffff";
    context.fillRect(0, 0, width, height);
    return;
  }

  if (settings.backgroundMode === "gradient") {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, settings.gradientFrom || "#eff6ff");
    gradient.addColorStop(1, settings.gradientTo || "#dbeafe");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    return;
  }

  if (settings.backgroundMode === "blur") {
    blurBackground(context, sourceCanvas, settings.backgroundBlur || 18);
    return;
  }

  if (settings.backgroundMode === "image" && backgroundImage) {
    context.drawImage(backgroundImage, 0, 0, width, height);
  }
}

export function composeBackgroundRemoval(
  sourceCanvas,
  maskCanvas,
  settings,
  backgroundImage,
) {
  const output = createCanvas(sourceCanvas.width, sourceCanvas.height);
  const context = output.getContext("2d");

  drawBackground(
    context,
    output.width,
    output.height,
    settings,
    sourceCanvas,
    backgroundImage,
  );

  const foregroundCanvas = createCanvas(output.width, output.height);
  const foregroundContext = foregroundCanvas.getContext("2d");
  foregroundContext.drawImage(sourceCanvas, 0, 0);
  foregroundContext.globalCompositeOperation = "destination-in";
  foregroundContext.drawImage(maskCanvas, 0, 0, output.width, output.height);
  foregroundContext.globalCompositeOperation = "source-over";
  context.drawImage(foregroundCanvas, 0, 0);

  return output;
}
