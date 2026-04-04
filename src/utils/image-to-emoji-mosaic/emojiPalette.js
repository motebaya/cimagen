import { toColorMeta } from "./emojiHelpers.js";

const SHAPE_SET = [
  toColorMeta("⬛", [18, 18, 22], "shapes"),
  toColorMeta("⬜", [245, 245, 245], "shapes"),
  toColorMeta("🟥", [214, 55, 67], "shapes"),
  toColorMeta("🟧", [245, 132, 40], "shapes"),
  toColorMeta("🟨", [250, 214, 68], "shapes"),
  toColorMeta("🟩", [71, 177, 92], "shapes"),
  toColorMeta("🟦", [68, 134, 250], "shapes"),
  toColorMeta("🟪", [141, 93, 214], "shapes"),
  toColorMeta("🟫", [126, 86, 52], "shapes"),
  toColorMeta("⚫", [28, 28, 31], "shapes"),
  toColorMeta("⚪", [248, 248, 248], "shapes"),
  toColorMeta("🔴", [226, 64, 74], "shapes"),
  toColorMeta("🟠", [242, 141, 43], "shapes"),
  toColorMeta("🟡", [255, 211, 55], "shapes"),
  toColorMeta("🟢", [52, 168, 83], "shapes"),
  toColorMeta("🔵", [66, 133, 244], "shapes"),
  toColorMeta("🟣", [171, 71, 188], "shapes"),
  toColorMeta("🔶", [255, 167, 38], "symbols"),
  toColorMeta("🔷", [66, 165, 245], "symbols"),
];

const HEART_SET = [
  toColorMeta("❤️", [223, 38, 64], "hearts"),
  toColorMeta("🩷", [245, 138, 180], "hearts"),
  toColorMeta("🧡", [255, 152, 55], "hearts"),
  toColorMeta("💛", [255, 217, 66], "hearts"),
  toColorMeta("💚", [76, 175, 80], "hearts"),
  toColorMeta("🩵", [98, 192, 235], "hearts"),
  toColorMeta("💙", [63, 112, 214], "hearts"),
  toColorMeta("💜", [142, 68, 173], "hearts"),
  toColorMeta("🤍", [249, 249, 249], "hearts"),
  toColorMeta("🖤", [24, 24, 24], "hearts"),
];

const FACE_SET = [
  toColorMeta("😀", [246, 206, 70], "faces"),
  toColorMeta("😁", [247, 214, 88], "faces"),
  toColorMeta("😂", [247, 209, 75], "faces"),
  toColorMeta("😊", [247, 205, 101], "faces"),
  toColorMeta("😍", [246, 185, 93], "faces"),
  toColorMeta("😎", [232, 192, 72], "faces"),
  toColorMeta("🤔", [227, 184, 74], "faces"),
  toColorMeta("😴", [173, 150, 110], "faces"),
  toColorMeta("😭", [132, 170, 234], "faces"),
  toColorMeta("😡", [228, 102, 64], "faces"),
];

const NATURE_SET = [
  toColorMeta("🌿", [79, 164, 92], "nature"),
  toColorMeta("🍀", [78, 171, 72], "nature"),
  toColorMeta("🌲", [47, 97, 64], "nature"),
  toColorMeta("🌳", [68, 136, 69], "nature"),
  toColorMeta("🌵", [69, 140, 83], "nature"),
  toColorMeta("🌻", [236, 190, 59], "nature"),
  toColorMeta("🌼", [241, 205, 84], "nature"),
  toColorMeta("🌸", [240, 176, 201], "nature"),
  toColorMeta("🌊", [75, 155, 227], "nature"),
  toColorMeta("☁️", [225, 232, 240], "nature"),
  toColorMeta("🌙", [236, 220, 121], "nature"),
  toColorMeta("⭐", [255, 210, 66], "symbols"),
];

