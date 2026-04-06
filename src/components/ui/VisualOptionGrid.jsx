import React from 'react'
import { renderShape } from '../visuals/reasoningShapes.jsx'
import PatternMatrix from '../visuals/PatternMatrix.jsx'

/**
 * VisualOptionGrid — 2×2 grid of SVG thumbnail answer options for visual-reasoning questions.
 *
 * options: [{ key: 'A'|'B'|'C'|'D', visual_type, visual_config }]
 * onSelect: (key) => void
 * selected: key | null
 * feedbackState: null | 'correct' | 'wrong'
 * correctKey: the correct option key
 */
export default function VisualOptionGrid({ options = [], onSelect, selected = null, feedbackState = null, correctKey = null }) {
  const thumbSize = 90

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      width: '100%',
    }}>
      {options.map(opt => {
        const isSelected = selected === opt.key
        const isCorrect  = feedbackState && opt.key === correctKey
        const isWrong    = feedbackState === 'wrong' && isSelected && opt.key !== correctKey

        const borderColor = isCorrect ? 'var(--planet-green)'
          : isWrong    ? 'var(--danger-red)'
          : isSelected ? 'var(--comet-cyan)'
          : 'var(--glass-border)'

        const bg = isCorrect ? 'rgba(0,230,118,0.12)'
          : isWrong    ? 'rgba(255,71,87,0.1)'
          : isSelected ? 'rgba(0,229,255,0.08)'
          : 'var(--glass-bg)'

        return (
          <button
            key={opt.key}
            onClick={() => !feedbackState && onSelect?.(opt.key)}
            style={{
              background: bg,
              border: `2px solid ${borderColor}`,
              borderRadius: 14,
              padding: '10px 8px 6px',
              cursor: feedbackState ? 'default' : 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: isCorrect ? '0 0 16px rgba(0,230,118,0.3)'
                : isWrong ? '0 0 16px rgba(255,71,87,0.2)' : undefined,
            }}
          >
            {/* Option key badge */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: isCorrect ? 'var(--planet-green)'
                : isWrong ? 'var(--danger-red)'
                : isSelected ? 'var(--comet-cyan)'
                : 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 800, color: 'white',
              alignSelf: 'flex-start',
            }}>
              {isCorrect ? '✓' : isWrong ? '✕' : opt.key}
            </div>

            {/* Thumbnail visual */}
            <div style={{
              width: thumbSize, height: thumbSize,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <OptionThumbnail visual_type={opt.visual_type} visual_config={opt.visual_config} size={thumbSize} />
            </div>
          </button>
        )
      })}
    </div>
  )
}

function OptionThumbnail({ visual_type, visual_config = {}, size }) {
  if (!visual_type && visual_config?.shape) {
    // Single shape descriptor
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {renderShape(visual_config, size * 0.6)}
        </g>
      </svg>
    )
  }

  if (visual_type === 'pattern-matrix') {
    return <PatternMatrix grid={visual_config.grid} cellSize={Math.floor(size / (visual_config.grid?.[0]?.length || 2) - 4)} />
  }

  if (visual_type === 'shape') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {renderShape(visual_config, size * 0.6)}
        </g>
      </svg>
    )
  }

  if (visual_type === 'shapes-row') {
    const items = visual_config.items || []
    const cellW = size / items.length
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {items.map((item, i) => (
          <g key={i} transform={`translate(${cellW * i + cellW / 2}, ${size / 2})`}>
            {renderShape(item, cellW * 0.7)}
          </g>
        ))}
      </svg>
    )
  }

  // Fallback
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={4} y={4} width={size - 8} height={size - 8}
        rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        fill="rgba(255,255,255,0.4)" fontSize={11}>{visual_type || '?'}</text>
    </svg>
  )
}
