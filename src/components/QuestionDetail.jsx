import { useState } from 'react'
import { Star, Clock, ChevronDown, ChevronUp, BookOpen, AlertTriangle, ExternalLink } from 'lucide-react'

const difficultyConfig = {
  easy: { label: 'Facil', color: 'text-easy' },
  medium: { label: 'Media', color: 'text-medium' },
  hard: { label: 'Dificil', color: 'text-hard' },
}

const levelLabels = { jr: 'Jr', ssr: 'Semi Sr', sr: 'Sr' }
const profileLabels = {
  'data-platform': 'Data Platform',
  'data-engineer': 'Data Engineer',
  'ai-engineer': 'AI Engineer',
  'mlops-engineer': 'MLOps Engineer',
}

export default function QuestionDetail({ question, isFavorite, usedDate, onToggleFavorite, onMarkUsed }) {
  const [showAnswer, setShowAnswer] = useState(false)

  if (!question) {
    return (
      <div className="flex items-center justify-center flex-1 text-text-muted text-sm">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>Selecciona una pregunta para ver el detalle</p>
        </div>
      </div>
    )
  }

  const diff = difficultyConfig[question.difficulty]

  return (
    <div className="p-6">
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="px-2 py-1 rounded text-xs font-medium bg-accent-blue/20 text-accent-blue">
          {profileLabels[question.profile]}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-accent-purple/20 text-accent-purple">
          {levelLabels[question.level]}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${diff.color}`}>
          {diff.label}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-text-primary mb-4 leading-relaxed">
        {question.question}
      </h2>

      {/* Technologies */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {question.technology.map(tech => (
          <span
            key={tech}
            className="px-2 py-1 rounded text-xs bg-bg-primary text-text-secondary border border-border"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Category */}
      <p className="text-xs text-text-muted mb-6">
        {question.category}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onToggleFavorite(question.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
            isFavorite
              ? 'border-medium/50 text-medium bg-medium/10'
              : 'border-border text-text-muted hover:text-text-secondary hover:border-border'
          }`}
        >
          <Star size={14} className={isFavorite ? 'fill-medium' : ''} />
          {isFavorite ? 'Favorita' : 'Favorito'}
        </button>

        <button
          onClick={() => onMarkUsed(question.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border text-text-muted hover:text-text-secondary hover:border-border transition-colors cursor-pointer"
        >
          <Clock size={14} />
          Marcar usada
        </button>

        {usedDate && (
          <span className="text-xs text-text-muted">
            Usada: {usedDate.toLocaleDateString('es-AR')}
          </span>
        )}
      </div>

      {/* Answer toggle */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-bg-card border border-border hover:bg-bg-hover transition-colors cursor-pointer mb-4"
      >
        <span className="text-sm font-medium text-accent-green">
          {showAnswer ? 'Ocultar respuesta' : 'Ver respuesta esperada'}
        </span>
        {showAnswer ? <ChevronUp size={16} className="text-accent-green" /> : <ChevronDown size={16} className="text-accent-green" />}
      </button>

      {/* Answer content */}
      {showAnswer && (
        <div className="space-y-4 mb-6 animate-in">
          {/* Expected answer */}
          <div className="p-4 rounded-lg bg-bg-card border border-border">
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
              {question.expected_answer}
            </p>
          </div>

          {/* Key points */}
          {question.key_points && question.key_points.length > 0 && (
            <div className="p-4 rounded-lg bg-accent-green/5 border border-accent-green/20">
              <h4 className="text-xs font-semibold text-accent-green uppercase tracking-wider mb-2">
                Puntos clave
              </h4>
              <ul className="space-y-1">
                {question.key_points.map((point, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent-green mt-1 shrink-0">-</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interviewer notes */}
          {question.interviewer_notes && (
            <div className="p-4 rounded-lg bg-accent-orange/5 border border-accent-orange/20">
              <h4 className="text-xs font-semibold text-accent-orange uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Notas del entrevistador
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {question.interviewer_notes}
              </p>
            </div>
          )}

          {/* Difficulty justification */}
          {question.difficulty_justification && (
            <p className="text-xs text-text-muted italic">
              Dificultad: {question.difficulty_justification}
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {question.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[11px] bg-bg-hover text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Source */}
      {question.source && (
        <div className="flex items-center gap-1.5 text-xs text-text-muted mt-4 pt-4 border-t border-border">
          <ExternalLink size={12} />
          <span>{question.source}</span>
        </div>
      )}
    </div>
  )
}
