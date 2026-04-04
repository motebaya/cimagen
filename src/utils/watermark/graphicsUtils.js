export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

export function fitText(
  context,
  text,
  fontFamily,
  weight,
  targetWidth,
  startSize,
) {
  let size = startSize;
  while (size > 10) {
    context.font = `${weight} ${size}px ${fontFamily}`;
    if (context.measureText(text).width <= targetWidth) {
      break;
    }
    size -= 1;
  }
  return size;
}

export function createSeed(text = "") {
  return [...text].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

export function noise(seed, x, y) {
  const value = Math.sin(seed * 12.9898 + x * 78.233 + y * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

export function drawStar(
  context,
  centerX,
  centerY,
  outerRadius,
  innerRadius,
  fill,
) {
  context.save();
  context.fillStyle = fill;
  context.beginPath();
  for (let index = 0; index < 10; index += 1) {
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.closePath();
  context.fill();
  context.restore();
}

export function createLinearGradient(context, x1, y1, x2, y2, colors) {
  const gradient = context.createLinearGradient(x1, y1, x2, y2);
  const lastIndex = Math.max(colors.length - 1, 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / lastIndex, color);
  });
  return gradient;
}

export function createRadialGradient(context, x, y, radius, stops) {
  const gradient = context.createRadialGradient(
    x,
    y,
    radius * 0.1,
    x,
    y,
    radius,
  );
  stops.forEach(([position, color]) => gradient.addColorStop(position, color));
  return gradient;
}
