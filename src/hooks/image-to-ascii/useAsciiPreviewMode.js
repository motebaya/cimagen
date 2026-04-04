import { useState } from "react";

export default function useAsciiPreviewMode(initialMode = "ascii") {
  const [previewMode, setPreviewMode] = useState(initialMode);

  return {
    previewMode,
    setPreviewMode,
  };
}
