import React, { useState, useEffect } from 'react'
import { useStore, BADGES } from '../store/index.js'
import { TOPIC_DISPLAY } from '../data/schema.js'
import { getLast14DaysActivity, getMasteryHistory, getSessionAccuracyTrend } from '../db/index.js'
import XPBarChart from '../components/charts/XPBarChart.jsx'
import MasteryLineChart from '../components/charts/MasteryLineChart.jsx'
import AccuracyLineChart from '../components/charts/AccuracyLineChart.jsx'

export default function ProfileScreen() {
  const { profile, earnedBadges, masteryMap, navigate, studentId, dailyXpGoal } = useStore()
  const xp = profile?.xp || 0
  const level = Math.floor(xp / 100) + 1
  const xpToNext = 100 - (xp % 100)

  const earnedIds = new Set(earnedBadges.map(b => b.badgeId))

  // Chart data
  const [xpData, setXpData]           = useState([])
  const [accuracyData, setAccuracyData] = useState([])
  const [masteryHistoryMap, setMasteryHistoryMap] = useState({})
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [activeTab, setActiveTab] = useState('badges') // 'badges' | 'mastery' | 'charts'

  useEffect(() => {
    if (!studentId) return
    getLast14DaysActivity(studentId).then(setXpData)
    getSessionAccuracyTrend(studentId, 14).then(setAccuracyData)

    // Load history for all topics in masteryMap
    const keys = Object.keys(masteryMap)
    if (keys.length === 0) return
    Promise.all(
      keys.map(async key => {
        const [grade, ...topicParts] = key.split('-')
        const topic = topicParts.join('-')
        const history = await getMasteryHistory(studentId, Number(grade), topic)
        return { key, history }
      })
    ).then(results => {
      const map = {}
      results.forEach(({ key, history }) => { map[key] = history })
      setMasteryHistoryMap(map)
      if (!selectedTopic && keys.length > 0) setSelectedTopic(keys[0])
    })
  }, [studentId])

  const topicKeys = Object.keys(masteryMap)
  const selectedHistory = selectedTopic ? (masteryHistoryMap[selectedTopic] || []) : []
  const selectedTopicDisplay = selectedTopic
    ? TOPIC_DISPLAY[selectedTopic.split('-').slice(1).join('-')] || { name: selectedTopic, color: 'var(--comet-cyan)' }
    : null

  return (
    <div className="fill flex-col" style={{ position: 'relative', zIndex: 1, overflow: 'auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Back</button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>Flight Log</h2>
      </div>

      {/* Profile card */}
      <div className="glass-card" style={{
        padding: 24, marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,0,0,0))',
        borderColor: 'rgba(0,229,255,0.3)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--comet-cyan), var(--nebula-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0,
          boxShadow: '0 0 20px rgba(0,229,255,0.4)',
        }}>
          {profile?.avatar || '🚀'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
            Captain {profile?.name || 'Cadet'}
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Level {level} Space Explorer
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="xp-chip">⭐ {xp} XP</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                {xpToNext} XP to Level {level + 1}
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${(xp % 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'badges',  label: '🏅 Badges'  },
          { key: 'mastery', label: '📊 Mastery'  },
          { key: 'charts',  label: '📈 Charts'   },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px', borderRadius: 20,
              border: `1.5px solid ${activeTab === tab.key ? 'var(--comet-cyan)' : 'var(--glass-border)'}`,
              background: activeTab === tab.key ? 'rgba(0,229,255,0.1)' : 'var(--glass-bg)',
              color: activeTab === tab.key ? 'var(--comet-cyan)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* BADGES TAB */}
      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {Object.values(BADGES).map(badge => {
            const earned = earnedIds.has(badge.id)
            return (
              <div key={badge.id} className="tooltip-container">
                <div className="glass-card" style={{
                  padding: '16px 12px', textAlign: 'center',
                  opacity: earned ? 1 : 0.35,
                  border: earned ? '1px solid rgba(255,215,0,0.4)' : undefined,
                  background: earned ? 'rgba(255,215,0,0.06)' : undefined,
                  transition: 'all 0.3s', height: '100%',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6, filter: earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700,
                    color: earned ? 'var(--star-yellow)' : 'var(--text-muted)' }}>
                    {badge.name}
                  </div>
                  {!earned && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>🔒 Locked</div>
                  )}
                </div>
                <div className="tooltip-text">
                  <strong style={{ color: 'var(--star-yellow)', display: 'block', marginBottom: 4 }}>{badge.name}</strong>
                  {badge.desc}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MASTERY TAB */}
      {activeTab === 'mastery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topicKeys.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No mastery data yet — start a mission! 🚀</p>
          ) : (
            topicKeys.map(key => {
              const mastery = masteryMap[key]
              const [grade, ...topicParts] = key.split('-')
              const topic = topicParts.join('-')
              return (
                <div key={key} className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ minWidth: 140 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grade {grade}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>
                      {topic.replace(/-/g, ' ')}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${mastery}%` }} />
                    </div>
                  </div>
                  <div style={{ minWidth: 48, textAlign: 'right', fontWeight: 700,
                    color: mastery >= 80 ? 'var(--planet-green)' : mastery >= 50 ? 'var(--star-yellow)' : 'var(--danger-red)' }}>
                    {mastery}%
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* CHARTS TAB */}
      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* XP Bar Chart */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--comet-cyan)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              ⭐ XP Earned — Last 14 Days
            </div>
            <div style={{ overflowX: 'auto' }}>
              <XPBarChart data={xpData} goalLine={dailyXpGoal || 50} />
            </div>
          </div>

          {/* Accuracy Chart */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '0.8rem', color: '#ce93d8', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              🎯 Daily Accuracy
            </div>
            <div style={{ overflowX: 'auto' }}>
              <AccuracyLineChart data={accuracyData} />
            </div>
          </div>

          {/* Mastery History Chart */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--planet-green)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              📈 Mastery Over Time
            </div>
            {topicKeys.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No mastery history yet</p>
            ) : (
              <>
                <select
                  value={selectedTopic || ''}
                  onChange={e => setSelectedTopic(e.target.value)}
                  style={{
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    borderRadius: 8, color: 'white', padding: '6px 12px',
                    fontSize: '0.85rem', marginBottom: 12, cursor: 'pointer',
                  }}>
                  {topicKeys.map(key => {
                    const [grade, ...tp] = key.split('-')
                    return <option key={key} value={key} style={{ background: '#0a0e27' }}>
                      Grade {grade} — {tp.join('-').replace(/-/g, ' ')}
                    </option>
                  })}
                </select>
                <div style={{ overflowX: 'auto' }}>
                  <MasteryLineChart
                    data={selectedHistory}
                    color={selectedTopicDisplay?.color || 'var(--comet-cyan)'}
                    topic={selectedTopicDisplay?.name || selectedTopic}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
