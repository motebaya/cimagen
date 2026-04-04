const fontsLoaded = {};

const BASE = import.meta.env.BASE_URL;

/**
 * Loads a font using the FontFace API and adds it to the document.
 * Caches loaded fonts to prevent redundant loading.
 *
 * @param {string} name - Font family name to register
 * @param {string} url - URL path to the font file
 * @returns {Promise<FontFace>} Loaded FontFace object
 */
export async function loadFont(name, url) {
  if (fontsLoaded[name]) return fontsLoaded[name];

  const font = new FontFace(name, `url(${url})`);
  const loaded = await font.load();
  document.fonts.add(loaded);
  fontsLoaded[name] = loaded;
  return loaded;
}

/**
 * Preloads all commonly used fonts for the application.
 * Loads Space Grotesk and Helvetica LT Std fonts in parallel.
 *
 * @returns {Promise<void>} Resolves when all fonts are loaded
 */
export async function loadAllFonts() {
  await Promise.all([
    loadFont("SpaceGrotesk", `${BASE}fonts/SpaceGrotesk-Regular.ttf`),
    loadFont("HelveticaLTStd", `${BASE}fonts/HelveticaLTStd-Comp.otf`),
    loadFont("DMSansBrand", `${BASE}fonts/DMSans_18pt-SemiBold.ttf`),
    loadFont("DatatypeHero", `${BASE}fonts/Datatype_SemiExpanded-Bold.ttf`),
    loadFont("InkfreeBrand", `${BASE}fonts/Inkfree.ttf`),
  ]);
}
