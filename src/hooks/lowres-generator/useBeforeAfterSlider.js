import { useRef, useState } from "react";

export default function useBeforeAfterSlider(initialPosition = 50) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(initialPosition);

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect || !rect.width) {
      return;
    }

    const nextPosition = Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100),
    );

    setPosition(nextPosition);
  };

  return {
    containerRef,
    position,
    sliderHandlers: {
      onPointerDown: (event) => {
        draggingRef.current = true;
        updateFromClientX(event.clientX);
        event.currentTarget.setPointerCapture?.(event.pointerId);
      },
      onPointerMove: (event) => {
        if (!draggingRef.current) {
          return;
        }

        updateFromClientX(event.clientX);
      },
      onPointerUp: (event) => {
        draggingRef.current = false;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      },
      onPointerCancel: (event) => {
        draggingRef.current = false;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      },
    },
  };
}
