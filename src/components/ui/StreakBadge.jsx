import React from 'react'

/**
 * StreakBadge — flame icon + streak count + daily goal arc.
 * streak: number of consecutive days
 * goalPct: 0-100, how much of today's XP goal is done
 * size: 'sm' | 'md'
 */
export default function StreakBadge({ streak = 0, goalPct = 0, size = 'md' }) {
  const dim = size === 'sm' ? 48 : 64
  const cx = dim / 2
  const cy = dim / 2
  const arcR = dim * 0.44
  const strokeW = size === 'sm' ? 3 : 4
  const circumference = 2 * Math.PI * arcR
  const dashOffset = circumference * (1 - Math.min(goalPct, 100) / 100)
  const hot = streak >= 7

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Background arc track */}
        <circle cx={cx} cy={cy} r={arcR}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeW} />

        {/* Goal progress arc */}
        <circle cx={cx} cy={cy} r={arcR}
          fill="none"
          stroke={goalPct >= 100 ? 'var(--planet-green)' : 'var(--star-yellow)'}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />

        {/* Flame emoji / glow */}
        {hot && (
          <circle cx={cx} cy={cy} r={arcR * 0.65}
            fill="rgba(255,120,0,0.12)"
            style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
        )}

        {/* Flame icon */}
        <text x={cx} y={cy - 2}
          textAnchor="middle" dominantBaseline="central"
          fontSize={dim * 0.38}>
          🔥
        </text>
      </svg>

      {/* Streak count */}
      <div style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
        fontWeight: 800,
        color: hot ? '#ff9800' : 'var(--star-yellow)',
        letterSpacing: '0.04em',
      }}>
        {streak} {streak === 1 ? 'day' : 'days'}
      </div>

      {/* Goal label */}
      <div style={{
        fontSize: '0.65rem',
        color: goalPct >= 100 ? 'var(--planet-green)' : 'var(--text-muted)',
        fontWeight: 600,
      }}>
        {goalPct >= 100 ? '✓ Goal met!' : `${Math.round(goalPct)}% of daily goal`}
      </div>
    </div>
  )
}
