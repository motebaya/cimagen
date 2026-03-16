/**
 * Converts a canvas to a Blob in the specified format.
 * Supports PNG, JPG (JPEG), and WEBP.
 */
export function exportCanvasToBlob(canvas, format = 'png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element is required'))
      return
    }

    const mimeType = {
      png: 'image/png',
      jpg: 'image/jpeg',
      webp: 'image/webp',
    }[format] || 'image/png'

    const q = format === 'png' ? undefined : quality

    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error(`Failed to export as ${format.toUpperCase()}. The format may not be supported by your browser.`))
          }
        },
        mimeType,
        q
      )
    } catch (err) {
      reject(new Error(`Export failed: ${err.message}`))
    }
  })
}

/**
 * Triggers a browser download for a Blob with the given filename.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Delay revocation slightly to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Exports a canvas as a downloadable file.
 * Combines exportCanvasToBlob + downloadBlob.
 */
export async function downloadCanvas(canvas, filename, format = 'png', quality = 0.92) {
  const blob = await exportCanvasToBlob(canvas, format, quality)
  const ext = format === 'jpg' ? 'jpg' : format
  const name = filename.replace(/\.[^.]+$/, '') + '.' + ext
  downloadBlob(blob, name)
  return blob
}
