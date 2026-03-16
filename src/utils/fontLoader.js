const fontsLoaded = {}

const BASE = import.meta.env.BASE_URL

export async function loadFont(name, url) {
  if (fontsLoaded[name]) return fontsLoaded[name]

  const font = new FontFace(name, `url(${url})`)
  const loaded = await font.load()
  document.fonts.add(loaded)
  fontsLoaded[name] = loaded
  return loaded
}

export async function loadAllFonts() {
  await Promise.all([
    loadFont('SpaceGrotesk', `${BASE}fonts/SpaceGrotesk-Regular.ttf`),
    loadFont('HelveticaLTStd', `${BASE}fonts/HelveticaLTStd-Comp.otf`),
  ])
}
