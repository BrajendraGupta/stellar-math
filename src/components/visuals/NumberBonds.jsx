import React from 'react'

/**
 * NumberBonds — shows two parts connecting to a total.
 * hidePart: 0 | 1 | 'total' — which value to show as "?"
 */
export default function NumberBonds({ total, parts = [0, 0], hidePart = 'total', size = 220 }) {
  const cx = size / 2
  const r = size * 0.13
  const topCy = size * 0.22
  const botCy = size * 0.78
  const leftCx = size * 0.22
  const rightCx = size * 0.78

  const hiddenStyle = { stroke: 'var(--comet-cyan)', strokeDasharray: '5 3', fill: 'rgba(0,229,255,0.07)' }
  const shownStyle  = { stroke: 'rgba(255,255,255,0.3)', strokeDasharray: 'none', fill: 'var(--glass-bg)' }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {/* Lines from total to parts */}
      <line x1={cx} y1={topCy + r} x2={leftCx} y2={botCy - r}
        stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      <line x1={cx} y1={topCy + r} x2={rightCx} y2={botCy - r}
        stroke="rgba(255,255,255,0.25)" strokeWidth={2} />

      {/* Total circle */}
      <circle cx={cx} cy={topCy} r={r}
        {...(hidePart === 'total' ? hiddenStyle : shownStyle)}
        strokeWidth={2} />
      <text x={cx} y={topCy} textAnchor="middle" dominantBaseline="central"
        fill={hidePart === 'total' ? 'var(--comet-cyan)' : 'white'}
        fontSize={r * 0.9} fontWeight={800}>
        {hidePart === 'total' ? '?' : total}
      </text>

      {/* Left part circle */}
      <circle cx={leftCx} cy={botCy} r={r}
        {...(hidePart === 0 ? hiddenStyle : shownStyle)}
        strokeWidth={2} />
      <text x={leftCx} y={botCy} textAnchor="middle" dominantBaseline="central"
        fill={hidePart === 0 ? 'var(--comet-cyan)' : 'white'}
        fontSize={r * 0.9} fontWeight={800}>
        {hidePart === 0 ? '?' : parts[0]}
      </text>

      {/* Right part circle */}
      <circle cx={rightCx} cy={botCy} r={r}
        {...(hidePart === 1 ? hiddenStyle : shownStyle)}
        strokeWidth={2} />
      <text x={rightCx} y={botCy} textAnchor="middle" dominantBaseline="central"
        fill={hidePart === 1 ? 'var(--comet-cyan)' : 'white'}
        fontSize={r * 0.9} fontWeight={800}>
        {hidePart === 1 ? '?' : parts[1]}
      </text>

      {/* Labels */}
      <text x={cx} y={topCy - r - 6} textAnchor="middle"
        fill="var(--text-muted)" fontSize={size * 0.055} fontWeight={600}>
        Total
      </text>
      <text x={leftCx} y={botCy + r + 14} textAnchor="middle"
        fill="var(--text-muted)" fontSize={size * 0.055} fontWeight={600}>
        Part
      </text>
      <text x={rightCx} y={botCy + r + 14} textAnchor="middle"
        fill="var(--text-muted)" fontSize={size * 0.055} fontWeight={600}>
        Part
      </text>
    </svg>
  )
}
