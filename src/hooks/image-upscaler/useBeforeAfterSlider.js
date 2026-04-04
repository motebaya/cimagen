import { useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function useBeforeAfterSlider(initialPosition = 50) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(initialPosition);

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return;

    setPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  };

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    updateFromClientX(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  };

  const stopDragging = (event) => {
    draggingRef.current = false;
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
  };

  return {
    containerRef,
    position,
    sliderHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: stopDragging,
      onPointerCancel: stopDragging,
    },
  };
}
