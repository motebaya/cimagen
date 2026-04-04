import AnsiEmptyState from "./AnsiEmptyState.jsx";

export default function AnsiTerminalViewport({
  ansiResult,
  imageSrc,
  onOpenImagePicker,
  previewMode,
  settings,
  terminalTheme,
}) {
  if (!imageSrc) {
    return <AnsiEmptyState onOpenImagePicker={onOpenImagePicker} />;
  }

  if (previewMode === "original") {
    return (
      <div className="flex items-center justify-center min-h-[520px] p-6">
        <img
          src={imageSrc}
          alt="Original reference"
          className="block max-w-full max-h-[520px] object-contain"
        />
      </div>
    );
  }

  return (
    <div className="max-h-[620px] overflow-auto px-5 py-5">
      <div
        className="min-w-fit font-mono"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
        }}
      >
        {ansiResult?.grid.map((row, rowIndex) => (
          <div key={`ansi-row-${rowIndex}`} className="flex items-start gap-4">
            <div
              className="w-10 text-right select-none sticky left-0 px-2 py-0.5"
              style={{
                color: terminalTheme.text,
                opacity: 0.4,
                backgroundColor: terminalTheme.background,
              }}
            >
              {rowIndex + 1}
            </div>

            <pre
              className="m-0"
              style={{
                color: terminalTheme.text,
                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
                whiteSpace: "pre",
              }}
            >
              {row.map((cell, cellIndex) => (
                <span
                  key={`ansi-cell-${rowIndex}-${cellIndex}`}
                  style={{
                    color: cell.foreground?.css || terminalTheme.text,
                    backgroundColor: cell.background?.css || "transparent",
                  }}
                >
                  {cell.char}
                </span>
              ))}
            </pre>
          </div>
        ))}

        <div className="flex items-center gap-4 mt-3">
          <div
            className="w-10 text-right select-none px-2 py-0.5"
            style={{ color: terminalTheme.text, opacity: 0.35 }}
          >
            {(ansiResult?.rows || 0) + 1}
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-md"
            style={{
              border: `1px solid ${terminalTheme.text}22`,
              color: terminalTheme.text,
              backgroundColor: `${terminalTheme.text}08`,
            }}
          >
            <span>ansi-preview$</span>
            <span
              style={{
                display: "inline-block",
                width: `${Math.max(8, settings.fontSize * 0.7)}px`,
                height: `${Math.max(14, settings.fontSize * 1.15)}px`,
                backgroundColor: terminalTheme.text,
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
