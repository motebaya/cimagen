import { useEffect, useRef } from "react";

export default function PdfThumbnailCanvas({ canvas, rotation, size = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const target = canvasRef.current;

    if (!target || !canvas) {
      return;
    }

    target.width = size;
    target.height = size;
    const context = target.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, size, size);
    context.save();
    context.translate(size / 2, size / 2);
    context.rotate((rotation * Math.PI) / 180);

    const sourceWidth = rotation % 180 === 0 ? canvas.width : canvas.height;
    const sourceHeight = rotation % 180 === 0 ? canvas.height : canvas.width;
    const scale = Math.min(size / sourceWidth, size / sourceHeight);
    const width = canvas.width * scale;
    const height = canvas.height * scale;

    context.drawImage(canvas, -width / 2, -height / 2, width, height);
    context.restore();
  }, [canvas, rotation, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded"
      style={{ border: "1px solid var(--border-color)" }}
    />
  );
}
