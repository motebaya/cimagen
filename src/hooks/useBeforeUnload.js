import { useEffect, useCallback } from 'react'

export function useBeforeUnload(isDirty) {
  const handler = useCallback((e) => {
    if (!isDirty) return
    e.preventDefault()
    e.returnValue = ''
  }, [isDirty])

  useEffect(() => {
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [handler])
}
