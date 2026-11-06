import { Search, X } from 'lucide-react'

const selectClass = 'bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-blue appearance-none cursor-pointer'

export default function FilterBar({ filters, updateFilter, clearFilters, activeFilterCount, technologies }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar en preguntas, respuestas, tags..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          className="w-full bg-bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={filters.profile}
          onChange={e => updateFilter('profile', e.target.value)}
          className={selectClass}
        >
          <option value="">Perfil</option>
          <option value="data-platform">Data Platform</option>
          <option value="data-engineer">Data Engineer</option>
          <option value="ai-engineer">AI Engineer</option>
          <option value="mlops-engineer">MLOps Engineer</option>
        </select>

        <select
          value={filters.level}
          onChange={e => updateFilter('level', e.target.value)}
          className={selectClass}
        >
          <option value="">Nivel</option>
          <option value="jr">Jr</option>
          <option value="ssr">Semi Sr</option>
          <option value="sr">Sr</option>
        </select>

        <select
          value={filters.technology}
          onChange={e => updateFilter('technology', e.target.value)}
          className={selectClass}
        >
          <option value="">Tecnologia</option>
          {technologies.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={filters.difficulty}
          onChange={e => updateFilter('difficulty', e.target.value)}
          className={selectClass}
        >
          <option value="">Dificultad</option>
          <option value="easy">Facil</option>
          <option value="medium">Media</option>
          <option value="hard">Dificil</option>
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-accent-red hover:bg-accent-red/10 transition-colors cursor-pointer"
          >
            <X size={14} />
            Limpiar ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  )
}
