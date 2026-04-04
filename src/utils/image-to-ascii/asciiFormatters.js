export function buildAsciiMetadata(result) {
  if (!result) {
    return null;
  }

  return {
    lines: result.height,
    columns: result.width,
    characters: result.text.replace(/\n/g, "").length,
  };
}
