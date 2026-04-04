import { useEffect, useState } from "react";

export default function usePaletteSelection(palette) {
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [copiedColorId, setCopiedColorId] = useState(null);

  useEffect(() => {
    if (!palette?.length) {
      setSelectedColorId(null);
      return;
    }

    if (
      !selectedColorId ||
      !palette.some((color) => color.id === selectedColorId)
    ) {
      setSelectedColorId(palette[0].id);
    }
  }, [palette, selectedColorId]);

  useEffect(() => {
    if (!copiedColorId) {
      return undefined;
    }

    const timeout = setTimeout(() => setCopiedColorId(null), 1400);
    return () => clearTimeout(timeout);
  }, [copiedColorId]);

  return {
    copiedColorId,
    selectedColorId,
    setCopiedColorId,
    setSelectedColorId,
  };
}
