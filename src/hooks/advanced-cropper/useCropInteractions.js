import { useMemo, useRef } from "react";
import {
  getPinchZoomDelta,
  getTouchDistance,
  normalizeOffsetDelta,
} from "../../utils/advanced-cropper/cropMath.js";
import { WHEEL_ZOOM_STEP } from "../../utils/advanced-cropper/cropConstants.js";

export default function useCropInteractions({
  previewCanvasRef,
  previewInfo,
  adjustZoom,
  updateOffsets,
}) {
  const dragStateRef = useRef(null);
  const pinchStateRef = useRef(null);

  const applyDrag = (deltaX, deltaY) => {
    const rect = previewCanvasRef.current?.getBoundingClientRect();
    const nextOffset = normalizeOffsetDelta(deltaX, deltaY, rect);
    updateOffsets(nextOffset.offsetX, nextOffset.offsetY);
  };

  const clearInteraction = () => {
    dragStateRef.current = null;
    pinchStateRef.current = null;
  };

  const handlers = useMemo(
    () => ({
      onMouseDown: (event) => {
        if (!previewInfo) return;
        dragStateRef.current = { x: event.clientX, y: event.clientY };
      },
      onMouseMove: (event) => {
        if (!dragStateRef.current || !previewInfo) return;

        const deltaX = event.clientX - dragStateRef.current.x;
        const deltaY = event.clientY - dragStateRef.current.y;
        dragStateRef.current = { x: event.clientX, y: event.clientY };
        applyDrag(deltaX, deltaY);
      },
      onMouseUp: clearInteraction,
      onMouseLeave: clearInteraction,
      onWheel: (event) => {
        if (!previewInfo) return;

        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        const intensity = Math.min(
          1.4,
          Math.max(0.5, Math.abs(event.deltaY) / 120),
        );
        adjustZoom(direction * WHEEL_ZOOM_STEP * intensity);
      },
      onTouchStart: (event) => {
        if (!previewInfo) return;

        if (event.touches.length === 2) {
          pinchStateRef.current = {
            distance: getTouchDistance(event.touches),
          };
          dragStateRef.current = null;
          return;
        }

        if (event.touches.length === 1) {
          dragStateRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }
      },
      onTouchMove: (event) => {
        if (!previewInfo) return;

        if (event.touches.length === 2) {
          event.preventDefault();
          const nextDistance = getTouchDistance(event.touches);
          if (pinchStateRef.current?.distance) {
            adjustZoom(
              getPinchZoomDelta(nextDistance - pinchStateRef.current.distance),
            );
          }
          pinchStateRef.current = { distance: nextDistance };
          dragStateRef.current = null;
          return;
        }

        if (event.touches.length === 1 && dragStateRef.current) {
          event.preventDefault();
          const nextTouch = event.touches[0];
          const deltaX = nextTouch.clientX - dragStateRef.current.x;
          const deltaY = nextTouch.clientY - dragStateRef.current.y;
          dragStateRef.current = { x: nextTouch.clientX, y: nextTouch.clientY };
          applyDrag(deltaX, deltaY);
        }
      },
      onTouchEnd: (event) => {
        if (event.touches.length === 1) {
          dragStateRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
          pinchStateRef.current = null;
          return;
        }

        clearInteraction();
      },
    }),
    [adjustZoom, previewInfo, updateOffsets],
  );

  return handlers;
}
