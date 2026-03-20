import exif from "exif-reader";
import exifr from "exifr";
import ExifReader from "exifreader";

/**
 * Enum defining available metadata extraction methods.
 * @readonly
 * @enum {string}
 */
export const MetadataMethod = {
  EXIFR: "exifr",
  EXIF_READER: "exif-reader",
  EXIFREADER: "exifreader",
};

export const MetadataMethodLabel = {
  [MetadataMethod.EXIFR]: "exifr",
  [MetadataMethod.EXIF_READER]: "exif-reader",
  [MetadataMethod.EXIFREADER]: "exifreader",
};

/**
 * Extracts EXIF metadata from an image file using the specified method.
 * Returns structured metadata including GPS and camera information detection.
 *
 * @param {File} file - Image file to extract metadata from
 * @param {string} [method=MetadataMethod.EXIFR] - Extraction method identifier
 * @returns {Promise<Object>} Object containing success status, extracted data, method used, and boolean flags for GPS/camera presence
 * @returns {boolean} return.success - Whether extraction succeeded
 * @returns {Object} return.data - Extracted metadata key-value pairs
 * @returns {string} return.method - Method used for extraction
 * @returns {boolean} return.hasGPS - True if GPS coordinates found
 * @returns {boolean} return.hasCamera - True if camera make/model found
 * @returns {string} [return.error] - Error message if extraction failed
 */
export async function extractMetadata(file, method = MetadataMethod.EXIFR) {
  switch (method) {
    case MetadataMethod.EXIFR:
      return extractWithExifr(file);
    case MetadataMethod.EXIF_READER:
      return extractWithExifReader(file);
    case MetadataMethod.EXIFREADER:
      return extractWithExifReaderJs(file);
    default:
      return buildErrorResult(method, `Unsupported metadata method: ${method}`);
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
    const data = await exifr.parse(file, true);
    return buildSuccessResult(MetadataMethod.EXIFR, sanitizeForJson(data) ?? {}, {
      gps: extractGpsFromExifr(data),
      hasCamera: hasCameraInfo(data),
    });
  } catch (error) {
    return buildErrorResult(MetadataMethod.EXIFR, error.message);
  }
}

async function extractWithExifReader(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const rawExifBuffer = extractRawExifBuffer(arrayBuffer);

    if (rawExifBuffer == null) {
      return buildErrorResult(
        MetadataMethod.EXIF_READER,
        "No raw EXIF APP1 segment found in this image.",
      );
    }

    const data = exif(rawExifBuffer);
    return buildSuccessResult(
      MetadataMethod.EXIF_READER,
      sanitizeForJson(data) ?? {},
      {
        gps: extractGpsFromExifReader(data),
        hasCamera: hasCameraInfo(data?.Image) || hasCameraInfo(data?.Photo),
      },
    );
  } catch (error) {
    return buildErrorResult(MetadataMethod.EXIF_READER, error.message);
  }
}

async function extractWithExifReaderJs(file) {
  try {
    const data = await ExifReader.load(file, {
      expanded: true,
      async: true,
      includeUnknown: true,
      computed: true,
    });

    return buildSuccessResult(
      MetadataMethod.EXIFREADER,
      sanitizeForJson(data) ?? {},
      {
        gps: extractGpsFromExifReaderJs(data),
        hasCamera: hasExifReaderJsCameraInfo(data),
      },
    );
  } catch (error) {
    return buildErrorResult(MetadataMethod.EXIFREADER, error.message);
  }
}

function buildSuccessResult(method, data, options = {}) {
  const gps = normalizeGps(options.gps);
  return {
    success: true,
    data,
    method,
    hasGPS: gps != null,
    hasCamera: options.hasCamera ?? hasCameraInfo(data),
    gps,
    fieldCount: countMetadataFields(data),
  };
}

function buildErrorResult(method, error) {
  return {
    success: false,
    error,
    method,
    data: {},
    hasGPS: false,
    hasCamera: false,
    gps: null,
    fieldCount: 0,
  };
}

