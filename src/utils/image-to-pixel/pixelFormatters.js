export function getPaletteDisplayName(paletteName) {
  if (paletteName === "gameboy") {
    return "GameBoy";
  }

  if (paletteName === "commodore64") {
    return "Commodore 64";
  }

  if (paletteName.toUpperCase() === paletteName) {
    return paletteName;
  }

  return paletteName.replace(/(^|\b)(\w)/g, (match) => match.toUpperCase());
}
