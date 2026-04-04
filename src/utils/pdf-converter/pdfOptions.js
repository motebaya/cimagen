import { LAYOUT_MODES } from "../pdfConverter.js";

export const DEFAULT_PDF_SETTINGS = {
  backgroundColor: "white",
  filename: "",
  layout: LAYOUT_MODES.CONTAIN,
  margin: 10,
  orientation: "portrait",
  pageSize: "A4",
};

export const PAGE_SIZE_OPTIONS = [
  {
    value: "A4",
    label: "A4",
    description: "210 x 297 mm standard document format.",
  },
  {
    value: "LETTER",
    label: "Letter",
    description: "215.9 x 279.4 mm common US paper size.",
  },
];

export const ORIENTATION_OPTIONS = [
  {
    value: "portrait",
    label: "Portrait",
  },
  {
    value: "landscape",
    label: "Landscape",
  },
];

export const BACKGROUND_OPTIONS = [
  {
    value: "white",
    label: "White",
  },
  {
    value: "black",
    label: "Black",
  },
];

export const LAYOUT_OPTIONS = [
  {
    value: LAYOUT_MODES.CONTAIN,
    label: "Contain",
    description:
      "Fit each image within the page while preserving its full content.",
  },
  {
    value: LAYOUT_MODES.COVER,
    label: "Cover",
    description: "Fill the page more aggressively, even if some edges crop.",
  },
  {
    value: LAYOUT_MODES.ACTUAL,
    label: "Actual Size",
    description:
      "Keep each image near its original print size based on 96 DPI.",
  },
];
