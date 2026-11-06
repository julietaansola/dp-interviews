import { useState, useEffect, useMemo } from 'react'

const DATA_FILES = ['data-platform.json', 'data-engineer.json']

export function useQuestions() {
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    profile: '',
    category: '',
    level: '',
    technology: '',
    difficulty: '',
    search: '',
    favoritesOnly: false,
    hideUsedRecently: false,
  })

  useEffect(() => {
    async function fetchAll() {
      try {
        const base = import.meta.env.BASE_URL
        const results = await Promise.all(
          DATA_FILES.map(f =>
            fetch(`${base}data/${f}`).then(r => {
              if (!r.ok) throw new Error(`Failed to load ${f}`)
              return r.json()
            })
          )
        )
        const merged = results.flatMap(r => r.questions)
        setAllQuestions(merged)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const technologies = useMemo(() => {
    const set = new Set()
    allQuestions.forEach(q => q.technology.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [allQuestions])

  const categories = useMemo(() => {
    const set = new Set()
    allQuestions.forEach(q => set.add(q.category))
    return Array.from(set).sort()
  }, [allQuestions])

  const filteredQuestions = useMemo(() => {
    const searchLower = filters.search.toLowerCase()

    return allQuestions.filter(q => {
      if (filters.profile && q.profile !== filters.profile) return false
      if (filters.category && q.category !== filters.category) return false
      if (filters.level && q.level !== filters.level) return false
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false
      if (filters.technology && !q.technology.includes(filters.technology)) return false

      if (searchLower) {
        const haystack = [
          q.question,
          q.expected_answer,
          ...(q.tags || []),
          ...(q.key_points || []),
          q.category,
        ].join(' ').toLowerCase()
        if (!haystack.includes(searchLower)) return false
      }

      return true
    })
  }, [allQuestions, filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      profile: '',
      category: '',
      level: '',
      technology: '',
      difficulty: '',
      search: '',
      favoritesOnly: false,
      hideUsedRecently: false,
    })
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.profile) count++
    if (filters.category) count++
    if (filters.level) count++
    if (filters.technology) count++
    if (filters.difficulty) count++
    if (filters.search) count++
    return count
  }, [filters])

  return {
    allQuestions,
    filteredQuestions,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    technologies,
    categories,
  }
}
