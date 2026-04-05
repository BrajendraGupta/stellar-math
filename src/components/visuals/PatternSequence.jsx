import React from 'react'

/**
 * Visual pattern sequence — shows a repeating pattern of shapes/colors
 * with a missing element for the student to identify.
 */
const SHAPES = {
  circle: (x, y, size, fill) => (
    <circle cx={x + size/2} cy={y + size/2} r={size/2 - 2} fill={fill}
      stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  ),
  square: (x, y, size, fill) => (
    <rect x={x + 2} y={y + 2} width={size - 4} height={size - 4} rx={3} fill={fill}
      stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  ),
  triangle: (x, y, size, fill) => {
    const pts = `${x + size/2},${y + 3} ${x + size - 3},${y + size - 3} ${x + 3},${y + size - 3}`
    return <polygon points={pts} fill={fill} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  },
  star: (x, y, size, fill) => {
    const cx = x + size/2, cy = y + size/2, r = size/2 - 3
    const pts = Array.from({ length: 10 }, (_, i) => {
      const angle = (i * Math.PI / 5) - Math.PI / 2
      const rad = i % 2 === 0 ? r : r * 0.4
      return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`
    }).join(' ')
    return <polygon points={pts} fill={fill} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  },
  diamond: (x, y, size, fill) => {
    const cx = x + size/2, cy = y + size/2, r = size/2 - 3
    const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`
    return <polygon points={pts} fill={fill} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
  },
}

const COLORS = ['#ff6b6b', '#ffd700', '#00e5ff', '#69ff47', '#ff9ff3', '#ffb347']

export default function PatternSequence({ pattern, missingIndex, size = 50 }) {
  // pattern is array of { shape, colorIndex } objects
  const gap = 8
  const totalW = pattern.length * (size + gap)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={totalW} height={size + 20} viewBox={`0 0 ${totalW} ${size + 20}`}>
        {pattern.map((item, i) => {
          const x = i * (size + gap)
          const isMissing = i === missingIndex

          if (isMissing) {
            return (
              <g key={i}>
                <rect x={x + 2} y={12} width={size - 4} height={size - 4} rx={8}
                  fill="none" stroke="var(--star-yellow)" strokeWidth="2"
                  strokeDasharray="6 4"
                  style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                <text x={x + size/2} y={size/2 + 12} textAnchor="middle"
                  fill="var(--star-yellow)" fontSize="20" fontWeight="800">?</text>
              </g>
            )
          }

          const shapeFn = SHAPES[item.shape]
          const fill = COLORS[item.colorIndex % COLORS.length]
          return (
            <g key={i} style={{ animation: `slide-up ${0.1 + i * 0.05}s ease forwards` }}>
              {shapeFn(x, 10, size, fill)}
            </g>
          )
        })}
      </svg>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        What shape goes in the <span style={{ color: 'var(--star-yellow)' }}>?</span> spot?
      </div>
    </div>
  )
}
