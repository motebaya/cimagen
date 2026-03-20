/**
 * Metadata extraction utilities
 * Uses exifr library and exif-js as fallback
 */

import exifr from "exifr";

/**
 * Enum defining available metadata extraction methods.
 * @readonly
 * @enum {string}
 */
export const MetadataMethod = {
  /** Modern exifr library with comprehensive format support */
  EXIFR: "exifr",
  /** Legacy exif-js library for compatibility */
  EXIF_JS: "exif-js",
};

/**
 * Extracts EXIF metadata from an image file using the specified method.
 * Returns structured metadata including GPS and camera information detection.
 *
 * @param {File} file - Image file to extract metadata from
 * @param {string} [method=MetadataMethod.EXIFR] - Extraction method: 'exifr' or 'exif-js'
 * @returns {Promise<Object>} Object containing success status, extracted data, method used, and boolean flags for GPS/camera presence
 * @returns {boolean} return.success - Whether extraction succeeded
 * @returns {Object} return.data - Extracted metadata key-value pairs
 * @returns {string} return.method - Method used for extraction
 * @returns {boolean} return.hasGPS - True if GPS coordinates found
 * @returns {boolean} return.hasCamera - True if camera make/model found
 * @returns {string} [return.error] - Error message if extraction failed
 */
export async function extractMetadata(file, method = MetadataMethod.EXIFR) {
  if (method === MetadataMethod.EXIFR) {
    return await extractWithExifr(file);
  } else {
    return await extractWithExifJs(file);
  }
}

/**
 * Extracts metadata using the exifr library.
 * Parses TIFF, EXIF, GPS, IFD0, IFD1, IPTC, and JFIF segments.
 *
 * @param {File} file - Image file to extract metadata from
 * @returns {Promise<Object>} Extraction result with success status, data, and detection flags
 */
async function extractWithExifr(file) {
  try {
    // Parse everything - all segments and blocks
    const data = await exifr.parse(file, true);

    return {
      success: true,
      data: data || {},
      method: "exifr",
      hasGPS: !!(data?.latitude && data?.longitude),
      hasCamera: !!(data?.Make || data?.Model),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      method: "exifr",
      data: {},
    };
  }
}

/**
 * Extracts metadata using the legacy exif-js library.
 * Dynamically loads exif-js script from public directory if not already loaded.
 *
 * @param {File} file - Image file to extract metadata from
 * @returns {Promise<Object>} Extraction result with success status, data, and detection flags
 */
async function extractWithExifJs(file) {
  return new Promise((resolve) => {
    // Load exif-js from public directory
    if (!window.EXIF) {
      const script = document.createElement("script");
      script.src = `${import.meta.env.BASE_URL}exif-js.js`;
      script.onload = () => processWithExifJs(file, resolve);
      script.onerror = () =>
        resolve({
          success: false,
          error: "Failed to load exif-js library",
          method: "exif-js",
          data: {},
        });
      document.head.appendChild(script);
    } else {
      processWithExifJs(file, resolve);
    }
  });
}

/**
 * Processes image file with exif-js library after script is loaded.
 * Reads file as data URL, loads into image element, and extracts all EXIF tags.
 *
 * @param {File} file - Image file to process
 * @param {Function} resolve - Promise resolve callback
 */
function processWithExifJs(file, resolve) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Give the image time to fully load before extracting
        setTimeout(() => {
          if (!window.EXIF) {
            resolve({
              success: false,
              error: "EXIF library not loaded",
              method: "exif-js",
              data: {},
            });
            return;
          }

          window.EXIF.getData(img, function () {
            try {
              const allTags = window.EXIF.getAllTags(this);

              // Check if we got any tags
              if (!allTags || Object.keys(allTags).length === 0) {
                resolve({
                  success: false,
                  error: "No EXIF data found in image",
                  method: "exif-js",
                  data: {},
                });
                return;
              }

              const hasGPS = !!(allTags.GPSLatitude || allTags.GPSLongitude);
              const hasCamera = !!(allTags.Make || allTags.Model);

              resolve({
                success: true,
                data: allTags,
                method: "exif-js",
                hasGPS,
                hasCamera,
              });
            } catch (err) {
              console.error("Error getting EXIF tags:", err);
              resolve({
                success: false,
                error: "Failed to extract EXIF tags",
                method: "exif-js",
                data: {},
              });
            }
          });
        }, 100);
      } catch (err) {
        console.error("Error in EXIF.getData:", err);
        resolve({
          success: false,
          error: "Failed to extract metadata with exif-js",
          method: "exif-js",
          data: {},
        });
      }
    };
    img.onerror = () => {
      resolve({
        success: false,
        error: "Failed to load image",
        method: "exif-js",
        data: {},
      });
    };
    img.src = e.target.result;
  };

  reader.onerror = () => {
    resolve({
      success: false,
      error: "Failed to read file",
      method: "exif-js",
      data: {},
    });
  };

  reader.readAsDataURL(file);
}

/**
 * Formats metadata object as human-readable plain text.
 * Converts each key-value pair to "key: value" format, handling arrays and objects.
 *
 * @param {Object} metadata - Metadata object with key-value pairs
 * @returns {string} Formatted text with one entry per line
 */
export function formatMetadataAsText(metadata) {
  const lines = [];

  for (const [key, value] of Object.entries(metadata)) {
    if (value !== null && value !== undefined) {
      lines.push(`${key}: ${formatValue(value)}`);
    }
  }

  return lines.join("\n");
}

/**
 * Formats a metadata value for text display.
 * Handles arrays, objects, and primitive types appropriately.
 *
 * @param {*} value - Metadata value to format
 * @returns {string} Formatted string representation
 */
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Removes all metadata from an image file by re-rendering to canvas.
 * Creates a clean copy without EXIF, GPS, or other embedded metadata.
 *
 * @param {File} file - Image file to strip metadata from
 * @returns {Promise<Blob>} Blob containing the cleaned image data
 * @throws {Error} If image loading or blob creation fails
 */
/**
 * Removes all metadata from an image file by re-rendering to canvas.
 * Creates a clean copy without EXIF, GPS, or other embedded metadata.
 *
 * @param {File} file - Image file to strip metadata from
 * @returns {Promise<Blob>} Blob containing the cleaned image data
 * @throws {Error} If image loading or blob creation fails
 */
export async function removeMetadata(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, file.type || "image/jpeg");
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Downloads metadata as a timestamped text file.
 * Formats metadata as plain text and triggers browser download with filename pattern: originalname_metadata_timestamp.txt
 *
 * @param {Object} metadata - Metadata object with key-value pairs
 * @param {string} originalFilename - Original image filename (without extension)
 */
export function downloadMetadataAsText(metadata, originalFilename) {
  const text = formatMetadataAsText(metadata);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const filename = `${originalFilename}_metadata_${timestamp}.txt`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
