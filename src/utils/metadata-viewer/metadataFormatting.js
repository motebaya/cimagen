const FILE_TYPE_TONES = {
  jpg: {
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderColor: "rgba(249, 115, 22, 0.26)",
    color: "#c2410c",
  },
  jpeg: {
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderColor: "rgba(249, 115, 22, 0.26)",
    color: "#c2410c",
  },
  png: {
    backgroundColor: "rgba(20, 184, 166, 0.12)",
    borderColor: "rgba(20, 184, 166, 0.26)",
    color: "#0f766e",
  },
  webp: {
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderColor: "rgba(59, 130, 246, 0.26)",
    color: "#1d4ed8",
  },
  gif: {
    backgroundColor: "rgba(244, 63, 94, 0.12)",
    borderColor: "rgba(244, 63, 94, 0.24)",
    color: "#be123c",
  },
  tiff: {
    backgroundColor: "rgba(100, 116, 139, 0.12)",
    borderColor: "rgba(100, 116, 139, 0.24)",
    color: "#334155",
  },
  tif: {
    backgroundColor: "rgba(100, 116, 139, 0.12)",
    borderColor: "rgba(100, 116, 139, 0.24)",
    color: "#334155",
  },
  heic: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.24)",
    color: "#047857",
  },
  heif: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.24)",
    color: "#047857",
  },
  avif: {
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderColor: "rgba(37, 99, 235, 0.24)",
    color: "#1d4ed8",
  },
  default: {
    backgroundColor: "rgba(15, 23, 42, 0.08)",
    borderColor: "rgba(15, 23, 42, 0.16)",
    color: "#334155",
  },
};

const PREVIEW_BADGE_TONES = {
  primary: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.22)",
    color: "#2563eb",
  },
  neutral: {
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    borderColor: "rgba(148, 163, 184, 0.24)",
    color: "#475569",
  },
  success: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.24)",
    color: "#047857",
  },
  info: {
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderColor: "rgba(14, 165, 233, 0.24)",
    color: "#0369a1",
  },
};

export const METADATA_IMAGE_ACCEPT_ATTRIBUTE =
  ".jpg,.jpeg,.png,.webp,.gif,.tif,.tiff,.heic,.heif,.avif";

export function buildBasicMetadataItems(file) {
  if (!file) {
    return [];
  }

  const fileTypeLabel = resolveFileTypeLabel(file);

  return [
    {
      id: "name",
      label: "File name",
      value: file.name,
    },
    {
      id: "size",
      label: "File size",
      value: formatFileSize(file.size),
    },
    {
      id: "modified",
      label: "Last modified",
      value: formatLastModified(file.lastModified),
    },
    {
      id: "type",
      label: "File type",
      value: fileTypeLabel,
      tone: getFileTypeTone(fileTypeLabel),
    },
  ];
}

export function buildPreviewBadges({ metadataResult, methodOption }) {
  const badges = [
    {
      id: "method",
      label: `Method ${methodOption.label}`,
      tone: PREVIEW_BADGE_TONES.primary,
    },
  ];

  if (metadataResult?.fieldCount) {
    badges.push({
      id: "fields",
      label: `${metadataResult.fieldCount} fields`,
      tone: PREVIEW_BADGE_TONES.neutral,
    });
  }

  if (metadataResult?.hasGPS) {
    badges.push({
      id: "gps",
      label: "GPS detected",
      tone: PREVIEW_BADGE_TONES.success,
    });
  }

  if (metadataResult?.hasCamera) {
    badges.push({
      id: "camera",
      label: "Camera info",
      tone: PREVIEW_BADGE_TONES.info,
    });
  }

  return badges;
}

export function buildExportMetadata({ metadataResult, methodOption }) {
  return [
    ["Method", methodOption.label],
    ["Fields", metadataResult?.fieldCount ?? 0],
    ["GPS", metadataResult?.hasGPS ? "Detected" : "None"],
    ["Camera", metadataResult?.hasCamera ? "Detected" : "None"],
  ];
}

function resolveFileTypeLabel(file) {
  const subtype = file.type?.split("/")?.[1];
  const extension = file.name.split(".").pop();
  const value = (subtype || extension || "image").toUpperCase();
  return value === "JPEG" ? "JPG" : value;
}

function getFileTypeTone(label) {
  const key = label.toLowerCase();
  return FILE_TYPE_TONES[key] || FILE_TYPE_TONES.default;
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 10 || power === 0 ? 0 : 1)} ${units[power]}`;
}

function formatLastModified(timestamp) {
  if (!timestamp) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}
