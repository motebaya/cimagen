import { useMemo, useState } from "react";
import {
  DEFAULT_HTML_TO_IMAGE_SETTINGS,
  HTML_SCREEN_PRESETS,
} from "../../utils/html-to-image/htmlConstants.js";
import {
  resolveViewportHeight,
  resolveViewportWidth,
} from "../../utils/html-to-image/htmlHelpers.js";

export default function useHtmlViewport() {
  const [widthPreset, setWidthPreset] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.widthPreset,
  );
  const [customWidth, setCustomWidth] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.customWidth,
  );
  const [heightPreset, setHeightPreset] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.heightPreset,
  );
  const [customHeight, setCustomHeight] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.customHeight,
  );

  const viewportWidth = useMemo(
    () => resolveViewportWidth(widthPreset, customWidth, HTML_SCREEN_PRESETS),
    [widthPreset, customWidth],
  );

  const viewportHeight = useMemo(
    () => resolveViewportHeight(heightPreset, customHeight),
    [heightPreset, customHeight],
  );

  return {
    widthPreset,
    customWidth,
    heightPreset,
    customHeight,
    viewportWidth,
    viewportHeight,
    setWidthPreset,
    setCustomWidth,
    setHeightPreset,
    setCustomHeight,
  };
}
