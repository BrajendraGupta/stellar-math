import React, { useState } from 'react'

/**
 * Interactive Number Line manipulative.
 * Shows a number line from `min` to `max` with optional jump arcs.
 * Students can tap numbers to place markers.
 *
 * Props:
 *  - min: start value (default 0)
 *  - max: end value (default 20)
 *  - step: tick increment (default 1)
 *  - jumps: array of { from, to, label?, color? } to show skip-counting arcs
 *  - highlight: number to highlight (e.g. the answer)
 */
export default function NumberLine({
  min = 0, max = 20, step = 1,
  jumps = [], highlight = null,
}) {
  const [tapped, setTapped] = useState(new Set())
  const width = 280
  const margin = 24
  const lineY = 50
  const range = max - min
  const ticks = []

  for (let v = min; v <= max; v += step) {
    ticks.push(v)
  }

  const xFor = (v) => margin + ((v - min) / range) * (width - margin * 2)

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={width} height={100} viewBox={`0 0 ${width} 100`}>
        {/* Main line */}
        <line x1={margin} y1={lineY} x2={width - margin} y2={lineY}
          stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

        {/* Arrow heads */}
        <polygon points={`${margin - 6},${lineY} ${margin},${lineY - 4} ${margin},${lineY + 4}`}
          fill="rgba(255,255,255,0.4)" />
        <polygon points={`${width - margin + 6},${lineY} ${width - margin},${lineY - 4} ${width - margin},${lineY + 4}`}
          fill="rgba(255,255,255,0.4)" />

        {/* Ticks and labels */}
        {ticks.map(v => {
          const x = xFor(v)
          const isHighlighted = v === highlight
          const isTapped = tapped.has(v)
          const isMajor = v % 5 === 0

          return (
            <g key={v} onClick={() => setTapped(prev => {
              const next = new Set(prev)
              next.has(v) ? next.delete(v) : next.add(v)
              return next
            })} style={{ cursor: 'pointer' }}>
              <line x1={x} y1={lineY - (isMajor ? 10 : 6)} x2={x} y2={lineY + (isMajor ? 10 : 6)}
                stroke={isHighlighted ? 'var(--star-yellow)' : isTapped ? 'var(--comet-cyan)' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isHighlighted ? 3 : isTapped ? 2.5 : 1.5} />
              <text x={x} y={lineY + 24} textAnchor="middle"
                fill={isHighlighted ? 'var(--star-yellow)' : isTapped ? 'var(--comet-cyan)' : 'rgba(255,255,255,0.5)'}
                fontSize={isHighlighted ? 12 : 9} fontWeight={isHighlighted || isTapped ? 800 : 400}>
                {v}
              </text>
              {(isHighlighted || isTapped) && (
                <circle cx={x} cy={lineY} r={5}
                  fill={isHighlighted ? 'var(--star-yellow)' : 'var(--comet-cyan)'}
                  style={{ filter: `drop-shadow(0 0 4px ${isHighlighted ? '#ffd700' : '#00e5ff'})` }} />
              )}
            </g>
          )
        })}

        {/* Skip-counting jump arcs */}
        {jumps.map((jump, i) => {
          const x1 = xFor(jump.from)
          const x2 = xFor(jump.to)
          const midX = (x1 + x2) / 2
          const arcH = 20 + (i % 2) * 8
          const color = jump.color || '#00e5ff'

          return (
            <g key={`jump-${i}`}>
              <path
                d={`M ${x1},${lineY - 6} Q ${midX},${lineY - arcH - 6} ${x2},${lineY - 6}`}
                fill="none" stroke={color} strokeWidth="2"
                strokeDasharray="4 2" opacity="0.7"
                style={{ animation: `slide-up ${0.2 + i * 0.1}s ease forwards` }}
              />
              <polygon points={`${x2 - 4},${lineY - 10} ${x2},${lineY - 5} ${x2 + 4},${lineY - 10}`}
                fill={color} opacity="0.7" />
              {jump.label && (
                <text x={midX} y={lineY - arcH - 10} textAnchor="middle"
                  fill={color} fontSize="9" fontWeight="700">
                  {jump.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
