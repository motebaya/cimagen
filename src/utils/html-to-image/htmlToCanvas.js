import html2canvas from "html2canvas";

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function wrapPresentation(canvas, options) {
  if (options.fullPage) {
    return canvas;
  }

  const padding = options.padding || 0;
  const shadow = options.shadow ? 32 : 0;
  const frame = options.deviceFrame ? 18 : 0;
  const totalWidth = canvas.width + padding * 2 + shadow * 2 + frame * 2;
  const totalHeight = canvas.height + padding * 2 + shadow * 2 + frame * 2;
  const output = document.createElement("canvas");
  output.width = totalWidth;
  output.height = totalHeight;
  const context = output.getContext("2d");

  if (options.backgroundColor && options.backgroundColor !== "transparent") {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, output.width, output.height);
  }

  const offsetX = shadow + padding + frame;
  const offsetY = shadow + padding + frame;

  if (options.shadow) {
    context.save();
    context.shadowColor = "rgba(15, 23, 42, 0.22)";
    context.shadowBlur = 32;
    context.shadowOffsetY = 18;
    context.fillStyle = "rgba(255,255,255,0.001)";
    context.fillRect(offsetX, offsetY, canvas.width, canvas.height);
    context.restore();
  }

  if (options.deviceFrame) {
    context.save();
    context.fillStyle = options.theme === "dark" ? "#0f172a" : "#111827";
    drawRoundedRect(
      context,
      shadow + padding,
      shadow + padding,
      canvas.width + frame * 2,
      canvas.height + frame * 2,
      24,
    );
    context.fill();
    context.restore();
  }

  context.drawImage(canvas, offsetX, offsetY);
  return output;
}

function getCaptureTarget(doc, fullPage) {
  if (fullPage) {
    return doc.documentElement;
  }

  return doc.body;
}

export async function captureSandboxDocument(doc, options) {
  const target = getCaptureTarget(doc, options.fullPage);
  const width = options.width;
  const height = options.fullPage
    ? Math.min(
        target.scrollHeight || doc.body.scrollHeight || options.height,
        6000,
      )
    : options.height;

  const canvas = await html2canvas(target, {
    backgroundColor: null,
    width,
    height,
    useCORS: true,
    allowTaint: false,
    logging: false,
    scale: options.scaleFactor || 1,
    windowWidth: width,
    windowHeight: height,
    foreignObjectRendering: true,
  });

  const output = wrapPresentation(canvas, options);

  return {
    canvas: output,
    captureWidth: canvas.width,
    captureHeight: canvas.height,
  };
}
