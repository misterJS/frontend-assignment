import { useCallback, useEffect, useRef } from 'react'

const STORAGE_AVAILABLE = typeof window !== 'undefined' && !!window.localStorage

const readDraft = <T,>(key: string): T | null => {
  if (!STORAGE_AVAILABLE) return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (error) {
    console.error('Failed to parse draft', error)
    return null
  }
}

const writeDraft = <T,>(key: string, value: T) => {
  if (!STORAGE_AVAILABLE) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save draft', error)
  }
}

const removeDraft = (key: string) => {
  if (!STORAGE_AVAILABLE) return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to clear draft', error)
  }
}

export const useDraft = <T extends Record<string, unknown>>(
  key: string,
  debounceMs = 2000,
) => {
  const timeoutRef = useRef<number | null>(null)
  const latestRef = useRef<T | null>(null)

  const save = useCallback(
    (partial: Partial<T>) => {
      if (!STORAGE_AVAILABLE) return
      const current = latestRef.current ?? readDraft<T>(key) ?? ({} as T)
      const next = { ...current, ...partial } as T
      latestRef.current = next

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        writeDraft(key, next)
        timeoutRef.current = null
      }, debounceMs)
    },
    [debounceMs, key],
  )

  const load = useCallback(() => {
    const stored = readDraft<T>(key)
    latestRef.current = stored
    return stored
  }, [key])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    latestRef.current = null
    removeDraft(key)
  }, [key])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    latestRef.current = readDraft<T>(key)
  }, [key])

  return { save, load, clear }
}

export default useDraft
