import React from 'react'
import { renderShape } from './reasoningShapes.jsx'

/**
 * OddOneOut — 5 items in a row; student taps the odd one.
 * items: [{ shape, color, size, rotation, filled }]
 * onSelect: (index) => void  — called when student taps an item
 * selected: number | null    — currently tapped index
 * correct: number | null     — the correct oddIndex (shown after feedback)
 * feedbackState: null | 'correct' | 'wrong'
 */
export default function OddOneOut({ items = [], onSelect, selected = null, correct = null, feedbackState = null }) {
  const cellSize = 64
  const pad = 10
  const cols = items.length
  const svgW = cols * (cellSize + pad) + pad
  const svgH = cellSize + pad * 2

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ cursor: 'pointer' }}>
      {items.map((item, i) => {
        const x = pad + i * (cellSize + pad)
        const y = pad
        const isSelected = selected === i
        const isCorrect = feedbackState && correct === i
        const isWrong = feedbackState === 'wrong' && isSelected && correct !== i

        let borderColor = 'rgba(255,255,255,0.15)'
        let bg = 'rgba(255,255,255,0.04)'
        if (isCorrect) { borderColor = 'var(--planet-green)'; bg = 'rgba(0,230,118,0.1)' }
        else if (isWrong) { borderColor = 'var(--danger-red)'; bg = 'rgba(255,71,87,0.1)' }
        else if (isSelected) { borderColor = 'var(--comet-cyan)'; bg = 'rgba(0,229,255,0.08)' }

        return (
          <g key={i} onClick={() => !feedbackState && onSelect?.(i)}>
            <rect x={x} y={y} width={cellSize} height={cellSize}
              rx={10} fill={bg} stroke={borderColor} strokeWidth={isSelected || isCorrect || isWrong ? 2 : 1} />
            <g transform={`translate(${x + cellSize / 2}, ${y + cellSize / 2})`}>
              {renderShape(item, cellSize * 0.58)}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
