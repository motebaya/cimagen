import AsciiEmptyState from "./AsciiEmptyState.jsx";

export default function AsciiTerminalViewport({
  asciiResult,
  backgroundValue,
  imageSrc,
  isDragging,
  onDrop,
  onOpenImagePicker,
  onDragOver,
  onDragLeave,
  previewMode,
  settings,
  textColor,
}) {
  const checkerboardStyle = {
    backgroundColor: "#f8fafc",
    backgroundImage:
      "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.12) 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };

  if (!imageSrc) {
    return (
      <AsciiEmptyState
        isDragging={isDragging}
        onDrop={onDrop}
        onOpenImagePicker={onOpenImagePicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      />
    );
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
    <div
      className="relative max-h-[620px] overflow-auto px-5 py-5"
      style={backgroundValue === "transparent" ? checkerboardStyle : undefined}
    >
      <div className="w-full flex justify-center">
        <pre
          className="m-0 inline-block"
          style={{
            color: textColor,
            fontFamily:
              '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            whiteSpace: "pre",
            backgroundColor:
              backgroundValue === "transparent"
                ? "transparent"
                : backgroundValue,
          }}
        >
          {asciiResult?.rows.map((row, rowIndex) => (
            <span key={`ascii-row-${rowIndex}`}>
              {[...row].map((character, columnIndex) => {
                const color = asciiResult.colorRows?.[rowIndex]?.[columnIndex];
                return (
                  <span
                    key={`ascii-char-${rowIndex}-${columnIndex}`}
                    style={
                      settings.colorful && color
                        ? {
                            color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
                          }
                        : undefined
                    }
                  >
                    {character}
                  </span>
                );
              })}
              {rowIndex < asciiResult.rows.length - 1 ? "\n" : ""}
            </span>
          ))}
        </pre>
      </div>

      {backgroundValue === "transparent" && (
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[11px] font-medium"
          style={{
            backgroundColor: "rgba(15,23,42,0.72)",
            color: "#ffffff",
          }}
        >
          Transparent background visible on checkerboard
        </div>
      )}
    </div>
  );
}
