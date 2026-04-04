import { useMemo } from "react";
import { buildPaletteOverlayMap } from "../../utils/color-palette-extractor/index.js";

export default function usePaletteImageOverlay({
  palette,
  sampledPixels,
  selectedColorId,
}) {
  const overlayMap = useMemo(() => {
    if (!palette?.length || !sampledPixels?.length) {
      return [];
    }

    return buildPaletteOverlayMap(sampledPixels, palette);
  }, [palette, sampledPixels]);

  const selectedOverlay = useMemo(() => {
    if (!palette?.length || !selectedColorId) {
      return null;
    }

    const index = palette.findIndex((color) => color.id === selectedColorId);
    return index >= 0 ? overlayMap[index] || null : null;
  }, [overlayMap, palette, selectedColorId]);

  return {
    selectedOverlay,
  };
}
