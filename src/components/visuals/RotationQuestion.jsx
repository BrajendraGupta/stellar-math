import React from 'react'
import { renderShape } from './reasoningShapes.js'

/**
 * RotationQuestion — shows a reference shape and asks which option is it rotated by N degrees.
 * reference: shape descriptor
 * rotationDeg: 90 | 180 | 270
 */
export default function RotationQuestion({ reference = {}, rotationDeg = 90, size = 200 }) {
  const cx = size / 2
  const shapeSize = size * 0.55

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background card */}
      <rect x={4} y={4} width={size - 8} height={size - 8}
        rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Reference shape */}
      <g transform={`translate(${cx}, ${cx})`}>
        {renderShape(reference, shapeSize)}
      </g>

      {/* Rotation indicator arc */}
      <path
        d={describeArc(cx, cx, size * 0.42, -30, rotationDeg - 30)}
        fill="none" stroke="var(--comet-cyan)" strokeWidth={2}
        strokeDasharray="4 3" opacity={0.6} />
      {/* Arrowhead at end of arc */}
      <ArrowHead cx={cx} cy={cx} r={size * 0.42} angleDeg={rotationDeg - 30} />

      {/* Label */}
      <text x={cx} y={size - 10} textAnchor="middle"
        fill="var(--comet-cyan)" fontSize={11} fontWeight={700}>
        Rotated {rotationDeg}°
      </text>
    </svg>
  )
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, endDeg)
  const end = polarToCartesian(cx, cy, r, startDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function polarToCartesian(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ArrowHead({ cx, cy, r, angleDeg }) {
  const rad = (angleDeg - 90 - 8) * Math.PI / 180
  const tip = { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  const a1 = { x: tip.x + 6 * Math.cos(rad + 2.4), y: tip.y + 6 * Math.sin(rad + 2.4) }
  const a2 = { x: tip.x + 6 * Math.cos(rad - 0.6), y: tip.y + 6 * Math.sin(rad - 0.6) }
  return <polygon points={`${tip.x},${tip.y} ${a1.x},${a1.y} ${a2.x},${a2.y}`}
    fill="var(--comet-cyan)" opacity={0.8} />
}