function sanitizeForJson(value) {
  if (value == null) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForJson(item));
  }

  if (ArrayBuffer.isView(value)) {
    return Array.from(value);
  }

  if (value instanceof ArrayBuffer) {
    return Array.from(new Uint8Array(value));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeForJson(nestedValue),
      ]),
    );
  }

  return value;
}

function extractRawExifBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);

  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      return null;
    }

    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) {
      return null;
    }

    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const segmentStart = offset + 4;
    const segmentEnd = segmentStart + segmentLength - 2;

    if (segmentEnd > bytes.length) {
      return null;
    }

    if (
      marker === 0xe1 &&
      segmentLength >= 8 &&
      bytes[segmentStart] === 0x45 &&
      bytes[segmentStart + 1] === 0x78 &&
      bytes[segmentStart + 2] === 0x69 &&
      bytes[segmentStart + 3] === 0x66 &&
      bytes[segmentStart + 4] === 0x00 &&
      bytes[segmentStart + 5] === 0x00
    ) {
      return bytes.slice(segmentStart + 6, segmentEnd).buffer;
    }

    offset += 2 + segmentLength;
  }

  return null;
}

function extractGpsFromExifr(data) {
  return normalizeGps({
    latitude: data?.latitude,
    longitude: data?.longitude,
  });
}

function extractGpsFromExifReader(data) {
  const gps = data?.GPSInfo;
  if (gps == null) {
    return null;
  }

  return normalizeGps({
    latitude: dmsToDecimal(gps.GPSLatitude, gps.GPSLatitudeRef),
    longitude: dmsToDecimal(gps.GPSLongitude, gps.GPSLongitudeRef),
  });
}

function extractGpsFromExifReaderJs(data) {
  const gps = data?.gps;
  if (gps == null) {
    return null;
  }

  return normalizeGps({
    latitude: extractTagNumber(gps.Latitude),
    longitude: extractTagNumber(gps.Longitude),
  });
}

function hasExifReaderJsCameraInfo(data) {
  return [data?.exif, data?.xmp, data?.makerNotes, data?.file].some((group) =>
    hasCameraInfo(group),
  );
}

function hasCameraInfo(data) {
  if (data == null || typeof data !== "object") {
    return false;
  }

  return [
    data.Make,
    data.Model,
    data.LensModel,
    data["Make"],
    data["Model"],
    data["Lens Model"],
  ].some((value) => value != null);
}

function normalizeGps(gps) {
  const latitude = parseCoordinateValue(gps?.latitude);
  const longitude = parseCoordinateValue(gps?.longitude);

  if (latitude == null || longitude == null) {
    return null;
  }

  return { latitude, longitude };
}

function extractTagNumber(tag) {
  if (tag == null) {
    return null;
  }

  return parseCoordinateValue(tag.computed ?? tag.value ?? tag.description ?? tag);
}

function parseCoordinateValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return numeric;
    }

    const dmsMatch = trimmed.match(
      /(-?\d+(?:\.\d+)?)\s*(?:deg|°)\s*(\d+(?:\.\d+)?)?'?\s*(\d+(?:\.\d+)?)?"?\s*([NSEW])?/i,
    );
    if (dmsMatch != null) {
      const degrees = Number(dmsMatch[1]);
      const minutes = Number(dmsMatch[2] ?? 0);
      const seconds = Number(dmsMatch[3] ?? 0);
      const ref = dmsMatch[4]?.toUpperCase();
      const absolute = Math.abs(degrees) + minutes / 60 + seconds / 3600;
      const sign = degrees < 0 || ref === "S" || ref === "W" ? -1 : 1;
      return absolute * sign;
    }
  }

  return null;
}

function dmsToDecimal(values, ref) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  const [degrees = 0, minutes = 0, seconds = 0] = values.map(Number);
  if (
    !Number.isFinite(degrees) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds)
  ) {
    return null;
  }

  const decimal = degrees + minutes / 60 + seconds / 3600;
  return ref === "S" || ref === "W" ? -decimal : decimal;
}

function countMetadataFields(value) {
  if (value == null) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countMetadataFields(item), 0);
  }

  if (typeof value === "object") {
    return Object.values(value).reduce(
      (total, item) => total + countMetadataFields(item),
      Object.keys(value).length,
    );
  }

  return 1;
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
