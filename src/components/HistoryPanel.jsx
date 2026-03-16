import { useState } from 'react'
import { History, Trash2, RotateCcw, X, Clock } from 'lucide-react'

function formatTime(timestamp) {
  const d = new Date(timestamp)
  const now = new Date()
  const diff = now - d

  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function HistoryPanel({ history, onRestore, onDelete, onClear }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!history || history.length === 0) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors cursor-not-allowed opacity-40"
        style={{
          borderColor: 'var(--border-color)',
          color: 'var(--text-tertiary)',
          backgroundColor: 'transparent',
        }}
      >
        <History size={16} />
        History
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
          backgroundColor: isOpen ? 'var(--bg-tertiary)' : 'transparent',
        }}
      >
        <History size={16} />
        History
        <span
          className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'var(--color-primary-600)', color: '#fff' }}
        >
          {history.length}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border shadow-lg z-50"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--card-shadow-hover)',
            }}
          >
            <div
              className="sticky top-0 flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--card-bg)',
              }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Edit History
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { onClear(); setIsOpen(false) }}
                  className="p-1.5 rounded-md transition-colors cursor-pointer border-none"
                  style={{ color: 'var(--text-tertiary)', backgroundColor: 'transparent' }}
                  title="Clear all"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md transition-colors cursor-pointer border-none"
                  style={{ color: 'var(--text-tertiary)', backgroundColor: 'transparent' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="p-2">
              {history.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg mb-1 transition-colors group"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {entry.preview ? (
                    <img
                      src={entry.preview}
                      alt="Preview"
                      className="w-12 h-8 rounded object-cover border flex-shrink-0"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  ) : (
                    <div
                      className="w-12 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate m-0" style={{ color: 'var(--text-secondary)' }}>
                      {entry.state?.text || entry.state?.topText || entry.state?.imageFilename || entry.state?.filter || 'Untitled'}
                    </p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {formatTime(entry.timestamp)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { onRestore(entry); setIsOpen(false) }}
                      className="p-1.5 rounded-md transition-colors cursor-pointer border-none"
                      style={{ color: 'var(--color-primary-500)', backgroundColor: 'transparent' }}
                      title="Restore"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-1.5 rounded-md transition-colors cursor-pointer border-none"
                      style={{ color: '#ef4444', backgroundColor: 'transparent' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
