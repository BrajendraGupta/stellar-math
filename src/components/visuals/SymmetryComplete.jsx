import React from 'react'

/**
 * SymmetryComplete — shows half a figure with a mirror line; student identifies the complete shape.
 * halfPoints: array of [x,y] forming a polygon (relative to 0,0 center), in the left/top half only
 * axis: 'vertical' | 'horizontal'
 * size: canvas size
 */
export default function SymmetryComplete({ halfPoints = [], axis = 'vertical', color = 'var(--comet-cyan)', size = 200 }) {
  const cx = size / 2
  const cy = size / 2

  // Build left-half polygon path
  const toScreen = ([x, y]) => `${cx + x},${cy + y}`
  const halfPath = halfPoints.map(toScreen).join(' ')

  // Generate mirror reflection points
  const reflected = halfPoints.map(([x, y]) =>
    axis === 'vertical' ? [-x, y] : [x, -y]
  ).reverse()
  const reflectedPath = reflected.map(toScreen).join(' ')

  const fullPath = halfPath + ' ' + reflectedPath

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={4} y={4} width={size - 8} height={size - 8}
        rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Shown half (filled) */}
      <polygon points={halfPath}
        fill={color + '33'} stroke={color} strokeWidth={2} />

      {/* Mirror line */}
      {axis === 'vertical' ? (
        <line x1={cx} y1={12} x2={cx} y2={size - 12}
          stroke="var(--star-yellow)" strokeWidth={2} strokeDasharray="6 3" opacity={0.8} />
      ) : (
        <line x1={12} y1={cy} x2={size - 12} y2={cy}
          stroke="var(--star-yellow)" strokeWidth={2} strokeDasharray="6 3" opacity={0.8} />
      )}

      {/* Reflection half (dashed outline with ?) */}
      <polygon points={reflectedPath}
        fill="rgba(0,229,255,0.07)"
        stroke="var(--comet-cyan)" strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={cx + (axis === 'vertical' ? size * 0.2 : 0)}
            y={cy + (axis === 'horizontal' ? size * 0.2 : 0)}
        textAnchor="middle" dominantBaseline="central"
        fill="var(--comet-cyan)" fontSize={size * 0.1} fontWeight={900}>?</text>
    </svg>
  )
}
