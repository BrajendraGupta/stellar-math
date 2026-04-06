import React from 'react'

export default function ClockFace({ hours = 3, minutes = 0, size = 180 }) {
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 6

  const hourAngle   = ((hours % 12) + minutes / 60) / 12 * 2 * Math.PI - Math.PI / 2
  const minuteAngle = (minutes / 60) * 2 * Math.PI - Math.PI / 2

  const hourLen   = R * 0.52
  const minuteLen = R * 0.72

  const hx = cx + Math.cos(hourAngle) * hourLen
  const hy = cy + Math.sin(hourAngle) * hourLen
  const mx = cx + Math.cos(minuteAngle) * minuteLen
  const my = cy + Math.sin(minuteAngle) * minuteLen

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
    const inner = R * (i % 3 === 0 ? 0.78 : 0.85)
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * R,
      y2: cy + Math.sin(angle) * R,
      major: i % 3 === 0,
    }
  })

  const numLabels = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="clock-face-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>

      {/* Face */}
      <circle cx={cx} cy={cy} r={R} fill="url(#clock-face-bg)"
        stroke="rgba(255,255,255,0.2)" strokeWidth={2} />

      {/* Glow ring */}
      <circle cx={cx} cy={cy} r={R - 1} fill="none"
        stroke="var(--comet-cyan)" strokeWidth={0.5} opacity={0.3} />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.major ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
          strokeWidth={t.major ? 2 : 1} />
      ))}

      {/* Hour numbers */}
      {numLabels.map((n, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
        const labelR = R * 0.65
        return (
          <text key={n}
            x={cx + Math.cos(angle) * labelR}
            y={cy + Math.sin(angle) * labelR}
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,255,255,0.75)"
            fontSize={size * 0.072} fontWeight={600}>
            {n}
          </text>
        )
      })}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy}
        stroke="var(--star-yellow)" strokeWidth={size * 0.038}
        strokeLinecap="round" />

      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mx} y2={my}
        stroke="var(--comet-cyan)" strokeWidth={size * 0.022}
        strokeLinecap="round" />

      {/* Center cap */}
      <circle cx={cx} cy={cy} r={size * 0.04}
        fill="white" />
    </svg>
  )
}
