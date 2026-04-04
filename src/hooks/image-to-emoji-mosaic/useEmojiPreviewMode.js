import { useState } from "react";

export default function useEmojiPreviewMode(initialMode = "mosaic") {
  const [previewMode, setPreviewMode] = useState(initialMode);

  return {
    previewMode,
    setPreviewMode,
  };
}
