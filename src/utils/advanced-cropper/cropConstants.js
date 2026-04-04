export const PREVIEW_MAX_WIDTH = 820;
export const PREVIEW_MAX_HEIGHT = 560;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.05;
export const WHEEL_ZOOM_STEP = 0.035;
export const PINCH_ZOOM_DIVISOR = 320;
export const PINCH_ZOOM_MAX_DELTA = 0.12;
export const OFFSET_SYNC_EPSILON = 0.0005;

export const EXPORT_FORMATS = [
  ["png", "PNG"],
  ["jpg", "JPG"],
  ["webp", "WEBP"],
];

export const CROP_SHAPE_OPTIONS = [
  ["rectangle", "Rectangle"],
  ["circle", "Circle"],
  ["triangle", "Triangle"],
  ["star", "Star"],
  ["polygon", "Polygon"],
  ["heart", "Heart"],
  ["full", "Full"],
];

export const DEFAULT_CROP_SETTINGS = {
  aspectKey: "square",
  shape: "rectangle",
  zoom: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  flipX: false,
  flipY: false,
  polygonSides: 6,
  showGrid: true,
  showSafeArea: false,
  transparentBackground: false,
  backgroundColor: "#ffffff",
  outputWidth: 1200,
  scaleMultiplier: 1,
};

export const CROP_ASPECT_PRESETS = [
  { key: "free", label: "Free", ratio: null, iconKey: "crop" },
  { key: "square", label: "Square", ratio: 1, iconKey: "square" },
  { key: "3:4", label: "3:4", ratio: 3 / 4, iconKey: "portrait" },
  { key: "3:2", label: "3:2", ratio: 3 / 2, iconKey: "landscape" },
  { key: "16:9", label: "16:9", ratio: 16 / 9, iconKey: "landscape" },
  {
    key: "instagram-square",
    label: "Instagram Square",
    ratio: 1,
    iconKey: "instagram",
  },
  {
    key: "instagram-portrait",
    label: "Instagram Portrait",
    ratio: 4 / 5,
    iconKey: "instagram",
  },
  {
    key: "instagram-story",
    label: "Instagram Story",
    ratio: 9 / 16,
    iconKey: "instagram",
  },
  {
    key: "facebook-post",
    label: "Facebook Post",
    ratio: 1.91,
    iconKey: "facebook",
  },
  {
    key: "facebook-cover",
    label: "Facebook Cover",
    ratio: 820 / 312,
    iconKey: "facebook",
  },
  {
    key: "pinterest-post",
    label: "Pinterest Post",
    ratio: 2 / 3,
    iconKey: "panel",
  },
  {
    key: "twitter-post",
    label: "Twitter Post",
    ratio: 16 / 9,
    iconKey: "twitter",
  },
  {
    key: "twitter-header",
    label: "Twitter Header",
    ratio: 3,
    iconKey: "twitter",
  },
  {
    key: "youtube-thumbnail",
    label: "YouTube Thumbnail",
    ratio: 16 / 9,
    iconKey: "youtube",
  },
  { key: "tiktok", label: "TikTok", ratio: 9 / 16, iconKey: "mobile" },
  { key: "ebay", label: "eBay", ratio: 1, iconKey: "shopping-bag" },
  { key: "shopify", label: "Shopify", ratio: 4 / 5, iconKey: "store" },
  { key: "amazon", label: "Amazon", ratio: 1, iconKey: "package" },
  { key: "shopee", label: "Shopee", ratio: 1, iconKey: "shopping-bag" },
  {
    key: "facebook-marketplace",
    label: "Facebook Marketplace",
    ratio: 1,
    iconKey: "facebook",
  },
  {
    key: "linkedin-header",
    label: "LinkedIn Header",
    ratio: 4,
    iconKey: "linkedin",
  },
  {
    key: "linkedin-square",
    label: "LinkedIn Square",
    ratio: 1,
    iconKey: "linkedin",
  },
];
