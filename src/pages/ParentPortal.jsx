import React, { useState, useEffect } from 'react'
import { useStore, BADGES } from '../store/index.js'
import { getAllProfiles, getFullProfile, getLast14DaysActivity, getStudentBadges } from '../db/index.js'
import { TOPIC_DISPLAY } from '../data/schema.js'

export default function ParentPortal() {
  const { exitPortal } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportProfileId, setReportProfileId] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    loadAllStudents()
  }, [])

  async function loadAllStudents() {
    setLoading(true)
    const profiles = await getAllProfiles()
    const summaries = await Promise.all(profiles.map(async p => {
      const full = await getFullProfile(p.id)
      const activity = await getLast14DaysActivity(p.id)
      return { ...full, activity }
    }))
    setStudents(summaries)
    if (profiles.length > 0) setReportProfileId(profiles[0].id)
    setLoading(false)
  }

  async function downloadReport(profileId) {
    setReportLoading(true)
    const full = await getFullProfile(profileId)
    const activity = await getLast14DaysActivity(profileId)
    const badgeList = await getStudentBadges(profileId)

    const report = {
      generatedAt: new Date().toISOString(),
      student: {
        name: full.profile?.name,
        grade: full.profile?.currentGrade,
        xp: full.profile?.xp,
        level: Math.floor((full.profile?.xp || 0) / 100) + 1,
        createdAt: full.profile?.createdAt,
      },
      mastery: full.masteryRecords.map(r => ({
        grade: r.grade,
        topic: r.topic,
        mastery: r.mastery,
        lastUpdated: r.updatedAt,
      })),
      badges: badgeList.map(b => ({
        badge: BADGES[b.badgeId]?.name || b.badgeId,
        icon: BADGES[b.badgeId]?.icon || '',
        awardedAt: new Date(b.awardedAt).toISOString(),
      })),
      struggleZones: full.struggles.map(s => ({ grade: s.grade, topic: s.topic })),
      last14DaysActivity: activity,
      totalAttempts: full.attemptCount,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stellar-math-${full.profile?.name || 'student'}-report.json`
    a.click()
    URL.revokeObjectURL(url)
    setReportLoading(false)
  }

  async function printReport(profileId) {
    const full = await getFullProfile(profileId)
    const activity = await getLast14DaysActivity(profileId)
    const badgeList = await getStudentBadges(profileId)

    const name = full.profile?.name || 'Student'
    const grade = full.profile?.currentGrade
    const xp = full.profile?.xp || 0
    const level = Math.floor(xp / 100) + 1

    const masteryRows = full.masteryRecords.map(r =>
      `<tr><td>Grade ${r.grade}</td><td>${r.topic.replace(/-/g, ' ')}</td><td>${r.mastery}%</td></tr>`
    ).join('')

    const activityRows = activity.map(d =>
      `<tr><td>${d.date}</td><td>${d.xpEarned} XP</td><td>${d.goalMet ? '✓' : '—'}</td></tr>`
    ).join('')

    const badgeItems = badgeList.map(b =>
      `<span style="margin:4px;padding:4px 10px;border:1px solid #ccc;border-radius:12px;font-size:12px">${BADGES[b.badgeId]?.icon || ''} ${BADGES[b.badgeId]?.name || b.badgeId}</span>`
    ).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Stellar Math — ${name}</title>
        <style>
          body { font-family: sans-serif; color: #111; padding: 32px; max-width: 700px; margin: 0 auto; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          h2 { font-size: 16px; color: #555; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; background: #f5f5f5; padding: 6px 10px; }
          td { padding: 5px 10px; border-bottom: 1px solid #eee; }
          .badge-list { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
          .meta { font-size: 13px; color: #555; margin-top: 4px; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        <h1>🚀 Stellar Math — Progress Report</h1>
        <div class="meta">Student: <strong>${name}</strong> · Grade ${grade} · Level ${level} · ${xp} XP</div>
        <div class="meta">Generated: ${new Date().toLocaleDateString()}</div>

        <h2>Topic Mastery</h2>
        <table>
          <tr><th>Grade</th><th>Topic</th><th>Mastery</th></tr>
          ${masteryRows || '<tr><td colspan="3">No mastery data yet</td></tr>'}
        </table>

        <h2>Badges Earned</h2>
        <div class="badge-list">${badgeItems || 'No badges yet'}</div>

        <h2>Last 14 Days Activity</h2>
        <table>
          <tr><th>Date</th><th>XP Earned</th><th>Goal Met</th></tr>
          ${activityRows || '<tr><td colspan="3">No activity yet</td></tr>'}
        </table>

        <h2>Struggle Zones</h2>
        ${full.struggles.length > 0
          ? `<ul>${full.struggles.map(s => `<li>Grade ${s.grade} — ${s.topic.replace(/-/g, ' ')}</li>`).join('')}</ul>`
          : '<p>None — great work!</p>'}
      </body>
      </html>
    `

    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  return (
    <div className="fill flex-col" style={{ position: 'relative', zIndex: 1, overflow: 'auto', padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.8rem' }}>🎓</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', margin: 0 }}>
            Parent / Teacher Portal
          </h2>
        </div>
        <button className="btn btn-ghost" onClick={exitPortal} style={{ fontSize: '0.85rem' }}>
          ✕ Exit Portal
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'overview', label: '👥 Overview' },
          { key: 'report',   label: '📄 Reports'  },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 20px', borderRadius: 20,
              border: `1.5px solid ${activeTab === tab.key ? 'var(--comet-cyan)' : 'var(--glass-border)'}`,
              background: activeTab === tab.key ? 'rgba(0,229,255,0.1)' : 'var(--glass-bg)',
              color: activeTab === tab.key ? 'var(--comet-cyan)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="fill flex-center">
          <div style={{ fontSize: '2rem', animation: 'spin-slow 1.5s linear infinite' }}>⏳</div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {!loading && activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {students.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No student profiles found.</p>
          )}
          {students.map(({ profile: p, masteryRecords, badges, struggles, activity }) => {
            if (!p) return null
            const xp = p.xp || 0
            const level = Math.floor(xp / 100) + 1
            const todayXp = activity.find(d => d.date === new Date().toLocaleDateString('en-CA'))?.xpEarned || 0
            const earnedBadges = badges.slice(-3)
            const avgMastery = masteryRecords.length > 0
              ? Math.round(masteryRecords.reduce((s, r) => s + r.mastery, 0) / masteryRecords.length)
              : 0

            return (
              <div key={p.id} className="glass-card" style={{ padding: '20px 24px' }}>
                {/* Student header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--comet-cyan), var(--nebula-purple))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                  }}>{p.avatar || '🚀'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{p.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Grade {p.currentGrade} · Level {level} · ⭐ {xp} XP
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today</div>
                    <div style={{ fontWeight: 700, color: 'var(--star-yellow)' }}>{todayXp} XP</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                  <StatChip label="Avg Mastery" value={`${avgMastery}%`}
                    color={avgMastery >= 70 ? 'var(--planet-green)' : avgMastery >= 40 ? 'var(--star-yellow)' : 'var(--danger-red)'} />
                  <StatChip label="Topics" value={masteryRecords.length} color="var(--comet-cyan)" />
                  <StatChip label="Struggles" value={struggles.length}
                    color={struggles.length === 0 ? 'var(--planet-green)' : 'var(--danger-red)'} />
                  <StatChip label="Badges" value={badges.length} color="var(--star-yellow)" />
                </div>

                {/* Recent badges */}
                {earnedBadges.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recent:</span>
                    {earnedBadges.map(b => (
                      <span key={b.badgeId} title={BADGES[b.badgeId]?.name} style={{ fontSize: '1.3rem' }}>
                        {BADGES[b.badgeId]?.icon || '🏅'}
                      </span>
                    ))}
                  </div>
                )}

                {/* Struggle zones */}
                {struggles.length > 0 && (
                  <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--danger-red)', fontWeight: 700 }}>
                      ⚠️ Struggles: {struggles.map(s => `${s.topic} (Gr${s.grade})`).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* REPORT TAB */}
      {!loading && activeTab === 'report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', marginBottom: 16 }}>
              Generate Progress Report
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Select Student
              </label>
              <select
                value={reportProfileId || ''}
                onChange={e => setReportProfileId(Number(e.target.value))}
                style={{
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  borderRadius: 8, color: 'white', padding: '10px 14px',
                  fontSize: '0.95rem', cursor: 'pointer', width: '100%',
                }}>
                {students.map(({ profile: p }) => p && (
                  <option key={p.id} value={p.id} style={{ background: '#0a0e27' }}>
                    {p.avatar} {p.name} — Grade {p.currentGrade}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => reportProfileId && printReport(reportProfileId)}
                disabled={!reportProfileId}
                style={{ opacity: reportProfileId ? 1 : 0.5 }}>
                🖨️ Print / Save PDF
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => reportProfileId && downloadReport(reportProfileId)}
                disabled={!reportProfileId || reportLoading}
                style={{ opacity: reportProfileId ? 1 : 0.5 }}>
                {reportLoading ? '⏳ Preparing...' : '⬇️ Download JSON'}
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.5 }}>
              PDF: Opens a print-ready page — use your browser's Print dialog and select "Save as PDF".<br />
              JSON: Exports raw data including mastery, badges, 14-day activity, and struggle zones.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatChip({ label, value, color }) {
  return (
    <div style={{
      padding: '6px 12px', borderRadius: 20,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '0.95rem', fontWeight: 800, color }}>{value}</div>
    </div>
  )
}
