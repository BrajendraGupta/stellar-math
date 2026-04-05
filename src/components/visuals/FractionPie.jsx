import React from 'react'

/**
 * Interactive SVG fraction pie chart.
 * Shows a circle divided into `total` slices with `filled` slices highlighted.
 */
export default function FractionPie({ total = 4, filled = 1, size = 180, color = '#00e5ff', hideLabel = false }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 8

  const slices = []
  for (let i = 0; i < total; i++) {
    const startAngle = (i / total) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = 1 / total > 0.5 ? 1 : 0

    const path = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
    const isFilled = i < filled

    slices.push(
      <path
        key={i}
        d={path}
        fill={isFilled ? color : 'rgba(255,255,255,0.06)'}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        style={{
          filter: isFilled ? `drop-shadow(0 0 6px ${color}60)` : 'none',
          transition: 'fill 0.3s ease',
        }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices}
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.4)" />
      </svg>
      {!hideLabel && (
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color }}>
          {filled}/{total}
        </div>
      )}
    </div>
  )
}
