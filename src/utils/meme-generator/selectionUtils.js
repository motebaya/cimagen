function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}

export function findHitBound(bounds, stageX, stageY) {
  if (!bounds?.length) {
    return null;
  }

  return (
    [...bounds]
      .reverse()
      .find(
        (bound) =>
          stageX >= bound.x &&
          stageX <= bound.x + bound.width &&
          stageY >= bound.y &&
          stageY <= bound.y + bound.height,
      ) || null
  );
}

export function getDragPositionPatch(node, canvas) {
  const nextCenterX = node.x() + node.width() / 2;
  const nextCenterY = node.y() + node.height() / 2;

  return {
    x: clampUnit(nextCenterX / canvas.width),
    y: clampUnit(nextCenterY / canvas.height),
  };
}

export function getTransformPatch(node, selectedBound, layer, canvas) {
  const scaleX = Math.abs(node.scaleX());
  const scaleY = Math.abs(node.scaleY());
  const nextCenterX = node.x() + (selectedBound.width * scaleX) / 2;
  const nextCenterY = node.y() + (selectedBound.height * scaleY) / 2;

  return {
    scale: Math.max(0.15, (layer.scale || 1) * Math.max(scaleX, scaleY)),
    rotation: (layer.rotation || 0) + node.rotation(),
    x: clampUnit(nextCenterX / canvas.width),
    y: clampUnit(nextCenterY / canvas.height),
  };
}
