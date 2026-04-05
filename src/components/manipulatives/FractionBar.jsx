import React, { useState } from 'react'

/**
 * Interactive Fraction Bar manipulative.
 * Shows one or more horizontal bars divided into equal parts.
 * Students can tap segments to toggle them on/off.
 *
 * Props:
 *  - bars: array of { total, filled, color, label? }
 *     e.g. [{ total: 4, filled: 3, color: '#00e5ff', label: '3/4' }]
 *  - interactive: whether tapping toggles segments
 */
export default function FractionBar({
  bars = [{ total: 4, filled: 2, color: '#00e5ff' }],
  interactive = true,
}) {
  const barH = 40
  const barW = 260
  const gap = 16
  const totalH = bars.length * (barH + gap) + 8

  const [toggleState, setToggleState] = useState(() =>
    bars.map(b => Array.from({ length: b.total }, (_, i) => i < b.filled))
  )

  const handleToggle = (barIdx, segIdx) => {
    if (!interactive) return
    setToggleState(prev => {
      const next = prev.map(a => [...a])
      next[barIdx][segIdx] = !next[barIdx][segIdx]
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <svg width={barW + 40} height={totalH} viewBox={`0 0 ${barW + 40} ${totalH}`}>
        {bars.map((bar, bIdx) => {
          const y = bIdx * (barH + gap) + 4
          const segW = barW / bar.total
          const filledCount = toggleState[bIdx]?.filter(Boolean).length ?? bar.filled

          return (
            <g key={bIdx}>
              {/* Bar outline */}
              <rect x={20} y={y} width={barW} height={barH} rx={6}
                fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Segments */}
              {Array.from({ length: bar.total }, (_, s) => {
                const isFilled = toggleState[bIdx]?.[s] ?? s < bar.filled
                return (
                  <rect
                    key={s}
                    x={20 + s * segW + 1}
                    y={y + 1}
                    width={segW - 2}
                    height={barH - 2}
                    rx={s === 0 ? 5 : s === bar.total - 1 ? 5 : 0}
                    fill={isFilled ? bar.color : 'rgba(255,255,255,0.04)'}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    style={{
                      cursor: interactive ? 'pointer' : 'default',
                      transition: 'fill 0.2s ease',
                      filter: isFilled ? `drop-shadow(0 0 4px ${bar.color}40)` : 'none',
                    }}
                    onClick={() => handleToggle(bIdx, s)}
                  />
                )
              })}

              {/* Label */}
              <text x={barW + 28} y={y + barH / 2 + 5} textAnchor="start"
                fill={bar.color} fontSize="13" fontWeight="800">
                {bar.label || `${filledCount}/${bar.total}`}
              </text>
            </g>
          )
        })}
      </svg>

      {interactive && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Tap segments to toggle them on or off!
        </div>
      )}
    </div>
  )
}
