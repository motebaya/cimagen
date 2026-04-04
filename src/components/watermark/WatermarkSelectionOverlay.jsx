import { useEffect, useRef } from "react";
import {
  Image as KonvaImage,
  Layer,
  Line,
  Stage,
  Transformer,
} from "react-konva";

export default function WatermarkSelectionOverlay({
  width,
  height,
  selectedBound,
  selectedPreview,
  guides,
  visible,
  showGrid,
  onTransform,
  onBackgroundMouseDown,
}) {
  const imageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (
      visible &&
      selectedBound &&
      imageRef.current &&
      transformerRef.current
    ) {
      imageRef.current.x(selectedBound.x);
      imageRef.current.y(selectedBound.y);
      imageRef.current.width(selectedBound.width);
      imageRef.current.height(selectedBound.height);
      imageRef.current.rotation(0);
      imageRef.current.scaleX(1);
      imageRef.current.scaleY(1);
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedBound, visible, selectedPreview]);

  if (!width || !height) {
    return null;
  }

  return (
    <Stage
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-auto"
      onMouseDown={(event) => {
        const clickedOnEmpty = event.target === event.target.getStage();
        onBackgroundMouseDown({
          stageX: event.evt.offsetX,
          stageY: event.evt.offsetY,
          clickedOnEmpty,
        });
      }}
    >
      <Layer listening>
        {showGrid &&
          Array.from({ length: Math.floor(width / 32) }).map((_, index) => {
            const x = (index + 1) * 32;
            return (
              <Line
                key={`grid-v-${x}`}
                points={[x, 0, x, height]}
                stroke="rgba(148,163,184,0.22)"
                strokeWidth={1}
                listening={false}
              />
            );
          })}
        {showGrid &&
          Array.from({ length: Math.floor(height / 32) }).map((_, index) => {
            const y = (index + 1) * 32;
            return (
              <Line
                key={`grid-h-${y}`}
                points={[0, y, width, y]}
                stroke="rgba(148,163,184,0.22)"
                strokeWidth={1}
                listening={false}
              />
            );
          })}
        {guides?.vertical != null && (
          <Line
            points={[guides.vertical, 0, guides.vertical, height]}
            stroke="#5c7cfa"
            strokeWidth={1.5}
            dash={[6, 6]}
            listening={false}
          />
        )}
        {guides?.horizontal != null && (
          <Line
            points={[0, guides.horizontal, width, guides.horizontal]}
            stroke="#5c7cfa"
            strokeWidth={1.5}
            dash={[6, 6]}
            listening={false}
          />
        )}
        {visible && selectedBound && selectedPreview && (
          <>
            <KonvaImage
              ref={imageRef}
              x={selectedBound.x}
              y={selectedBound.y}
              width={selectedBound.width}
              height={selectedBound.height}
              image={selectedPreview}
              crop={{
                x: selectedBound.x,
                y: selectedBound.y,
                width: selectedBound.width,
                height: selectedBound.height,
              }}
              draggable
              onDragMove={(event) =>
                onTransform({ type: "dragMove", node: event.target })
              }
              onDragEnd={(event) =>
                onTransform({ type: "dragEnd", node: event.target })
              }
              onTransform={(event) =>
                onTransform({ type: "transform", node: event.target })
              }
              onTransformEnd={(event) =>
                onTransform({ type: "transformEnd", node: event.target })
              }
            />
            <Transformer
              ref={transformerRef}
              rotateEnabled
              borderStroke="#5c7cfa"
              borderStrokeWidth={2}
              anchorStroke="#ffffff"
              anchorFill="#ffffff"
              anchorSize={10}
              rotateAnchorOffset={22}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 12 || newBox.height < 12) {
                  return oldBox;
                }
                if (
                  newBox.width > width * 1.8 ||
                  newBox.height > height * 1.8
                ) {
                  return oldBox;
                }
                return newBox;
              }}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
                "top-center",
                "bottom-center",
              ]}
            />
          </>
        )}
      </Layer>
    </Stage>
  );
}
