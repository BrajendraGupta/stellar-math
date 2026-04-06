import React from 'react'
import { normalizeToPixel, formatDayAbbr } from './chartUtils.js'

/**
 * XPBarChart — 14-day XP bar chart with goal line.
 * data: [{ date: 'YYYY-MM-DD', xpEarned: number, goalMet: boolean }]
 * goalLine: number
 */
export default function XPBarChart({ data = [], goalLine = 50 }) {
  const W = 320
  const H = 160
  const padL = 32
  const padR = 8
  const padT = 16
  const padB = 36
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  if (data.length === 0) {
    return (
      <div style={{ width: W, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet — start a mission!</p>
      </div>
    )
  }

  const maxXP = Math.max(goalLine, ...data.map(d => d.xpEarned), 10)
  const barW = Math.floor(chartW / data.length) - 3

  const yFor = v => padT + chartH - normalizeToPixel(v, 0, maxXP, 0, chartH)
  const goalY = yFor(goalLine)

  // Y-axis ticks
  const yTicks = [0, Math.round(maxXP / 2), maxXP]

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {/* Y-axis ticks */}
      {yTicks.map(v => (
        <g key={v}>
          <text x={padL - 4} y={yFor(v)}
            textAnchor="end" dominantBaseline="central"
            fill="rgba(255,255,255,0.35)" fontSize={9}>{v}</text>
          <line x1={padL} y1={yFor(v)} x2={padL + chartW} y2={yFor(v)}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </g>
      ))}

      {/* Goal line */}
      <line x1={padL} y1={goalY} x2={padL + chartW} y2={goalY}
        stroke="var(--star-yellow)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />
      <text x={padL + chartW + 2} y={goalY}
        fill="var(--star-yellow)" fontSize={8} dominantBaseline="central">goal</text>

      {/* Bars */}
      {data.map((d, i) => {
        const x = padL + i * (chartW / data.length) + 2
        const barH = normalizeToPixel(d.xpEarned, 0, maxXP, 0, chartH)
        const y = padT + chartH - barH
        const color = d.goalMet ? 'var(--planet-green)' : 'var(--comet-cyan)'
        const show = i % 2 === 0 || data.length <= 7
        return (
          <g key={d.date}>
            <rect x={x} y={barH > 0 ? y : padT + chartH - 1}
              width={barW} height={Math.max(barH, 1)}
              rx={3}
              fill={color} opacity={0.85}
              style={{ transformOrigin: `${x}px ${padT + chartH}px`, animation: 'none' }} />
            {show && (
              <text x={x + barW / 2} y={padT + chartH + 12}
                textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8}>
                {formatDayAbbr(d.date)}
              </text>
            )}
          </g>
        )
      })}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
        stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH}
        stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
    </svg>
  )
}
