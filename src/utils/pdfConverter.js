/**
 * Image to PDF converter utility
 * Converts multiple images to a single PDF document
 */

import jsPDF from "jspdf";

/**
 * Page size presets in mm
 */
export const PAGE_SIZES = {
  A4: { width: 210, height: 297 },
  LETTER: { width: 215.9, height: 279.4 },
};

/**
 * Layout modes for image placement
 */
export const LAYOUT_MODES = {
  CONTAIN: "contain",
  COVER: "cover",
  ACTUAL: "actual",
};

/**
 * Converts images to PDF
 * @param {Array} images - Array of {canvas, rotation, filename} objects
 * @param {Object} options - PDF generation options
 * @returns {Blob} PDF blob
 */
export async function convertImagesToPdf(images, options = {}) {
  const {
    pageSize = "A4",
    orientation = "portrait",
    layout = LAYOUT_MODES.CONTAIN,
    margin = 10,
    backgroundColor = "white",
    quality = 0.92,
  } = options;

  // Get page dimensions
  let pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  // Swap dimensions for landscape
  if (orientation === "landscape") {
    pageDimensions = {
      width: pageDimensions.height,
      height: pageDimensions.width,
    };
  }

  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize === "AUTO" ? "a4" : pageSize.toLowerCase(),
  });

  let isFirstPage = true;

  for (const image of images) {
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    // Apply rotation if needed
    let canvas = image.canvas;
    if (image.rotation !== 0) {
      canvas = rotateCanvas(image.canvas, image.rotation);
    }

    // Set background color
    if (backgroundColor === "black") {
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageDimensions.width, pageDimensions.height, "F");
    }

    // Calculate image dimensions based on layout mode
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pageWidth = pageDimensions.width - margin * 2;
    const pageHeight = pageDimensions.height - margin * 2;

    let finalWidth, finalHeight, x, y;

    if (layout === LAYOUT_MODES.ACTUAL) {
      // Use actual size (convert pixels to mm at 96 DPI)
      finalWidth = (imgWidth * 25.4) / 96;
      finalHeight = (imgHeight * 25.4) / 96;

      // Center on page
      x = (pageDimensions.width - finalWidth) / 2;
      y = (pageDimensions.height - finalHeight) / 2;
    } else if (layout === LAYOUT_MODES.COVER) {
      // Cover entire page
      const scaleX = pageWidth / imgWidth;
      const scaleY = pageHeight / imgHeight;
      const scale = Math.max(scaleX, scaleY);

      finalWidth = imgWidth * scale;
      finalHeight = imgHeight * scale;

      x = margin + (pageWidth - finalWidth) / 2;
      y = margin + (pageHeight - finalHeight) / 2;
    } else {
      // Contain (default) - fit within page maintaining aspect ratio
      const scaleX = pageWidth / imgWidth;
      const scaleY = pageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      finalWidth = imgWidth * scale;
      finalHeight = imgHeight * scale;

      x = margin + (pageWidth - finalWidth) / 2;
      y = margin + (pageHeight - finalHeight) / 2;
    }

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);
    pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
  }

  return pdf.output("blob");
}

/**
 * Generates PDF preview as data URLs for all pages
 * @param {Array} images - Array of {canvas, rotation, filename} objects
 * @param {Object} options - PDF generation options
 * @returns {Array<string>} Array of data URLs for each page
 */
export function generatePdfPreviews(images, options = {}) {
  if (images.length === 0) return [];

  const {
    pageSize = "A4",
    orientation = "portrait",
    layout = LAYOUT_MODES.CONTAIN,
    margin = 10,
    backgroundColor = "white",
  } = options;

  // Get page dimensions
  let pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;

  // Swap dimensions for landscape
  if (orientation === "landscape") {
    pageDimensions = {
      width: pageDimensions.height,
      height: pageDimensions.width,
    };
  }

  const previews = [];

  for (const image of images) {
    // Create preview canvas for this page
    const previewCanvas = document.createElement("canvas");
    const scale = 2; // Higher resolution for preview
    previewCanvas.width = pageDimensions.width * scale;
    previewCanvas.height = pageDimensions.height * scale;
    const ctx = previewCanvas.getContext("2d");

    ctx.scale(scale, scale);

    // Set background
    if (backgroundColor === "white") {
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "#000000";
    }
    ctx.fillRect(0, 0, pageDimensions.width, pageDimensions.height);

    // Draw image
    let canvas = image.canvas;
    if (image.rotation !== 0) {
      canvas = rotateCanvas(image.canvas, image.rotation);
    }

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pageWidth = pageDimensions.width - margin * 2;
    const pageHeight = pageDimensions.height - margin * 2;

    let finalWidth, finalHeight, x, y;

    if (layout === LAYOUT_MODES.ACTUAL) {
      finalWidth = (imgWidth * 25.4) / 96;
      finalHeight = (imgHeight * 25.4) / 96;
      x = (pageDimensions.width - finalWidth) / 2;
      y = (pageDimensions.height - finalHeight) / 2;
    } else if (layout === LAYOUT_MODES.COVER) {
      const scaleX = pageWidth / imgWidth;
      const scaleY = pageHeight / imgHeight;
      const scaleVal = Math.max(scaleX, scaleY);
      finalWidth = imgWidth * scaleVal;
      finalHeight = imgHeight * scaleVal;
      x = margin + (pageWidth - finalWidth) / 2;
      y = margin + (pageHeight - finalHeight) / 2;
    } else {
      const scaleX = pageWidth / imgWidth;
      const scaleY = pageHeight / imgHeight;
      const scaleVal = Math.min(scaleX, scaleY);
      finalWidth = imgWidth * scaleVal;
      finalHeight = imgHeight * scaleVal;
      x = margin + (pageWidth - finalWidth) / 2;
      y = margin + (pageHeight - finalHeight) / 2;
    }

    ctx.drawImage(canvas, x, y, finalWidth, finalHeight);

    previews.push(previewCanvas.toDataURL("image/png"));
  }

  return previews;
}

/**
 * Rotates a canvas by specified degrees
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} degrees - Rotation in degrees (0, 90, 180, 270)
 * @returns {HTMLCanvasElement} Rotated canvas
 */
function rotateCanvas(canvas, degrees) {
  const rotated = document.createElement("canvas");
  const ctx = rotated.getContext("2d");

  if (degrees === 90 || degrees === 270) {
    rotated.width = canvas.height;
    rotated.height = canvas.width;
  } else {
    rotated.width = canvas.width;
    rotated.height = canvas.height;
  }

  ctx.translate(rotated.width / 2, rotated.height / 2);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return rotated;
}

/**
 * Compresses an image canvas
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} quality - Quality 0-1
 * @returns {Promise<HTMLCanvasElement>} Compressed canvas
 */
export async function compressImage(canvas, quality = 0.8) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const img = new Image();
        img.onload = () => {
          const compressed = document.createElement("canvas");
          compressed.width = canvas.width;
          compressed.height = canvas.height;
          const ctx = compressed.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(compressed);
        };
        img.src = URL.createObjectURL(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}
