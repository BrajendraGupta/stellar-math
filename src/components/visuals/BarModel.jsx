import React from 'react'

/**
 * BarModel — tape diagram for word problems.
 * question: 'find-total' | 'find-part'
 * hideIndex: which part index shows '?' (for find-part)
 */
export default function BarModel({ total, parts = [], question = 'find-total', hideIndex = null, width = 320 }) {
  const barH = 44
  const barY = 48
  const bracketH = 18
  const defaultColors = ['#00e5ff', '#7b1fa2', '#00e676', '#ff9800', '#e91e63']

  const totalW = width - 32
  const totalVal = parts.reduce((s, p) => s + p.value, 0) || total || 1

  // Compute segment widths — last segment fills remainder
  let usedW = 0
  const segments = parts.map((p, i) => {
    const isLast = i === parts.length - 1
    const segW = isLast
      ? totalW - usedW
      : Math.round((p.value / totalVal) * totalW)
    const x = 16 + usedW
    usedW += segW
    return { ...p, w: segW, x, color: p.color || defaultColors[i % defaultColors.length] }
  })

  const svgH = barY + barH + bracketH + 40

  return (
    <svg width={width} height={svgH} viewBox={`0 0 ${width} ${svgH}`} style={{ overflow: 'visible' }}>
      {/* Top bracket for find-total */}
      {question === 'find-total' && (
        <g>
          <line x1={16} y1={barY - 8} x2={16} y2={barY - bracketH}
            stroke="var(--star-yellow)" strokeWidth={2} />
          <line x1={16 + totalW} y1={barY - 8} x2={16 + totalW} y2={barY - bracketH}
            stroke="var(--star-yellow)" strokeWidth={2} />
          <line x1={16} y1={barY - bracketH} x2={16 + totalW} y2={barY - bracketH}
            stroke="var(--star-yellow)" strokeWidth={2} />
          <text x={16 + totalW / 2} y={barY - bracketH - 6}
            textAnchor="middle" fill="var(--star-yellow)"
            fontSize={14} fontWeight={900}>?</text>
        </g>
      )}

      {/* Total label above for find-part */}
      {question === 'find-part' && (
        <g>
          <line x1={16} y1={barY - 8} x2={16} y2={barY - bracketH}
            stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
          <line x1={16 + totalW} y1={barY - 8} x2={16 + totalW} y2={barY - bracketH}
            stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
          <line x1={16} y1={barY - bracketH} x2={16 + totalW} y2={barY - bracketH}
            stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
          <text x={16 + totalW / 2} y={barY - bracketH - 6}
            textAnchor="middle" fill="rgba(255,255,255,0.6)"
            fontSize={13} fontWeight={700}>{total}</text>
        </g>
      )}

      {/* Segments */}
      {segments.map((seg, i) => {
        const isHidden = question === 'find-part' && i === hideIndex
        return (
          <g key={i}>
            <rect x={seg.x} y={barY} width={seg.w} height={barH}
              fill={isHidden ? 'rgba(0,229,255,0.08)' : seg.color + '33'}
              stroke={isHidden ? 'var(--comet-cyan)' : seg.color}
              strokeWidth={isHidden ? 2 : 1.5}
              strokeDasharray={isHidden ? '5 3' : 'none'}
              rx={i === 0 ? 6 : 0}
              style={i === 0 ? { borderRadius: '6px 0 0 6px' } : {}} />
            {/* Value or ? */}
            <text x={seg.x + seg.w / 2} y={barY + barH / 2}
              textAnchor="middle" dominantBaseline="central"
              fill={isHidden ? 'var(--comet-cyan)' : 'white'}
              fontSize={isHidden ? 16 : 13} fontWeight={800}>
              {isHidden ? '?' : (seg.w > 24 ? seg.value : '')}
            </text>
            {/* Label below */}
            {seg.label && seg.w > 28 && (
              <text x={seg.x + seg.w / 2} y={barY + barH + 16}
                textAnchor="middle" fill="var(--text-muted)"
                fontSize={11} fontWeight={600}>{seg.label}</text>
            )}
          </g>
        )
      })}

      {/* Outer border */}
      <rect x={16} y={barY} width={totalW} height={barH}
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={6} />
    </svg>
  )
}