const FOOD_SET = [
  toColorMeta("🍎", [210, 62, 59], "food"),
  toColorMeta("🍊", [248, 148, 44], "food"),
  toColorMeta("🍋", [247, 220, 85], "food"),
  toColorMeta("🍐", [179, 205, 74], "food"),
  toColorMeta("🍇", [130, 90, 178], "food"),
  toColorMeta("🍓", [214, 58, 84], "food"),
  toColorMeta("🥝", [114, 165, 61], "food"),
  toColorMeta("🍔", [165, 103, 54], "food"),
  toColorMeta("🍕", [223, 112, 57], "food"),
  toColorMeta("☕", [111, 77, 57], "food"),
];

const SYMBOL_SET = [
  toColorMeta("✨", [251, 222, 103], "symbols"),
  toColorMeta("🔥", [240, 110, 50], "symbols"),
  toColorMeta("❄️", [181, 217, 246], "symbols"),
  toColorMeta("⚡", [255, 206, 61], "symbols"),
  toColorMeta("💧", [86, 176, 240], "symbols"),
  toColorMeta("🌈", [182, 115, 214], "symbols"),
  toColorMeta("☀️", [255, 210, 76], "symbols"),
  toColorMeta("🌑", [39, 40, 46], "symbols"),
  toColorMeta("🔺", [219, 77, 69], "symbols"),
  toColorMeta("🔻", [62, 130, 216], "symbols"),
];

export const EMOJI_PRESETS = {
  defaultMixed: [
    ...SHAPE_SET,
    ...HEART_SET.slice(0, 4),
    ...NATURE_SET.slice(0, 6),
    ...SYMBOL_SET.slice(0, 6),
  ],
  circlesSquares: SHAPE_SET,
  heartsCute: HEART_SET,
  faces: FACE_SET,
  nature: NATURE_SET,
  food: FOOD_SET,
  symbols: SYMBOL_SET,
};

export const EMOJI_PRESET_OPTIONS = [
  {
    value: "defaultMixed",
    label: "Default Mixed",
    description: "Balanced mix of shapes, hearts, nature, and symbols.",
  },
  {
    value: "circlesSquares",
    label: "Circles / Squares",
    description: "Geometric emoji blocks for cleaner structured mosaics.",
  },
  {
    value: "heartsCute",
    label: "Hearts / Cute",
    description: "Playful, colorful emoji palette with heart-heavy output.",
  },
  {
    value: "faces",
    label: "Faces",
    description: "Emoji faces for portrait-like playful mosaics.",
  },
  {
    value: "nature",
    label: "Nature",
    description: "Plants, sky, and natural color cues.",
  },
  {
    value: "food",
    label: "Food",
    description: "Warm, edible emoji palette with colorful tiles.",
  },
  {
    value: "symbols",
    label: "Symbols",
    description: "Effects and symbol-based mosaic styling.",
  },
  {
    value: "custom",
    label: "Custom Emoji Set",
    description: "Use your own emoji collection separated by spaces.",
  },
];

export function parseCustomEmojiSet(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  const tokens = trimmed.includes(" ")
    ? trimmed.split(/\s+/).filter(Boolean)
    : Array.from(trimmed).filter((character) => character.trim());

  const fallbackColors = [
    [239, 68, 68],
    [249, 115, 22],
    [234, 179, 8],
    [34, 197, 94],
    [59, 130, 246],
    [168, 85, 247],
    [17, 24, 39],
    [243, 244, 246],
  ];

  return tokens.map((emoji, index) =>
    toColorMeta(emoji, fallbackColors[index % fallbackColors.length], "custom"),
  );
}

export function getEmojiDataset(preset, customEmojiSet) {
  if (preset === "custom") {
    const customDataset = parseCustomEmojiSet(customEmojiSet);
    return customDataset.length ? customDataset : EMOJI_PRESETS.defaultMixed;
  }

  return EMOJI_PRESETS[preset] || EMOJI_PRESETS.defaultMixed;
}
