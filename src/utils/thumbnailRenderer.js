import { loadFont } from './fontLoader.js'

const BASE = import.meta.env.BASE_URL
const WIDTH = 800
const HEIGHT = 400
const TEXT_COLOR = '#94a3b8'
const FONT_SIZE = 48

/**
 * Wraps text to lines of approximately `maxWidth` characters.
 * Mimics Python's textwrap.wrap(text, width=22)
 */
function wrapText(text, maxChars = 22) {
  const words = text.split(/\s+/)
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word
    } else if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

/**
 * Renders the thumbnail on a canvas.
 * Port of createimg.py
 */
export async function renderThumbnail(canvas, text, bgColor) {
  await loadFont('SpaceGrotesk', `${BASE}fonts/SpaceGrotesk-Regular.ttf`)

  canvas.width = WIDTH
  canvas.height = HEIGHT

  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  if (!text || text.trim().length === 0) return

  // Set font
  ctx.font = `${FONT_SIZE}px SpaceGrotesk`
  ctx.fillStyle = TEXT_COLOR
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // Wrap text (match Python textwrap.wrap(text, width=22))
  const lines = wrapText(text, 22)

  // Measure total text height
  const lineHeight = FONT_SIZE * 1.25
  const totalHeight = lines.length * lineHeight

  // Center vertically
  let y = (HEIGHT - totalHeight) / 2

  // Draw each line centered
  for (const line of lines) {
    ctx.fillText(line, WIDTH / 2, y)
    y += lineHeight
  }
}

export { WIDTH, HEIGHT }
