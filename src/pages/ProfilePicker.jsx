import React, { useState } from 'react'
import { useStore } from '../store/index.js'

const AVATARS = ['🚀', '👨‍🚀', '👩‍🚀', '👽', '👾', '🤖', '⭐', '🪐']

export default function ProfilePicker() {
  const { profiles, selectProfile, addProfile, removeProfile, isLoading } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [grade, setGrade] = useState(3)
  const [error, setError] = useState(null)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    try {
      await addProfile(name, avatar, grade)
      setShowAddForm(false)
      setName('')
    } catch (err) {
      console.error('handleAdd error:', err)
      setError('Failed to create profile. Your browser storage might be full or restricted.')
    }
  }

  if (isLoading) {
    return (
      <div className="fill flex-center flex-col gap-md" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3rem', animation: 'spin-slow 2s linear infinite' }}>🚀</div>
        <p style={{ color: 'var(--comet-cyan)', fontWeight: 700, letterSpacing: '0.1em' }}>
          INITIALIZING LAUNCH SEQUENCE...
        </p>
      </div>
    )
  }

  return (
    <div className="fill flex-center flex-col" style={{ padding: '20px', background: 'radial-gradient(circle at center, #1a2a6c 0%, #0a0e27 100%)' }}>
      <h1 style={{ 
        fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '40px',
        textShadow: '0 0 20px rgba(0,229,255,0.5)', letterSpacing: '0.1em'
      }}>
        CAPTAIN'S CHAIR
      </h1>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px', 
        maxWidth: '1000px', width: '100%' 
      }}>
        {profiles.map(p => (
          <div key={p.id} className="glass-card flex-col flex-center" style={{ 
            padding: '30px', cursor: 'pointer', position: 'relative',
            border: '2px solid rgba(0,229,255,0.3)',
            transition: 'transform 0.2s',
            height: '220px'
          }} onClick={() => selectProfile(p.id)}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{p.avatar}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{p.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--comet-cyan)', marginTop: '5px' }}>Grade {p.currentGrade}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); removeProfile(p.id); }}
              style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>
          </div>
        ))}

        {profiles.length < 8 && (
          <div className="glass-card flex-center" style={{ 
            padding: '30px', border: '2px dashed rgba(255,255,255,0.1)', cursor: 'pointer',
            height: '220px'
          }} onClick={() => !showAddForm && setShowAddForm(true)}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>Recruit Cadet</div>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(10,14,39,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form className="glass-card" style={{ padding: '40px', maxWidth: '400px', width: '90%' }} onSubmit={handleAdd}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>Recruit New Cadet</h2>
            
            {error && (
              <div style={{
                padding: '12px', background: 'rgba(255,71,87,0.1)',
                border: '1px solid var(--danger-red)', borderRadius: '8px',
                color: 'var(--danger-red)', fontSize: '0.85rem', marginBottom: '20px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>CADET NAME</label>
            <input 
              autoFocus
              value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', marginBottom: '20px' }}
            />

            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>SELECT AVATAR</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {AVATARS.map(a => (
                <div 
                  key={a} onClick={() => setAvatar(a)}
                  style={{ 
                    fontSize: '2rem', padding: '10px', cursor: 'pointer', textAlign: 'center',
                    background: avatar === a ? 'rgba(0,229,255,0.2)' : 'transparent',
                    borderRadius: '8px', border: avatar === a ? '1px solid var(--comet-cyan)' : '1px solid transparent'
                  }}
                >
                  {a}
                </div>
              ))}
            </div>

            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>GRADE LEVEL</label>
            <select 
              value={grade} onChange={e => setGrade(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', background: '#1a2a6c', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', marginBottom: '30px' }}
            >
              {[1,2,3,4,5].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Recruit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
