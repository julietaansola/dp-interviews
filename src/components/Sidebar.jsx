import { useMemo, useState } from 'react'
import { Database, Server, Star, ChevronRight, ChevronDown } from 'lucide-react'

const profileConfig = {
  'data-platform': { label: 'Data Platform', icon: Server, color: 'text-accent-blue' },
  'data-engineer': { label: 'Data Engineer', icon: Database, color: 'text-accent-purple' },
}

export default function Sidebar({ allQuestions, filteredQuestions, filters, updateFilter, favoritesCount }) {
  const categoryStats = useMemo(() => {
    const profiles = {}
    for (const q of allQuestions) {
      if (!profiles[q.profile]) profiles[q.profile] = {}
      if (!profiles[q.profile][q.category]) profiles[q.profile][q.category] = 0
      profiles[q.profile][q.category]++
    }
    return profiles
  }, [allQuestions])

  const [expandedProfiles, setExpandedProfiles] = useState({})

  const toggleExpand = (profileKey) => {
    setExpandedProfiles(prev => ({ ...prev, [profileKey]: !prev[profileKey] }))
  }

  const handleCategoryClick = (profile, category) => {
    if (filters.profile === profile && filters.category === category) {
      updateFilter('category', '')
      updateFilter('profile', '')
    } else {
      updateFilter('profile', profile)
      updateFilter('category', category)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">
          <span className="text-accent-green">DP</span>
          <span className="text-text-primary"> Interviews</span>
        </h1>
        <p className="text-xs text-text-muted mt-1">Banco de preguntas del equipo</p>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{allQuestions.length} preguntas</span>
          <span className="flex items-center gap-1">
            <Star size={11} className="text-medium" />
            {favoritesCount} favoritas
          </span>
        </div>
        {filters.profile || filters.category || filters.level || filters.technology || filters.difficulty || filters.search ? (
          <div className="text-xs text-accent-blue mt-1">
            {filteredQuestions.length} resultado{filteredQuestions.length !== 1 ? 's' : ''}
          </div>
        ) : null}
      </div>

      {/* Profile sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(profileConfig).map(([profileKey, config]) => {
          const Icon = config.icon
          const cats = categoryStats[profileKey] || {}
          const isActive = filters.profile === profileKey
          const isExpanded = expandedProfiles[profileKey]

          return (
            <div key={profileKey}>
              <button
                onClick={() => toggleExpand(profileKey)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm font-semibold transition-colors cursor-pointer ${
                  isActive ? config.color : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={15} />
                <span className="flex-1 text-left">{config.label}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-0.5 ml-1">
                  {Object.entries(cats).sort().map(([cat, count]) => {
                    const isCatActive = filters.profile === profileKey && filters.category === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(profileKey, cat)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                          isCatActive
                            ? 'bg-accent-blue/10 text-accent-blue font-medium'
                            : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="shrink-0 ml-2 text-text-muted/60">{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Level quick filters */}
      <div className="p-3 border-t border-border">
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Nivel</p>
        <div className="flex gap-1">
          {[
            { value: 'jr', label: 'Jr' },
            { value: 'ssr', label: 'Semi Sr' },
            { value: 'sr', label: 'Sr' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateFilter('level', filters.level === value ? '' : value)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                filters.level === value
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'bg-bg-card text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
