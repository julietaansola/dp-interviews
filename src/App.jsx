import { useState, useMemo, useRef, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useQuestions } from './hooks/useQuestions'
import { useLocalStorage } from './hooks/useLocalStorage'
import Sidebar from './components/Sidebar'
import FilterBar from './components/FilterBar'
import QuestionCard from './components/QuestionCard'
import QuestionDetail from './components/QuestionDetail'

function QuestionGrid({ questions, selectedId, isFavorite, getUsedDate, onSelect }) {
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted text-sm">
        <p>No se encontraron preguntas con los filtros actuales.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {questions.map(q => (
        <QuestionCard
          key={q.id}
          question={q}
          isSelected={q.id === selectedId}
          isFavorite={isFavorite(q.id)}
          usedDate={getUsedDate(q.id)}
          onClick={() => onSelect(q)}
        />
      ))}
    </div>
  )
}

function App() {
  const {
    allQuestions, filteredQuestions, loading, error,
    filters, updateFilter, clearFilters, activeFilterCount,
    technologies,
  } = useQuestions()

  const { favorites, toggleFavorite, isFavorite, markUsed, getUsedDate } = useLocalStorage()
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const detailRef = useRef(null)

  useEffect(() => {
    if (selectedQuestion && detailRef.current) {
      detailRef.current.scrollTo({ top: 0 })
    }
  }, [selectedQuestion])

  const displayQuestions = useMemo(() => {
    let qs = filteredQuestions
    if (filters.favoritesOnly) {
      qs = qs.filter(q => isFavorite(q.id))
    }
    return qs
  }, [filteredQuestions, filters.favoritesOnly, isFavorite])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-muted text-sm">Cargando preguntas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-accent-red text-sm">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-bg-card border border-border cursor-pointer"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-bg-secondary border-r border-border
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          allQuestions={allQuestions}
          filteredQuestions={displayQuestions}
          filters={filters}
          updateFilter={(key, val) => {
            updateFilter(key, val)
            setSidebarOpen(false)
          }}
          favoritesCount={favorites.length}
        />
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Filter bar */}
        <div className="p-4 border-b border-border">
          <FilterBar
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
            technologies={technologies}
          />
        </div>

        {/* Content area: grid + detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Question grid */}
          <div className={`flex-1 overflow-y-auto p-4 ${selectedQuestion ? 'hidden xl:block' : ''}`}>
            <QuestionGrid
              questions={displayQuestions}
              selectedId={selectedQuestion?.id}
              isFavorite={isFavorite}
              getUsedDate={getUsedDate}
              onSelect={setSelectedQuestion}
            />
          </div>

          {/* Detail panel */}
          <div
            ref={detailRef}
            className={`
            ${selectedQuestion ? 'flex' : 'hidden xl:flex'}
            w-full xl:w-[480px] xl:min-w-[480px]
            border-l border-border bg-bg-secondary flex-col overflow-y-auto
          `}>
            {/* Back button on mobile */}
            {selectedQuestion && (
              <button
                onClick={() => setSelectedQuestion(null)}
                className="xl:hidden p-3 border-b border-border text-sm text-accent-blue cursor-pointer text-left"
              >
                ← Volver a la lista
              </button>
            )}
            <QuestionDetail
              question={selectedQuestion}
              isFavorite={selectedQuestion ? isFavorite(selectedQuestion.id) : false}
              usedDate={selectedQuestion ? getUsedDate(selectedQuestion.id) : null}
              onToggleFavorite={toggleFavorite}
              onMarkUsed={markUsed}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
