import React from 'react'
import { normalizeToPixel, formatDate } from './chartUtils.js'

/**
 * MasteryLineChart — mastery % over time for one topic.
 * data: [{ recordedAt: timestamp, mastery: number }]
 * color: CSS color string
 * topic: string label
 */
export default function MasteryLineChart({ data = [], color = 'var(--comet-cyan)', topic = '' }) {
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No history yet for {topic}</p>
      </div>
    )
  }

  const xFor = i => padL + normalizeToPixel(i, 0, Math.max(data.length - 1, 1), 0, chartW)
  const yFor = v => padT + chartH - normalizeToPixel(v, 0, 100, 0, chartH)

  const points = data.map((d, i) => `${xFor(i)},${yFor(d.mastery)}`).join(' ')
  const firstX = xFor(0), lastX = xFor(data.length - 1)
  const firstY = yFor(0), lastY = yFor(0) // bottom of chart
  const areaPoints = `${firstX},${padT + chartH} ${points} ${lastX},${padT + chartH}`

  const yTicks = [0, 25, 50, 75, 100]

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`mg-${topic}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid + Y ticks */}
      {yTicks.map(v => (
        <g key={v}>
          <text x={padL - 4} y={yFor(v)}
            textAnchor="end" dominantBaseline="central"
            fill="rgba(255,255,255,0.35)" fontSize={9}>{v}%</text>
          <line x1={padL} y1={yFor(v)} x2={padL + chartW} y2={yFor(v)}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </g>
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill={`url(#mg-${topic})`} />

      {/* Line */}
      {data.length > 1 && (
        <polyline points={points}
          fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Data points */}
      {data.map((d, i) => (
        <circle key={i} cx={xFor(i)} cy={yFor(d.mastery)} r={3.5}
          fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} />
      ))}

      {/* X axis labels — show first and last */}
      {data.length >= 1 && (
        <text x={xFor(0)} y={padT + chartH + 12}
          textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>
          {formatDate(new Date(data[0].recordedAt).toISOString().slice(0, 10))}
        </text>
      )}
      {data.length > 1 && (
        <text x={xFor(data.length - 1)} y={padT + chartH + 12}
          textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>
          {formatDate(new Date(data[data.length - 1].recordedAt).toISOString().slice(0, 10))}
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
