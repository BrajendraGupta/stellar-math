import React from 'react'

/**
 * Interactive array/grid of dots to visualize multiplication.
 * Shows `rows` × `cols` arrangement of colored dots.
 */
export default function ArrayDots({ rows = 3, cols = 4, color = '#ffd700', size = 200, hideAnswer = false }) {
  const dotR = Math.min(14, Math.floor(size / (Math.max(rows, cols) * 2.5)))
  const gapX = (size - 20) / cols
  const gapY = (size - 20) / rows
  const svgH = rows * gapY + 20

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`}>
        {/* Row labels */}
        {Array.from({ length: rows }, (_, r) => (
          <text
            key={`rl-${r}`}
            x={4} y={10 + r * gapY + dotR}
            fill="rgba(255,255,255,0.3)"
            fontSize="10" fontWeight="700"
          >{r + 1}</text>
        ))}
        {/* Column labels */}
        {Array.from({ length: cols }, (_, c) => (
          <text
            key={`cl-${c}`}
            x={20 + c * gapX + dotR / 2} y={svgH - 2}
            fill="rgba(255,255,255,0.3)"
            fontSize="10" fontWeight="700" textAnchor="middle"
          >{c + 1}</text>
        ))}
        {/* Dots */}
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={20 + c * gapX + dotR}
              cy={10 + r * gapY + dotR}
              r={dotR}
              fill={color}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
              style={{
                filter: `drop-shadow(0 0 4px ${color}60)`,
                animation: `slide-up ${0.1 + (r * cols + c) * 0.03}s ease forwards`,
              }}
            />
          ))
        )}
      </svg>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {rows} rows × {cols} columns {hideAnswer ? '= ?' : <>= <span style={{ color, fontWeight: 800 }}>{rows * cols}</span></>}
      </div>
    </div>
  )
}
