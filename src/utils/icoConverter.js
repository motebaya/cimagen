/**
 * Image to ICO converter utility
 * Converts images to .ico format with multiple sizes
 */

/**
 * Converts an image to ICO format with specified sizes
 * @param {HTMLCanvasElement} canvas - Source canvas with the image
 * @param {number[]} sizes - Array of sizes to include (e.g., [16, 32, 48])
 * @returns {Promise<Blob>} ICO file as blob
 */
export async function convertToIco(canvas, sizes = [16, 32, 48, 64, 128, 256]) {
  // ICO file structure:
  // Header (6 bytes) + Directory entries (16 bytes each) + Image data

  const images = [];

  // Generate images for each size
  for (const size of sizes) {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = size;
    resizedCanvas.height = size;
    const ctx = resizedCanvas.getContext("2d");

    // Apply sharpening for small sizes
    if (size <= 32) {
      ctx.imageSmoothingEnabled = false;
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    ctx.drawImage(canvas, 0, 0, size, size);

    // Convert to PNG blob
    const blob = await new Promise((resolve) => {
      resizedCanvas.toBlob(resolve, "image/png");
    });

    const arrayBuffer = await blob.arrayBuffer();
    images.push({
      size,
      data: new Uint8Array(arrayBuffer),
    });
  }

  // Build ICO file
  const headerSize = 6;
  const directorySize = 16 * images.length;
  let totalSize = headerSize + directorySize;

  // Calculate total size
  for (const img of images) {
    totalSize += img.data.length;
  }

  const icoData = new Uint8Array(totalSize);
  let offset = 0;

  // Write header
  icoData[offset++] = 0; // Reserved
  icoData[offset++] = 0;
  icoData[offset++] = 1; // Type: 1 = ICO
  icoData[offset++] = 0;
  icoData[offset++] = images.length & 0xff; // Number of images
  icoData[offset++] = (images.length >> 8) & 0xff;

  // Write directory entries
  let imageOffset = headerSize + directorySize;
  for (const img of images) {
    icoData[offset++] = img.size === 256 ? 0 : img.size; // Width (0 = 256)
    icoData[offset++] = img.size === 256 ? 0 : img.size; // Height (0 = 256)
    icoData[offset++] = 0; // Color palette
    icoData[offset++] = 0; // Reserved
    icoData[offset++] = 1; // Color planes
    icoData[offset++] = 0;
    icoData[offset++] = 32; // Bits per pixel
    icoData[offset++] = 0;

    // Image size (4 bytes, little-endian)
    const size = img.data.length;
    icoData[offset++] = size & 0xff;
    icoData[offset++] = (size >> 8) & 0xff;
    icoData[offset++] = (size >> 16) & 0xff;
    icoData[offset++] = (size >> 24) & 0xff;

    // Image offset (4 bytes, little-endian)
    icoData[offset++] = imageOffset & 0xff;
    icoData[offset++] = (imageOffset >> 8) & 0xff;
    icoData[offset++] = (imageOffset >> 16) & 0xff;
    icoData[offset++] = (imageOffset >> 24) & 0xff;

    imageOffset += img.data.length;
  }

  // Write image data
  for (const img of images) {
    icoData.set(img.data, offset);
    offset += img.data.length;
  }

  return new Blob([icoData], { type: "image/x-icon" });
}
