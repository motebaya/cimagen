import {
  BLUEARCHIVE_FONT_DECLARATION,
  BLUEARCHIVE_FONT_SIZE,
} from "./constants.js";

const BASE = import.meta.env.BASE_URL;
const FONT_STYLESHEETS = [
  `${BASE}fonts/bluearchive/RoGSans/font.css`,
  `${BASE}fonts/bluearchive/GlowSans/font.css`,
];

const stylesheetPromises = new Map();

function ensureStylesheet(href) {
  if (!stylesheetPromises.has(href)) {
    const promise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`link[data-font-href="${href}"]`);

      if (existing) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.fontHref = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load font stylesheet: ${href}`));
      document.head.appendChild(link);
    });

    stylesheetPromises.set(href, promise);
  }

  return stylesheetPromises.get(href);
}

export async function ensureBlueArchiveFonts(content = "BlueArchive") {
  await Promise.all(FONT_STYLESHEETS.map((href) => ensureStylesheet(href)));
  await document.fonts.load(BLUEARCHIVE_FONT_DECLARATION, content || "BlueArchive");
  await document.fonts.load(
    `${BLUEARCHIVE_FONT_SIZE}px "GlowSansSC-Normal-Heavy_diff"`,
    content || "BlueArchive",
  );
}
