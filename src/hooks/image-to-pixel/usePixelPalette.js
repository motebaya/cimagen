import { useState } from "react";

export default function usePixelPalette() {
  const [isExpanded, setIsExpanded] = useState(true);

  return {
    isExpanded,
    setIsExpanded,
    toggleExpanded: () => setIsExpanded((current) => !current),
  };
}
