import React from 'react'
import { normalizeToPixel, formatDate } from './chartUtils.js'

/**
 * AccuracyLineChart — daily accuracy % over time.
 * data: [{ date: 'YYYY-MM-DD', accuracyPct: number }]
 */
export default function AccuracyLineChart({ data = [] }) {
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No accuracy data yet</p>
      </div>
    )
  }

  const xFor = i => padL + normalizeToPixel(i, 0, Math.max(data.length - 1, 1), 0, chartW)
  const yFor = v => padT + chartH - normalizeToPixel(v, 0, 100, 0, chartH)

  const color = 'var(--nebula-purple)'
  const points = data.map((d, i) => `${xFor(i)},${yFor(d.accuracyPct)}`).join(' ')
  const areaPoints = `${xFor(0)},${padT + chartH} ${points} ${xFor(data.length - 1)},${padT + chartH}`

  const passY = yFor(60)
  const yTicks = [0, 25, 50, 75, 100]

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="acc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c2fa0" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#6c2fa0" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {yTicks.map(v => (
        <g key={v}>
          <text x={padL - 4} y={yFor(v)}
            textAnchor="end" dominantBaseline="central"
            fill="rgba(255,255,255,0.35)" fontSize={9}>{v}%</text>
          <line x1={padL} y1={yFor(v)} x2={padL + chartW} y2={yFor(v)}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </g>
      ))}

      {/* 60% pass threshold */}
      <line x1={padL} y1={passY} x2={padL + chartW} y2={passY}
        stroke="var(--danger-red)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
      <text x={padL + chartW + 2} y={passY}
        fill="var(--danger-red)" fontSize={8} dominantBaseline="central">60%</text>

      {/* Area */}
      <polygon points={areaPoints} fill="url(#acc-grad)" />

      {/* Line */}
      {data.length > 1 && (
        <polyline points={points}
          fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Points */}
      {data.map((d, i) => (
        <circle key={i} cx={xFor(i)} cy={yFor(d.accuracyPct)} r={3.5}
          fill={d.accuracyPct >= 60 ? 'var(--planet-green)' : 'var(--danger-red)'}
          stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} />
      ))}

      {/* X labels */}
      {data.length >= 1 && (
        <text x={xFor(0)} y={padT + chartH + 12}
          textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>
          {formatDate(data[0].date)}
        </text>
      )}
      {data.length > 1 && (
        <text x={xFor(data.length - 1)} y={padT + chartH + 12}
          textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>
          {formatDate(data[data.length - 1].date)}
        </text>
      )}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
        stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH}
        stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
    </svg>
  )
}
