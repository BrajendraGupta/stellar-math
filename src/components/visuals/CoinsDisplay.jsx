import React from 'react'

const COIN_PROPS = {
  penny:   { r: 16, color: '#b87333', label: '1¢',  textColor: '#fff8e1' },
  nickel:  { r: 18, color: '#a8a9ad', label: '5¢',  textColor: '#1a1a1a' },
  dime:    { r: 14, color: '#c0c0c0', label: '10¢', textColor: '#1a1a1a' },
  quarter: { r: 20, color: '#d4af37', label: '25¢', textColor: '#1a1a1a' },
}

export default function CoinsDisplay({ coins = [] }) {
  // Build flat list of coins to render (cap each type at 10, show +N for rest)
  const rendered = []
  const extras = []

  coins.forEach(({ type, count }) => {
    const props = COIN_PROPS[type]
    if (!props) return
    const show = Math.min(count, 10)
    const extra = count - show
    for (let i = 0; i < show; i++) rendered.push({ type, ...props })
    if (extra > 0) extras.push({ type, extra })
  })

  // Layout: wrap into rows of up to 8
  const perRow = 8
  const rows = []
  for (let i = 0; i < rendered.length; i += perRow) {
    rows.push(rendered.slice(i, i + perRow))
  }

  const rowH = 52
  const colW = 48
  const svgW = Math.min(rendered.length, perRow) * colW + 16
  const svgH = rows.length * rowH + 16 + (extras.length > 0 ? 24 : 0)

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
      {rows.map((row, ri) =>
        row.map((coin, ci) => {
          const cx = 8 + ci * colW + colW / 2
          const cy = 8 + ri * rowH + rowH / 2
          return (
            <g key={`${ri}-${ci}`}>
              {/* Shadow */}
              <circle cx={cx + 1} cy={cy + 2} r={coin.r}
                fill="rgba(0,0,0,0.4)" />
              {/* Coin body */}
              <circle cx={cx} cy={cy} r={coin.r}
                fill={coin.color}
                stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
              {/* Inner ring detail */}
              <circle cx={cx} cy={cy} r={coin.r * 0.78}
                fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              {/* Label */}
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                fill={coin.textColor} fontSize={coin.r * 0.6} fontWeight={800}>
                {coin.label}
              </text>
            </g>
          )
        })
      )}

      {/* Overflow labels */}
      {extras.map(({ type, extra }, i) => (
        <text key={type}
          x={svgW / 2}
          y={rows.length * rowH + 16 + i * 18}
          textAnchor="middle" fill="var(--text-muted)"
          fontSize={12}>
          +{extra} more {type}{extra > 1 ? 's' : ''}
        </text>
      ))}
    </svg>
  )
}
