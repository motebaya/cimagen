import { sourceToCanvas } from "../canvasUtils.js";

export async function createPdfImageEntries(files) {
  const entries = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const canvas = await sourceToCanvas(file);

    entries.push({
      canvas,
      filename: file.name,
      id: Date.now() + index,
      rotation: 0,
    });
  }

  return entries;
}

export function ensurePdfFilename(filename) {
  const trimmed = filename.trim();

  if (!trimmed) {
    return `images_${Date.now()}.pdf`;
  }

  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}

export function buildPdfExportMetadata({ images, settings }) {
  return [
    ["Pages", images.length],
    ["Size", settings.pageSize],
    [
      "Orientation",
      settings.orientation[0].toUpperCase() + settings.orientation.slice(1),
    ],
    ["Layout", settings.layout[0].toUpperCase() + settings.layout.slice(1)],
  ];
}
