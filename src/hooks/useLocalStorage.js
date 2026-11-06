import { useState, useCallback } from 'react'

const FAVORITES_KEY = 'dp-interviews-favorites'
const USED_KEY = 'dp-interviews-used'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalStorage() {
  const [favorites, setFavorites] = useState(() => readJSON(FAVORITES_KEY, []))
  const [used, setUsed] = useState(() => readJSON(USED_KEY, {}))

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
      writeJSON(FAVORITES_KEY, next)
      return next
    })
  }, [])

  const markUsed = useCallback((id) => {
    setUsed(prev => {
      const next = { ...prev, [id]: Date.now() }
      writeJSON(USED_KEY, next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const getUsedDate = useCallback((id) => {
    const ts = used[id]
    return ts ? new Date(ts) : null
  }, [used])

  return { favorites, toggleFavorite, isFavorite, used, markUsed, getUsedDate }
}
