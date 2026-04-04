import { useMemo } from "react";
import { getTerminalThemeConfig } from "../../utils/image-to-ansi-art/index.js";

export default function useAnsiTerminalTheme(theme) {
  const terminalTheme = useMemo(() => getTerminalThemeConfig(theme), [theme]);

  return {
    terminalTheme,
  };
}
