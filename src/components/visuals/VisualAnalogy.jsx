import React from 'react'
import { renderShape } from './reasoningShapes.jsx'

/**
 * VisualAnalogy — "A is to B as C is to ?"
 * a, b, c: shape descriptors
 * size: cell size
 */
export default function VisualAnalogy({ a = {}, b = {}, c = {}, size = 70 }) {
  const pad = 8
  const colonW = 24
  const totalW = size * 4 + colonW * 2 + pad * 6
  const svgH = size + pad * 2

  const Cell = ({ shape, x }) => (
    <g>
      <rect x={x} y={pad} width={size} height={size}
        rx={8} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <g transform={`translate(${x + size / 2}, ${pad + size / 2})`}>
        {renderShape(shape, size * 0.58)}
      </g>
    </g>
  )

  const Colon = ({ x }) => (
    <text x={x} y={pad + size / 2} textAnchor="middle" dominantBaseline="central"
      fill="rgba(255,255,255,0.4)" fontSize={20} fontWeight={900}>:</text>
  )

  let xA = pad
  let xColon1 = xA + size + pad
  let xB = xColon1 + colonW
  let xColon2 = xB + size + pad
  let xColon3 = xColon2 + colonW
  let xC = xColon3
  let xColon4 = xC + size + pad
  let xQ = xColon4 + colonW

  return (
    <svg width={totalW} height={svgH} viewBox={`0 0 ${totalW} ${svgH}`} style={{ maxWidth: '100%' }}>
      <Cell shape={a} x={xA} />
      <Colon x={xColon1 + colonW / 2} />
      <Cell shape={b} x={xB} />

      {/* :: separator */}
      <text x={xColon2 + colonW / 2} y={pad + size / 2} textAnchor="middle" dominantBaseline="central"
        fill="rgba(255,255,255,0.4)" fontSize={20} fontWeight={900}>::</text>

      <Cell shape={c} x={xC} />
      <Colon x={xColon4 + colonW / 2} />

      {/* ? cell */}
      <rect x={xQ} y={pad} width={size} height={size}
        rx={8} fill="rgba(0,229,255,0.07)"
        stroke="var(--comet-cyan)" strokeWidth={2} strokeDasharray="5 3" />
      <text x={xQ + size / 2} y={pad + size / 2} textAnchor="middle" dominantBaseline="central"
        fill="var(--comet-cyan)" fontSize={size * 0.4} fontWeight={900}>?</text>
    </svg>
  )
}
