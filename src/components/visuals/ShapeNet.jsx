import React from 'react'

/**
 * ShapeNet — shows a 2D net (unfolded shape).
 * netType: 'cube' | 'triangular-prism' | 'pyramid'
 */
export default function ShapeNet({ netType = 'cube', size = 200 }) {
  const u = size / 6 // unit square size

  switch (netType) {
    case 'cube':
      return <CubeNet u={u} size={size} />
    case 'triangular-prism':
      return <PrismNet u={u} size={size} />
    case 'pyramid':
      return <PyramidNet u={u} size={size} />
    default:
      return <CubeNet u={u} size={size} />
  }
}

function FaceRect({ x, y, w, h, fill, stroke, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h}
        fill={fill || 'rgba(0,229,255,0.12)'}
        stroke={stroke || 'var(--comet-cyan)'} strokeWidth={1.5}
        strokeDasharray="none" />
      {label && (
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central"
          fill="rgba(255,255,255,0.5)" fontSize={Math.min(w, h) * 0.3} fontWeight={600}>
          {label}
        </text>
      )}
      {/* Fold lines */}
      <rect x={x} y={y} width={w} height={h}
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 2" />
    </g>
  )
}

function CubeNet({ u, size }) {
  // Classic cross net: top, then left-front-right-back row, then bottom
  const ox = size / 2 - u * 2
  const oy = size / 2 - u * 2
  const faces = ['top', 'L', 'front', 'R', 'back', 'bottom']
  const colors = ['rgba(0,229,255,0.18)', 'rgba(108,47,160,0.18)', 'rgba(0,230,118,0.18)',
                  'rgba(255,215,0,0.18)', 'rgba(255,71,87,0.18)', 'rgba(0,229,255,0.18)']
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <FaceRect x={ox + u} y={oy} w={u} h={u} fill={colors[0]} label="top" />
      <FaceRect x={ox} y={oy + u} w={u} h={u} fill={colors[1]} label="L" />
      <FaceRect x={ox + u} y={oy + u} w={u} h={u} fill={colors[2]} label="front" />
      <FaceRect x={ox + u * 2} y={oy + u} w={u} h={u} fill={colors[3]} label="R" />
      <FaceRect x={ox + u * 3} y={oy + u} w={u} h={u} fill={colors[4]} label="back" />
      <FaceRect x={ox + u} y={oy + u * 2} w={u} h={u} fill={colors[5]} label="bottom" />
    </svg>
  )
}

function PrismNet({ u, size }) {
  // 2 triangles + 3 rectangles
  const ox = size / 2 - u * 1.5
  const oy = size / 2 - u * 1.5
  const triH = u * 0.866

  const triPts = (tx, ty, flip = false) => {
    if (flip) return `${tx},${ty + triH} ${tx + u},${ty + triH} ${tx + u / 2},${ty}`
    return `${tx},${ty} ${tx + u},${ty} ${tx + u / 2},${ty + triH}`
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Three rectangles in a row */}
      {[0, 1, 2].map(i => (
        <FaceRect key={i} x={ox + i * u} y={oy} w={u} h={u}
          fill={['rgba(0,229,255,0.18)', 'rgba(0,230,118,0.18)', 'rgba(255,215,0,0.18)'][i]} />
      ))}
      {/* Triangle at top and bottom of middle rectangle */}
      <polygon points={triPts(ox + u, oy - triH)} fill="rgba(108,47,160,0.18)"
        stroke="var(--comet-cyan)" strokeWidth={1.5} />
      <polygon points={triPts(ox + u, oy + u, true)} fill="rgba(255,71,87,0.18)"
        stroke="var(--comet-cyan)" strokeWidth={1.5} />
    </svg>
  )
}

function PyramidNet({ u, size }) {
  // Square base + 4 triangles
  const ox = size / 2 - u * 1.5
  const oy = size / 2 - u * 1.5
  const triH = u * 0.9

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Square base */}
      <FaceRect x={ox + u} y={oy + u} w={u} h={u} fill="rgba(255,215,0,0.18)" label="base" />
      {/* Top triangle */}
      <polygon points={`${ox + u},${oy + u} ${ox + u * 2},${oy + u} ${ox + u * 1.5},${oy + u - triH}`}
        fill="rgba(0,229,255,0.18)" stroke="var(--comet-cyan)" strokeWidth={1.5} />
      {/* Bottom triangle */}
      <polygon points={`${ox + u},${oy + u * 2} ${ox + u * 2},${oy + u * 2} ${ox + u * 1.5},${oy + u * 2 + triH}`}
        fill="rgba(0,229,255,0.18)" stroke="var(--comet-cyan)" strokeWidth={1.5} />
      {/* Left triangle */}
      <polygon points={`${ox + u},${oy + u} ${ox + u},${oy + u * 2} ${ox + u - triH},${oy + u * 1.5}`}
        fill="rgba(0,229,255,0.18)" stroke="var(--comet-cyan)" strokeWidth={1.5} />
      {/* Right triangle */}
      <polygon points={`${ox + u * 2},${oy + u} ${ox + u * 2},${oy + u * 2} ${ox + u * 2 + triH},${oy + u * 1.5}`}
        fill="rgba(0,229,255,0.18)" stroke="var(--comet-cyan)" strokeWidth={1.5} />
    </svg>
  )
}
