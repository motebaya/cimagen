import { useState, useEffect, useCallback } from 'react'

const MAX_HISTORY = 20

function getStorageKey(toolId) {
  return `imggen_history_${toolId}`
}

export function useEditHistory(toolId) {
  const [history, setHistory] = useState([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(toolId))
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [toolId])

  // Save a new entry
  const saveEntry = useCallback((state, previewDataUrl = null) => {
    setHistory(prev => {
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        timestamp: Date.now(),
        state,
        preview: previewDataUrl,
      }
      const next = [entry, ...prev].slice(0, MAX_HISTORY)

      try {
        localStorage.setItem(getStorageKey(toolId), JSON.stringify(next))
      } catch {
        // storage full, try removing oldest
        const trimmed = next.slice(0, 5)
        try {
          localStorage.setItem(getStorageKey(toolId), JSON.stringify(trimmed))
        } catch {
          // give up
        }
      }

      return next
    })
  }, [toolId])

  // Delete an entry
  const deleteEntry = useCallback((entryId) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== entryId)
      try {
        localStorage.setItem(getStorageKey(toolId), JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [toolId])

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(getStorageKey(toolId))
    } catch {
      // ignore
    }
  }, [toolId])

  return { history, saveEntry, deleteEntry, clearHistory }
}
