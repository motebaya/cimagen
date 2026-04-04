import { MetadataMethod, MetadataMethodLabel } from "../metadataExtractor.js";

export const METADATA_METHOD_OPTIONS = [
  {
    value: MetadataMethod.EXIFR,
    label: MetadataMethodLabel[MetadataMethod.EXIFR],
    title: "Balanced parse",
    description:
      "Good default for common EXIF, date, camera, and GPS fields across modern image formats.",
    helper: "Best starting point for most uploads.",
    tone: {
      backgroundColor: "rgba(59, 130, 246, 0.08)",
      borderColor: "rgba(59, 130, 246, 0.22)",
      color: "#2563eb",
    },
  },
  {
    value: MetadataMethod.EXIF_READER,
    label: MetadataMethodLabel[MetadataMethod.EXIF_READER],
    title: "Raw EXIF segment",
    description:
      "Reads the embedded APP1 EXIF block directly, which is useful for classic JPEG files with standard EXIF data.",
    helper: "Can return less when no raw EXIF block exists.",
    tone: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.24)",
      color: "#b45309",
    },
  },
  {
    value: MetadataMethod.EXIFREADER,
    label: MetadataMethodLabel[MetadataMethod.EXIFREADER],
    title: "Expanded tag tree",
    description:
      "Returns grouped metadata sections with detailed tag descriptions, which works well for deeper inspection.",
    helper: "Best when you want structured nested groups.",
    tone: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.24)",
      color: "#047857",
    },
  },
];

export function getMetadataMethodOption(method) {
  return (
    METADATA_METHOD_OPTIONS.find((option) => option.value === method) ||
    METADATA_METHOD_OPTIONS[0]
  );
}
