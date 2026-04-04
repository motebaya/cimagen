import { useState } from "react";

export default function useAnsiPreviewMode(initialMode = "ansi") {
  const [previewMode, setPreviewMode] = useState(initialMode);

  return {
    previewMode,
    setPreviewMode,
  };
}
