function getBaseFilename(filename) {
  return filename.replace(/\.[^/.]+$/, "") || "ocr-result";
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function countOcrWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function buildOcrExportMetadata({ languageLabel, text }) {
  const trimmed = text.trim();
  const lines = trimmed ? trimmed.split(/\r?\n/).filter(Boolean).length : 0;

  return [
    ["Language", languageLabel],
    ["Characters", text.length],
    ["Words", countOcrWords(text)],
    ["Lines", lines],
  ];
}

export function buildOcrJsonPayload({
  imageFilename,
  language,
  languageLabel,
  text,
}) {
  return {
    filename: imageFilename,
    language,
    languageLabel,
    text,
    stats: {
      characters: text.length,
      words: countOcrWords(text),
      lines: text.trim()
        ? text.trim().split(/\r?\n/).filter(Boolean).length
        : 0,
    },
    exportedAt: new Date().toISOString(),
  };
}

export function downloadOcrText({ imageFilename, text }) {
  const blob = new Blob([text], { type: "text/plain" });
  triggerDownload(blob, `${getBaseFilename(imageFilename)}_ocr.txt`);
}

export function downloadOcrJson(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, `${getBaseFilename(payload.filename)}_ocr.json`);
}
