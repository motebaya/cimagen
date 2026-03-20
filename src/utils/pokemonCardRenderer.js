/**
 * Pokémon Card renderer
 * date: 2026-03-20 - 4:38 PM
 * @github.com/motebaya
 */

/**
 * Enum defining image resize methods for card generation.
 * @readonly
 * @enum {string}
 */
export const ResizeMethod = {
  /** Smart crop with border color detection and padding */
  AUTO: "auto",
  /** Simple stretch/scale to fit target dimensions */
  SCALE: "scale",
  /** Center crop maintaining aspect ratio */
  CROP: "crop",
};

/**
 * Loads Pokémon card template configuration from JSON file.
 * Configuration includes template filenames and layout specifications for title, image, and description.
 *
 * @param {string} configPath - URL path to template.json configuration file
 * @returns {Promise<Object[]>} Array of template configuration objects
 */
export async function loadTemplateConfig(configPath) {
  const response = await fetch(configPath);
  return await response.json();
}

/**
 * Renders a complete Pokémon-style trading card with custom title, description, and image.
 * Supports 4 different card templates with configurable text layout and 3 image resize methods.
 *
 * @param {string} title - Card title text
 * @param {string} description - Card description text (automatically wrapped to fit)
 * @param {string|HTMLImageElement} image - User image source (data URL, path) or HTMLImageElement
 * @param {number} templateIndex - Template index (0-3) from loaded configuration
 * @param {string} resizeMethod - Image resize method: 'auto', 'scale', or 'crop'
 * @param {Object[]} templates - Loaded template configuration array from loadTemplateConfig()
 * @param {string} solidFontPath - URL path to solid.ttf font for title
 * @param {string} descFontPath - URL path to desc.ttf font for description
 * @param {string} assetsBasePath - Base URL path to card template images directory
 * @returns {Promise<HTMLCanvasElement>} Canvas containing the rendered Pokémon card
 */
export async function renderPokemonCard(
  title,
  description,
  image,
  templateIndex,
  resizeMethod,
  templates,
  solidFontPath,
  descFontPath,
  assetsBasePath,
) {
  // Load fonts
  const solidFont = new FontFace("PokemonSolid", `url(${solidFontPath})`);
  const descFont = new FontFace("PokemonDesc", `url(${descFontPath})`);
  await Promise.all([solidFont.load(), descFont.load()]);
  document.fonts.add(solidFont);
  document.fonts.add(descFont);

  const template = templates[templateIndex];

  // Load template image
  const templateImg = new Image();
  await new Promise((resolve, reject) => {
    templateImg.onload = resolve;
    templateImg.onerror = reject;
    templateImg.src = `${assetsBasePath}/${template.filename}`;
  });

  // Load user image
  let userImg;
  if (typeof image === "string") {
    userImg = new Image();
    await new Promise((resolve, reject) => {
      userImg.onload = resolve;
      userImg.onerror = reject;
      userImg.src = image;
    });
  } else {
    userImg = image;
  }

  // Process image based on resize method
  const targetSize = template.config.image.size;
  let processedImage;

  if (resizeMethod === ResizeMethod.AUTO) {
    processedImage = await smartAutoCropAndScale(userImg, targetSize);
  } else if (resizeMethod === ResizeMethod.SCALE) {
    processedImage = scaleImage(userImg, targetSize);
  } else if (resizeMethod === ResizeMethod.CROP) {
    processedImage = cropImage(userImg, targetSize);
  }

  // Create final canvas
  const canvas = document.createElement("canvas");
  canvas.width = templateImg.width;
  canvas.height = templateImg.height;
  const ctx = canvas.getContext("2d");

  // Draw template
  ctx.drawImage(templateImg, 0, 0);

  // Draw processed image
  const imgCoord = template.config.image.cordinate;
  ctx.drawImage(processedImage, imgCoord[0], imgCoord[1]);

  // Draw title
  drawText(
    ctx,
    title,
    template.config.title,
    solidFontPath,
    canvas.width,
    "PokemonSolid",
  );

  // Draw description
  drawText(
    ctx,
    description,
    template.config.desc,
    descFontPath,
    canvas.width,
    "PokemonDesc",
  );

  return canvas;
}

/**
 * Scales image to exact target dimensions without maintaining aspect ratio.
 *
 * @param {HTMLImageElement} img - Source image element
 * @param {number[]} targetSize - Target [width, height] dimensions
 * @returns {HTMLCanvasElement} Canvas with scaled image
 */
function scaleImage(img, targetSize) {
  const canvas = document.createElement("canvas");
  canvas.width = targetSize[0];
  canvas.height = targetSize[1];
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, targetSize[0], targetSize[1]);
  return canvas;
}

/**
 * Crops image to target dimensions using center crop technique.
 * Scales image proportionally to cover target area, then crops from center.
 *
 * @param {HTMLImageElement} img - Source image element
 * @param {number[]} targetSize - Target [width, height] dimensions
 * @returns {HTMLCanvasElement} Canvas with center-cropped image
 */
function cropImage(img, targetSize) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Resize to fit
  const minSize = Math.min(img.width, img.height);
  const maxTarget = Math.max(targetSize[0], targetSize[1]);
  const scale = maxTarget / minSize;

  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  // Center crop
  const x = scaledWidth / 2 - targetSize[0] / 2;
  const y = scaledHeight / 2 - targetSize[1] / 2;

  canvas.width = targetSize[0];
  canvas.height = targetSize[1];

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = scaledWidth;
  tempCanvas.height = scaledHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

  ctx.drawImage(tempCanvas, -x, -y);
  return canvas;
}

