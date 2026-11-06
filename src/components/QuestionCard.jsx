import { Star, Clock } from 'lucide-react'

const difficultyConfig = {
  easy: { label: 'Facil', color: 'bg-easy/20 text-easy' },
  medium: { label: 'Media', color: 'bg-medium/20 text-medium' },
  hard: { label: 'Dificil', color: 'bg-hard/20 text-hard' },
}

const levelLabels = { jr: 'Jr', ssr: 'Semi Sr', sr: 'Sr' }

export default function QuestionCard({ question, isSelected, isFavorite, usedDate, onClick }) {
  const diff = difficultyConfig[question.difficulty]

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'bg-accent-blue/5 border-accent-blue shadow-sm'
          : 'bg-bg-card border-border hover:bg-bg-hover shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${diff.color}`}>
            {diff.label}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-purple/20 text-accent-purple">
            {levelLabels[question.level]}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {usedDate && (
            <Clock size={14} className="text-text-muted" />
          )}
          {isFavorite && (
            <Star size={14} className="text-medium fill-medium" />
          )}
        </div>
      </div>

      <p className="text-sm text-text-primary line-clamp-3 mb-3 leading-relaxed">
        {question.question}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        {question.technology.slice(0, 3).map(tech => (
          <span
            key={tech}
            className="px-1.5 py-0.5 rounded text-[11px] bg-bg-primary text-text-muted border border-border"
          >
            {tech}
          </span>
        ))}
        {question.technology.length > 3 && (
          <span className="text-[11px] text-text-muted">
            +{question.technology.length - 3}
          </span>
        )}
      </div>
    </button>
  )
}
