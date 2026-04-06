import React from 'react'

export default function CoordinatePlane({ points = [], highlightPoint = null, gridSize = 6, size = 240 }) {
  const margin = 32
  const plotSize = size - margin * 2

  const toPixel = (v, max) => margin + (v / max) * plotSize

  const gridLines = Array.from({ length: gridSize + 1 }, (_, i) => i)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid lines */}
      {gridLines.map(i => (
        <g key={i}>
          <line
            x1={toPixel(i, gridSize)} y1={margin}
            x2={toPixel(i, gridSize)} y2={margin + plotSize}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <line
            x1={margin} y1={toPixel(gridSize - i, gridSize)}
            x2={margin + plotSize} y2={toPixel(gridSize - i, gridSize)}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        </g>
      ))}

      {/* Axes */}
      <line x1={margin} y1={margin + plotSize} x2={margin + plotSize + 8} y2={margin + plotSize}
        stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      <line x1={margin} y1={margin + plotSize} x2={margin} y2={margin - 8}
        stroke="rgba(255,255,255,0.5)" strokeWidth={2} />

      {/* Arrow heads */}
      <polygon points={`${margin + plotSize + 8},${margin + plotSize - 4} ${margin + plotSize + 8},${margin + plotSize + 4} ${margin + plotSize + 14},${margin + plotSize}`}
        fill="rgba(255,255,255,0.5)" />
      <polygon points={`${margin - 4},${margin - 8} ${margin + 4},${margin - 8} ${margin},${margin - 14}`}
        fill="rgba(255,255,255,0.5)" />

      {/* Axis labels */}
      {gridLines.filter(i => i > 0).map(i => (
        <g key={i}>
          <text x={toPixel(i, gridSize)} y={margin + plotSize + 14}
            textAnchor="middle" fill="rgba(255,255,255,0.5)"
            fontSize={10} fontWeight={600}>{i}</text>
          <text x={margin - 12} y={toPixel(gridSize - i, gridSize)}
            textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.5)"
            fontSize={10} fontWeight={600}>{i}</text>
        </g>
      ))}
      <text x={margin} y={margin + plotSize + 14} textAnchor="middle"
        fill="rgba(255,255,255,0.3)" fontSize={10}>0</text>
      <text x={margin + plotSize + 14} y={margin + plotSize + 4}
        fill="rgba(255,255,255,0.5)" fontSize={12} fontWeight={700}>x</text>
      <text x={margin - 4} y={margin - 16}
        fill="rgba(255,255,255,0.5)" fontSize={12} fontWeight={700}>y</text>

      {/* Data points */}
      {points.map((p, i) => {
        const px = toPixel(p.x, gridSize)
        const py = toPixel(gridSize - p.y, gridSize)
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={5}
              fill="var(--comet-cyan)"
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            {p.label && (
              <text x={px + 8} y={py - 6}
                fill="var(--comet-cyan)" fontSize={11} fontWeight={700}>{p.label}</text>
            )}
          </g>
        )
      })}

      {/* Highlighted (unknown) point */}
      {highlightPoint && (
        <g>
          <circle cx={toPixel(highlightPoint.x, gridSize)} cy={toPixel(gridSize - highlightPoint.y, gridSize)} r={7}
            fill="rgba(0,229,255,0.15)"
            stroke="var(--comet-cyan)" strokeWidth={2} strokeDasharray="4 2">
            <animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text
            x={toPixel(highlightPoint.x, gridSize)}
            y={toPixel(gridSize - highlightPoint.y, gridSize)}
            textAnchor="middle" dominantBaseline="central"
            fill="var(--comet-cyan)" fontSize={11} fontWeight={900}>?</text>
        </g>
      )}
    </svg>
  )
}
