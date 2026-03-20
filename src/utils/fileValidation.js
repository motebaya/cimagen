/**
 * File validation utilities
 * Provides strict file type validation for uploads
 */

/**
 * Validates if a file is an image
 * @param {File} file - File to validate
 * @returns {boolean} True if valid image
 */
export function isValidImage(file) {
  if (!file) return false;

  // Check MIME type
  const validMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
  ];

  if (!validMimeTypes.includes(file.type)) {
    return false;
  }

  // Check file extension as defensive measure
  const validExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".svg",
  ];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) =>
    fileName.endsWith(ext),
  );

  return hasValidExtension;
}

/**
 * Validates file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} True if within size limit
 */
export function isValidSize(file, maxSizeMB = 20) {
  if (!file) return false;
  return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * Validates multiple image files
 * @param {FileList|File[]} files - Files to validate
 * @param {number} maxSizeMB - Maximum size per file in MB
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export function validateImageFiles(files, maxSizeMB = 20) {
  const errors = [];

  if (!files || files.length === 0) {
    errors.push("No files selected");
    return { valid: false, errors };
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!isValidImage(file)) {
      errors.push(
        `${file.name}: Invalid image format. Only JPEG, PNG, WebP, GIF, BMP, and SVG are allowed.`,
      );
    }

    if (!isValidSize(file, maxSizeMB)) {
      errors.push(
        `${file.name}: File too large. Maximum size is ${maxSizeMB}MB.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets accept attribute for image file inputs
 * @returns {string} Accept attribute value
 */
export function getImageAcceptAttribute() {
  return "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml";
}
