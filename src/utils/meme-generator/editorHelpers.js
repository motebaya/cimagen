export const visuallyHiddenInputStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function drawCanvas(target, source) {
  if (!target || !source) return;

  const context = target.getContext("2d");
  target.width = source.width;
  target.height = source.height;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

export function createCustomTemplate(file, src) {
  return {
    id: "custom-template",
    title: file.name.replace(/\.[^.]+$/, ""),
    fileName: file.name,
    src,
  };
}

export function getLayerLabel(layer) {
  if (!layer) return "";
  if (layer.type === "image") {
    return layer.fileName || "Image layer";
  }
  if (layer.type === "sticker") {
    return layer.text || "Sticker";
  }
  return layer.text || "Text layer";
}

export function getRangeFields(layer) {
  if (!layer) return [];

  const common = [
    {
      key: "opacity",
      label: "Opacity",
      min: 0.1,
      max: 1,
      step: 0.01,
      format: (value) => `${Math.round(value * 100)}%`,
    },
    {
      key: "rotation",
      label: "Rotation",
      min: -180,
      max: 180,
      step: 1,
      format: (value) => `${Math.round(value)}deg`,
    },
  ];

  if (layer.type === "image") {
    return common;
  }

  if (layer.type === "sticker") {
    return [
      {
        key: "fontSize",
        label: "Size",
        min: 24,
        max: 220,
        step: 1,
        format: (value) => `${Math.round(value)} px`,
      },
      ...common,
    ];
  }

  return [
    {
      key: "fontSize",
      label: layer.autoSize ? "Base Size" : "Font Size",
      min: 20,
      max: 140,
      step: 1,
      format: (value) => `${Math.round(value)} px`,
    },
    {
      key: "strokeWidth",
      label: "Stroke Width",
      min: 0,
      max: 18,
      step: 1,
      format: (value) => `${Math.round(value)} px`,
    },
    {
      key: "letterSpacing",
      label: "Letter Spacing",
      min: -2,
      max: 8,
      step: 0.25,
      format: (value) => {
        const numeric = Number(value);
        return `${numeric.toFixed(Number.isInteger(numeric) ? 0 : 2)} px`;
      },
    },
    ...common,
  ];
}