/**
 * Smart auto-crop and scale with border color detection.
 * Analyzes border pixels to determine dominant colors, creates padded background with those colors,
 * then scales and centers the image. Prevents distortion while filling target dimensions.
 *
 * @param {HTMLImageElement} img - Source image element
 * @param {number[]} targetSize - Target [width, height] dimensions
 * @returns {Promise<HTMLCanvasElement>} Canvas with smart-cropped image and colored borders
 */
async function smartAutoCropAndScale(img, targetSize) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Get border colors
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(img, 0, 0);

  const borderColors = getBorderColors(tempCanvas);

  // Calculate scaled size
  const minTarget = Math.min(targetSize[0], targetSize[1]);
  let scaledSize = patternResCustom(img.width, img.height, targetSize[0]);

  while (Math.min(scaledSize[0], scaledSize[1]) >= minTarget) {
    scaledSize = patternResCustom(img.width, img.height, scaledSize[0] - 1);
  }

  // Create background with border colors
  canvas.width = targetSize[0];
  canvas.height = targetSize[1];

  const spaceWidth = Math.floor((canvas.width - scaledSize[0]) / 2);
  const spaceHeight = Math.floor((canvas.height - scaledSize[1]) / 2);

  // Fill borders
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      let color;

      if (x < spaceWidth) color = borderColors.left;
      else if (x >= canvas.width - spaceWidth) color = borderColors.right;
      else if (y < spaceHeight) color = borderColors.top;
      else if (y >= canvas.height - spaceHeight) color = borderColors.bottom;
      else color = [0, 0, 0];

      data[idx] = color[0];
      data[idx + 1] = color[1];
      data[idx + 2] = color[2];
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Draw scaled image
  const pasteX = Math.floor((canvas.width - scaledSize[0]) / 2);
  const pasteY = Math.floor((canvas.height - scaledSize[1]) / 2);
  ctx.drawImage(img, pasteX, pasteY, scaledSize[0], scaledSize[1]);

  return canvas;
}

/**
 * Extracts dominant border colors from all four edges of an image.
 * Samples pixels along each edge and returns the most frequently occurring color per edge.
 *
 * @param {HTMLCanvasElement} canvas - Source canvas to analyze
 * @returns {Object} Object with top, right, bottom, left properties, each containing RGB array [r, g, b]
 */
function getBorderColors(canvas) {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const getPixel = (x, y) => {
    const idx = (y * canvas.width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  const getMostCommon = (pixels) => {
    const counts = {};
    let maxCount = 0;
    let maxColor = [0, 0, 0];

    for (const pixel of pixels) {
      const key = pixel.join(",");
      counts[key] = (counts[key] || 0) + 1;
      if (counts[key] > maxCount) {
        maxCount = counts[key];
        maxColor = pixel;
      }
    }
    return maxColor;
  };

  const top = [];
  const right = [];
  const bottom = [];
  const left = [];

  for (let x = 0; x < canvas.width - 1; x++) {
    top.push(getPixel(x, 0));
    bottom.push(getPixel(x, canvas.height - 1));
  }

  for (let y = 0; y < canvas.height - 1; y++) {
    left.push(getPixel(0, y));
    right.push(getPixel(canvas.width - 1, y));
  }

  return {
    top: getMostCommon(top),
    right: getMostCommon(right),
    bottom: getMostCommon(bottom),
    left: getMostCommon(left),
  };
}

/**
 * Calculates proportional resize dimensions maintaining aspect ratio.
 * Used for smart scaling where one dimension is fixed and the other scales proportionally.
 *
 * @param {number} x - Original width
 * @param {number} y - Original height
 * @param {number} res - Target resolution for the larger dimension
 * @returns {number[]} Array containing [width, height] as integers
 */
function patternResCustom(x, y, res) {
  if (x === y) {
    return [res, res];
  } else if (x > y) {
    return [res, Math.floor(y / (x / res))];
  } else {
    return [Math.floor(x / (y / res)), res];
  }
}

/**
 * Renders text on canvas with automatic line wrapping and optional centering.
 * Wraps text to fit within maxWidth, respects max line count, and applies spacing between lines.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {string} text - Text content to render
 * @param {Object} config - Text configuration object from template
 * @param {number} config.fontsize - Font size in pixels
 * @param {number} config.max_size - Maximum width in pixels for text wrapping
 * @param {number[]} config.cordinate - [x, y] starting position
 * @param {number} [config.max_line] - Maximum number of lines to render
 * @param {number} [config.space_line=1] - Vertical spacing between lines in pixels
 * @param {boolean} config.center - Whether to center-align text horizontally
 * @param {string} fontPath - Font path (unused but kept for API consistency)
 * @param {number} canvasWidth - Canvas width for center alignment calculation
 * @param {string} fontFamily - Font family name to use
 */
function drawText(ctx, text, config, fontPath, canvasWidth, fontFamily) {
  ctx.font = `${config.fontsize}px ${fontFamily}`;
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, text, config.max_size);
  const maxLines = config.max_line || lines.length;
  const linesToDraw = lines.slice(0, maxLines);

  let y = config.cordinate[1];
  const spaceLine = config.space_line || 1;

  for (const line of linesToDraw) {
    let x = config.cordinate[0];

    if (config.center) {
      const metrics = ctx.measureText(line);
      x = canvasWidth / 2 - metrics.width / 2;
    }

    ctx.fillText(line, x, y);
    y += spaceLine;
  }
}

/**
 * Wraps text to fit within a maximum width by measuring character-by-character.
 * Breaks into new line when adding the next character would exceed maxWidth.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context with font already set
 * @param {string} text - Text content to wrap
 * @param {number} maxWidth - Maximum width in pixels for each line
 * @returns {string[]} Array of text lines, each fitting within maxWidth
 */
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let currentLine = "";

  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = char;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
