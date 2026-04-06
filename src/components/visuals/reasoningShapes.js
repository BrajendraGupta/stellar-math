import React from 'react'

/**
 * Shared SVG shape renderer for reasoning components.
 * All shapes are centered at (0,0) and scaled to fit within `size`.
 *
 * descriptor: { shape, color, size?, rotation?, filled? }
 * shape: 'circle'|'square'|'triangle'|'star'|'diamond'|'pentagon'|'cross'|'arrow'
 */
export function renderShape(descriptor, size = 40) {
  if (!descriptor) return null
  const { shape = 'circle', color = 'var(--comet-cyan)', rotation = 0, filled = true } = descriptor
  const r = size / 2
  const fill = filled ? color : 'none'
  const stroke = color
  const sw = filled ? 0 : 2.5

  const transform = rotation ? `rotate(${rotation})` : undefined

  switch (shape) {
    case 'circle':
      return <circle r={r * 0.85} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />

    case 'square':
      return <rect x={-r * 0.8} y={-r * 0.8} width={r * 1.6} height={r * 1.6}
        fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />

    case 'triangle': {
      const h = r * 1.6
      const pts = `0,${-h * 0.6} ${h * 0.7},${h * 0.4} ${-h * 0.7},${h * 0.4}`
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />
    }

    case 'star': {
      const pts = starPoints(r * 0.9, r * 0.4, 5)
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />
    }

    case 'diamond':
      return <polygon
        points={`0,${-r * 0.95} ${r * 0.65},0 0,${r * 0.95} ${-r * 0.65},0`}
        fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />

    case 'pentagon': {
      const pts = polygonPoints(r * 0.9, 5, -Math.PI / 2)
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />
    }

    case 'hexagon': {
      const pts = polygonPoints(r * 0.9, 6, 0)
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />
    }

    case 'cross': {
      const t = r * 0.3
      const l = r * 0.85
      return (
        <g transform={transform}>
          <rect x={-t} y={-l} width={t * 2} height={l * 2} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={-l} y={-t} width={l * 2} height={t * 2} fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
      )
    }

    case 'arrow': {
      const pts = `0,${-r * 0.9} ${r * 0.6},0 ${r * 0.25},0 ${r * 0.25},${r * 0.9} ${-r * 0.25},${r * 0.9} ${-r * 0.25},0 ${-r * 0.6},0`
      return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} transform={transform} />
    }

    default:
      return <circle r={r * 0.85} fill={fill} stroke={stroke} strokeWidth={sw} />
  }
}

function starPoints(outer, inner, n) {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (i / (n * 2)) * 2 * Math.PI - Math.PI / 2
    pts.push(`${r * Math.cos(angle)},${r * Math.sin(angle)}`)
  }
  return pts.join(' ')
}

function polygonPoints(r, n, startAngle = 0) {
  return Array.from({ length: n }, (_, i) => {
    const angle = startAngle + (i / n) * 2 * Math.PI
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`
  }).join(' ')
}
