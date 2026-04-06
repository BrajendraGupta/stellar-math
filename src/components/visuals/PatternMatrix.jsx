import React from 'react'
import { renderShape } from './reasoningShapes.js'

/**
 * PatternMatrix — 2×2 or 3×3 grid with one cell replaced by "?"
 * grid: 2D array of shape descriptors or null (for the ? cell)
 * { shape, color, size, rotation }
 */
export default function PatternMatrix({ grid = [], cellSize = 80 }) {
  const rows = grid.length
  const cols = grid[0]?.length || 0
  const pad = 8
  const svgW = cols * (cellSize + pad) + pad
  const svgH = rows * (cellSize + pad) + pad

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      {grid.map((row, ri) =>
        row.map((cell, ci) => {
          const x = pad + ci * (cellSize + pad)
          const y = pad + ri * (cellSize + pad)
          const isMissing = cell === null || cell === '?'
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={cellSize} height={cellSize}
                rx={8}
                fill={isMissing ? 'rgba(0,229,255,0.07)' : 'rgba(255,255,255,0.05)'}
                stroke={isMissing ? 'var(--comet-cyan)' : 'rgba(255,255,255,0.15)'}
                strokeWidth={isMissing ? 2 : 1}
                strokeDasharray={isMissing ? '5 3' : 'none'} />
              {isMissing ? (
                <text x={x + cellSize / 2} y={y + cellSize / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fill="var(--comet-cyan)" fontSize={cellSize * 0.4} fontWeight={900}>?</text>
              ) : (
                <g transform={`translate(${x + cellSize / 2}, ${y + cellSize / 2})`}>
                  {renderShape(cell, cellSize * 0.55)}
                </g>
              )}
            </g>
          )
        })
      )}
    </svg>
  )
}
