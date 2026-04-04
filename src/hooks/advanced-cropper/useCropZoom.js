import { useCallback } from "react";
import { clampZoom } from "../../utils/advanced-cropper/cropMath.js";

export default function useCropZoom(setSettings) {
  const setZoom = useCallback(
    (nextValue) => {
      setSettings((current) => ({
        ...current,
        zoom: clampZoom(
          typeof nextValue === "function" ? nextValue(current.zoom) : nextValue,
        ),
      }));
    },
    [setSettings],
  );

  const adjustZoom = useCallback(
    (delta) => {
      setZoom((currentZoom) => currentZoom + delta);
    },
    [setZoom],
  );

  return {
    setZoom,
    adjustZoom,
  };
}
