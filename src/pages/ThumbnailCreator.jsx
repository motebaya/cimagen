import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { renderThumbnail, WIDTH, HEIGHT } from '../utils/thumbnailRenderer.js'
import ExportControls from '../components/ExportControls.jsx'
import HistoryPanel from '../components/HistoryPanel.jsx'
import { useEditHistory } from '../hooks/useEditHistory.js'
import { useBeforeUnload } from '../hooks/useBeforeUnload.js'

const PRESET_COLORS = [
  { color: '#020617', label: 'Slate 950' },
  { color: '#0f172a', label: 'Slate 900' },
  { color: '#111827', label: 'Gray 900' },
  { color: '#1e1b4b', label: 'Indigo 950' },
  { color: '#1a1a2e', label: 'Navy' },
  { color: '#18181b', label: 'Zinc 900' },
  { color: '#0b132b', label: 'Oxford' },
]

export default function ThumbnailCreator() {
  const [text, setText] = useState('')
  const [bgColor, setBgColor] = useState(PRESET_COLORS[0].color)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState(null)

  const canvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const debounceRef = useRef(null)

  const { history, saveEntry, deleteEntry, clearHistory } = useEditHistory('thumbnail')

  useBeforeUnload(isDirty)

  // Live preview with debounce
  const updatePreview = useCallback(() => {
    if (!previewCanvasRef.current) return
    renderThumbnail(previewCanvasRef.current, text, bgColor).catch(console.error)
  }, [text, bgColor])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(updatePreview, 150)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [updatePreview])

  // Track dirty state
  useEffect(() => {
    if (text.trim().length > 0) {
      setIsDirty(true)
    }
  }, [text, bgColor])

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return
    setIsGenerating(true)
    setError(null)

    try {
      await renderThumbnail(canvasRef.current, text, bgColor)
      setHasGenerated(true)
      setIsDirty(false)

      // Save to history
      const previewDataUrl = canvasRef.current.toDataURL('image/webp', 0.3)
      saveEntry({ text, bgColor }, previewDataUrl)
    } catch (err) {
      console.error('Generation failed:', err)
      setError(err.message || 'Failed to generate thumbnail. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRestore = (entry) => {
    if (entry.state) {
      setText(entry.state.text || '')
      setBgColor(entry.state.bgColor || PRESET_COLORS[0].color)
      setError(null)
    }
  }

  const slugify = (str) => {
    return str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'thumbnail'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium no-underline transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-500)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onDelete={deleteEntry}
          onClear={clearHistory}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Thumbnail Generator
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Create thumbnail images with centered text and colored backgrounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
              }}
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Text input */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Title Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your title text..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none transition-colors focus:outline-none"
              style={{
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--color-primary-500)'
                e.target.style.boxShadow = '0 0 0 3px rgba(92, 124, 250, 0.15)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-color)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Background color */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Background Color
            </label>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map(preset => (
                <button
                  key={preset.color}
                  onClick={() => setBgColor(preset.color)}
                  className="w-9 h-9 rounded-lg border-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: preset.color,
                    borderColor: bgColor === preset.color ? 'var(--color-primary-500)' : 'var(--border-color)',
                    transform: bgColor === preset.color ? 'scale(1.1)' : 'scale(1)',
                  }}
                  title={preset.label}
                />
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
              <input
                type="text"
                value={bgColor}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                    setBgColor(val)
                  }
                }}
                className="w-28 px-3 py-2 rounded-lg border text-sm font-mono transition-colors focus:outline-none"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
            onMouseEnter={e => {
              if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--color-primary-700)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Create Thumbnail
              </>
            )}
          </button>

          {/* Export controls */}
          {hasGenerated && (
            <div
              className="pt-4 border-t animate-fade-in"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                Export
              </p>
              <ExportControls
                canvasRef={canvasRef}
                filename={slugify(text)}
                disabled={!hasGenerated}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
            Preview
          </p>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <canvas
              ref={previewCanvasRef}
              width={WIDTH}
              height={HEIGHT}
              className="w-full h-auto block"
              style={{ aspectRatio: `${WIDTH}/${HEIGHT}` }}
            />
          </div>

          {/* Hidden canvas for high-quality export */}
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="hidden"
          />

          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            Output: {WIDTH} x {HEIGHT}px
          </p>
        </div>
      </div>
    </div>
  )
}
