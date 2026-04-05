import React, { useState, useEffect, useRef, useCallback } from 'react'

const STAR_SIZE = 30
const STAR_GAP  = 5
const COLS_PER_GROUP = 4   // max stars per row within a group

// Build the initial flat list of positions for all stars
function buildPositions(groups, perGroup) {
  const cols = Math.min(perGroup, COLS_PER_GROUP)
  const positions = []
  for (let g = 0; g < groups; g++) {
    const gx = g * (cols * (STAR_SIZE + STAR_GAP) + STAR_GAP + 20) + 8
    for (let i = 0; i < perGroup; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      positions.push({
        x: gx + col * (STAR_SIZE + STAR_GAP),
        y: row * (STAR_SIZE + STAR_GAP) + 8,
        group: g,
      })
    }
  }
  return positions
}

// SVG star shape
function Star({ x, y, color, isDragging, onMouseDown }) {
  return (
    <svg
      width={STAR_SIZE} height={STAR_SIZE}
      style={{
        position: 'absolute',
        left: x, top: y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: isDragging ? 20 : 1,
        filter: isDragging
          ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}80)`
          : `drop-shadow(0 0 4px ${color}80)`,
        transform: isDragging ? 'scale(1.2)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.15s, filter 0.15s',
      }}
      onMouseDown={onMouseDown}
    >
      <polygon
        points="15,1 18.5,10 28,10 21,16 23.5,26 15,21 6.5,26 9,16 2,10 11.5,10"
        fill={color}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
      />
    </svg>
  )
}

const GROUP_COLORS = [
  '#ffd700', '#00e5ff', '#ff6b6b', '#69ff47',
  '#ff9ff3', '#ffb347', '#b4f8c8', '#a0c4ff',
]

export default function StarCubes({ groups = 3, perGroup = 4, interactive = true }) {
  const containerRef = useRef(null)
  const [positions, setPositions] = useState(() => buildPositions(groups, perGroup))
  const [dragging, setDragging] = useState(null) // { idx, offsetX, offsetY }

  // Re-init when props change (different question loaded)
  useEffect(() => {
    setPositions(buildPositions(groups, perGroup))
    setDragging(null)
  }, [groups, perGroup])

  // Document-level mouse tracking — only active while dragging
  useEffect(() => {
    if (!dragging || !interactive) return

    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPositions(prev =>
        prev.map((p, i) =>
          i === dragging.idx
            ? { ...p, x: e.clientX - rect.left - dragging.offsetX, y: e.clientY - rect.top - dragging.offsetY }
            : p
        )
      )
    }
    const onUp = () => setDragging(null)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',  onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',  onUp)
    }
  }, [dragging, interactive])

  const handleMouseDown = useCallback((idx, e) => {
    if (!interactive) return
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setDragging({
      idx,
      offsetX: e.clientX - rect.left - positions[idx].x,
      offsetY: e.clientY - rect.top  - positions[idx].y,
    })
  }, [interactive, positions])

  // Compute container dimensions
  const cols      = Math.min(perGroup, COLS_PER_GROUP)
  const groupW    = cols * (STAR_SIZE + STAR_GAP) + STAR_GAP + 20
  const groupH    = Math.ceil(perGroup / cols) * (STAR_SIZE + STAR_GAP) + 8
  const totalW    = groups * groupW + 8
  const totalH    = groupH + 28  // +28 for group label

  return (
    <div style={{ overflowX: 'auto', overflowY: 'visible', paddingBottom: 4 }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width:  totalW,
          height: totalH,
          minWidth: 120,
        }}
      >
        {/* Group bounding boxes */}
        {Array.from({ length: groups }, (_, g) => (
          <div key={`g-${g}`} style={{
            position: 'absolute',
            left:   g * groupW,
            top:    0,
            width:  groupW - STAR_GAP,
            height: groupH,
            border: `2px dashed ${GROUP_COLORS[g % GROUP_COLORS.length]}70`,
            borderRadius: 10,
            background: `${GROUP_COLORS[g % GROUP_COLORS.length]}0d`,
            pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute',
              bottom: -22, left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.68rem', fontWeight: 700,
              color: GROUP_COLORS[g % GROUP_COLORS.length],
              whiteSpace: 'nowrap',
            }}>
              Group {g + 1} ({perGroup})
            </span>
          </div>
        ))}

        {/* Stars */}
        {positions.map((p, i) => (
          <Star
            key={i}
            x={p.x}
            y={p.y}
            color={GROUP_COLORS[p.group % GROUP_COLORS.length]}
            isDragging={dragging?.idx === i}
            onMouseDown={(e) => handleMouseDown(i, e)}
          />
        ))}
      </div>
    </div>
  )
}
