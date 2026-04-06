import React from 'react'
import { renderShape } from './reasoningShapes.js'

/**
 * ReflectionQuestion — shows a shape beside a mirror line.
 * axis: 'vertical' | 'horizontal'
 * shape: shape descriptor
 */
export default function ReflectionQuestion({ shape = {}, axis = 'vertical', size = 200 }) {
  const cx = size / 2
  const cy = size / 2
  const shapeOffset = size * 0.28
  const shapeSize = size * 0.32

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={4} y={4} width={size - 8} height={size - 8}
        rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* Mirror line */}
      {axis === 'vertical' ? (
        <>
          <line x1={cx} y1={12} x2={cx} y2={size - 12}
            stroke="var(--star-yellow)" strokeWidth={2}
            strokeDasharray="6 3" opacity={0.8} />
          <text x={cx} y={10} textAnchor="middle"
            fill="var(--star-yellow)" fontSize={9} fontWeight={700}>mirror</text>
        </>
      ) : (
        <>
          <line x1={12} y1={cy} x2={size - 12} y2={cy}
            stroke="var(--star-yellow)" strokeWidth={2}
            strokeDasharray="6 3" opacity={0.8} />
          <text x={10} y={cy - 4}
            fill="var(--star-yellow)" fontSize={9} fontWeight={700}>mirror</text>
        </>
      )}

      {/* Original shape */}
      {axis === 'vertical' ? (
        <g transform={`translate(${cx - shapeOffset}, ${cy})`}>
          {renderShape(shape, shapeSize)}
        </g>
      ) : (
        <g transform={`translate(${cx}, ${cy - shapeOffset})`}>
          {renderShape(shape, shapeSize)}
        </g>
      )}

      {/* Question mark where reflection should be */}
      {axis === 'vertical' ? (
        <g transform={`translate(${cx + shapeOffset}, ${cy})`}>
          <circle r={shapeSize / 2} fill="rgba(0,229,255,0.07)"
            stroke="var(--comet-cyan)" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
            fill="var(--comet-cyan)" fontSize={shapeSize * 0.5} fontWeight={900}>?</text>
        </g>
      ) : (
        <g transform={`translate(${cx}, ${cy + shapeOffset})`}>
          <circle r={shapeSize / 2} fill="rgba(0,229,255,0.07)"
            stroke="var(--comet-cyan)" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
            fill="var(--comet-cyan)" fontSize={shapeSize * 0.5} fontWeight={900}>?</text>
        </g>
      )}
    </svg>
  )
}
