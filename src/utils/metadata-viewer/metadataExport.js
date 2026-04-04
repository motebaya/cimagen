import { removeMetadata } from "../metadataExtractor.js";

function getBaseFilename(filename) {
  return filename.replace(/\.[^/.]+$/, "") || "metadata";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function appendNodeLines(lines, nodes, depth = 0) {
  const indent = "  ".repeat(depth);

  nodes.forEach((node) => {
    lines.push(`${indent}${node.label}: ${node.displayValue}`);

    if (node.children.length) {
      appendNodeLines(lines, node.children, depth + 1);
    }
  });
}

export function buildMetadataTreeText(nodes) {
  const lines = [];
  appendNodeLines(lines, nodes);
  return lines.join("\n");
}

export function downloadMetadataJson(data, imageFilename) {
  const filename = `${getBaseFilename(imageFilename)}_metadata.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

export function downloadMetadataText(nodes, imageFilename) {
  const filename = `${getBaseFilename(imageFilename)}_metadata.txt`;
  const blob = new Blob([buildMetadataTreeText(nodes)], { type: "text/plain" });
  downloadBlob(blob, filename);
}

export async function downloadCleanImage(file, imageFilename) {
  const cleanBlob = await removeMetadata(file);
  downloadBlob(cleanBlob, `clean_${imageFilename}`);
}
