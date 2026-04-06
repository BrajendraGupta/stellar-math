import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from '../store/index.js'
import { TOPIC_DISPLAY } from '../data/schema.js'
import { getNebulaQuestions } from '../data/questions/index.js'
import { speakText, stopSpeaking, isSpeaking } from '../audio/SoundManager.js'
import RocketShip from '../components/svg/RocketShip.jsx'
import AlienCopilot from '../components/svg/AlienCopilot.jsx'
import FractionPie from '../components/visuals/FractionPie.jsx'
import ArrayDots from '../components/visuals/ArrayDots.jsx'
import PatternSequence from '../components/visuals/PatternSequence.jsx'
import NumberLine from '../components/manipulatives/NumberLine.jsx'
import FractionBar from '../components/manipulatives/FractionBar.jsx'
import NumberBonds from '../components/visuals/NumberBonds.jsx'
import ClockFace from '../components/visuals/ClockFace.jsx'
import CoinsDisplay from '../components/visuals/CoinsDisplay.jsx'
import CoordinatePlane from '../components/visuals/CoordinatePlane.jsx'
import BarModel from '../components/visuals/BarModel.jsx'
import PatternMatrix from '../components/visuals/PatternMatrix.jsx'
import RotationQuestion from '../components/visuals/RotationQuestion.jsx'
import ReflectionQuestion from '../components/visuals/ReflectionQuestion.jsx'
import OddOneOut from '../components/visuals/OddOneOut.jsx'
import ShapeNet from '../components/visuals/ShapeNet.jsx'
import VisualAnalogy from '../components/visuals/VisualAnalogy.jsx'
import SymmetryComplete from '../components/visuals/SymmetryComplete.jsx'
import VisualOptionGrid from '../components/ui/VisualOptionGrid.jsx'

function ChoiceButton({ label, onClick, disabled, state }) {
  const bg =
    state === 'correct'  ? 'rgba(0,230,118,0.15)'  :
    state === 'wrong'    ? 'rgba(255,71,87,0.12)'   :
    state === 'selected' ? 'rgba(0,229,255,0.1)'    :
    'var(--glass-bg)'
  const border =
    state === 'correct'  ? '2px solid var(--planet-green)' :
    state === 'wrong'    ? '2px solid var(--danger-red)'   :
    state === 'selected' ? '2px solid var(--comet-cyan)'   :
    '2px solid var(--glass-border)'
  const shadow =
    state === 'correct'  ? '0 0 16px rgba(0,230,118,0.3)'  :
    state === 'wrong'    ? '0 0 16px rgba(255,71,87,0.2)'   :
    state === 'selected' ? '0 0 12px rgba(0,229,255,0.25)'  :
    undefined
  const dotBg =
    state === 'correct'  ? 'var(--planet-green)' :
    state === 'wrong'    ? 'var(--danger-red)'   :
    state === 'selected' ? 'var(--comet-cyan)'   :
    'rgba(255,255,255,0.1)'

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      style={{
        background: bg, border, borderRadius: 16,
        padding: '16px 20px', cursor: disabled ? 'default' : 'pointer',
        color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600,
        textAlign: 'left', transition: 'all 0.2s ease',
        boxShadow: shadow, width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
      onMouseEnter={e => { if (!disabled && !state) e.currentTarget.style.borderColor = 'var(--comet-cyan)' }}
      onMouseLeave={e => { if (!disabled && !state) e.currentTarget.style.borderColor = 'var(--glass-border)' }}
    >
      <span style={{
        width: 28, height: 28, borderRadius: '50%',
        background: dotBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 800, flexShrink: 0,
        color: state ? 'white' : 'var(--text-muted)',
        transition: 'background 0.2s',
      }}>
        {state === 'correct' ? '✓' : state === 'wrong' ? '✕' : label.split('.')[0]}
      </span>
      {label.includes('.') ? label.split('.').slice(1).join('.').trim() : label}
    </button>
  )
}

export default function LevelScreen() {
  const {
    currentQuestions, currentQuestionIndex, rocketProgress,
    currentGrade, currentTopic, feedbackState, showCopilot, copilotMessage,
    sessionCorrect, sessionTotal, currentMode,
    submitAnswer, nextQuestion, dismissCopilot, navigate, profile,
  } = useStore()

  const [numericInput, setNumericInput] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const question = currentQuestions[currentQuestionIndex]

  // Stop speech when question changes or component unmounts
  useEffect(() => {
    return () => stopSpeaking()
  }, [currentQuestionIndex])

  const handleSpeak = useCallback(async () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    if (!question) return
    setSpeaking(true)

    // Build readable text: question + options
    let text = question.question_text
    if (question.options) {
      text += '. The choices are: '
      const labels = ['A', 'B', 'C', 'D']
      text += question.options.map((opt, i) => `${labels[i]}: ${opt}`).join('. ') + '.'
    }

    await speakText(text)
    setSpeaking(false)
  }, [question, speaking])
  const display = TOPIC_DISPLAY[currentTopic] || { name: currentTopic, color: '#9e9e9e' }
  const isNebula = currentMode === 'nebula'

  if (currentMode === 'levelComplete') {
    return <LevelResult passed score={sessionCorrect} total={currentQuestions.length} navigate={navigate} currentGrade={currentGrade} currentTopic={currentTopic} />
  }
  if (currentMode === 'levelFailed') {
    return <LevelResult passed={false} score={sessionCorrect} total={currentQuestions.length} navigate={navigate} currentGrade={currentGrade} currentTopic={currentTopic} />
  }
  if (currentMode === 'nebulaUnlocked') {
    return <NebulaUnlocked navigate={navigate} currentGrade={currentGrade} currentTopic={currentTopic} />
  }

  if (!question) return null

  const isMultipleChoice = question.type === 'mc' || question.type === 'visual-reasoning'
  const isVisualReasoning = question.type === 'visual-reasoning'
  const optionLabels = ['A', 'B', 'C', 'D']
  const correctOptionIdx = question.options
    ? question.options.findIndex(
        o => String(o).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase()
      )
    : -1

  const handleMCSelect = async (option, idx) => {
    if (feedbackState) return
    setSelectedOption(idx)
    await submitAnswer(option)
  }

  const handleNumericSubmit = async () => {
    if (!numericInput.trim() || feedbackState) return
    await submitAnswer(numericInput)
  }

  const handleNext = () => {
    setSelectedOption(null)
    setNumericInput('')
    nextQuestion()
  }

  const progress = currentQuestions.length > 0
    ? ((currentQuestionIndex) / currentQuestions.length) * 100
    : 0

  return (
    <div className="fill flex-col" style={{ position: 'relative', zIndex: 1, overflow: 'auto' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 14px' : '16px 24px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid var(--glass-border)',
        gap: isMobile ? 8 : 16,
        flexShrink: 0,
      }}>
        <button className="btn btn-ghost" onClick={() => navigate('planet', currentGrade, currentTopic)}
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}>✕ Exit</button>

        <div style={{ flex: 1, maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>{isNebula ? '🌌 Nebula Mode' : display.name}</span>
            <span>{currentQuestionIndex + 1} / {currentQuestions.length}</span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div className="progress-fill" style={{
              width: `${progress}%`,
              background: isNebula
                ? 'linear-gradient(90deg, #ce93d8, #6c2fa0)'
                : `linear-gradient(90deg, ${display.color}, ${display.color}80)`,
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: isMobile ? 8 : 12, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--planet-green)', fontWeight: 700 }}>✓{sessionCorrect}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--danger-red)', fontWeight: 700 }}>✕{sessionTotal - sessionCorrect}</span>
          {!isMobile && <div className="xp-chip" style={{ fontSize: '0.75rem' }}>⭐ {profile?.xp || 0}</div>}
        </div>
      </div>

      {/* Rocket progress track */}
      <div style={{
        margin: isMobile ? '8px 14px 0' : '12px 24px 0',
        height: isMobile ? 48 : 64,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        position: 'relative',
        border: '1px solid var(--glass-border)',
        overflow: 'visible',
      }}>
        {/* Track labels */}
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: '1rem', opacity: 0.5 }}>🌍</div>
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: '1rem', opacity: 0.5 }}>🪐</div>

        {/* Progress fill */}
        <div style={{
          position: 'absolute', left: 32, right: 32, top: '50%', height: 4,
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
        }}>
          <div style={{
            width: `${rocketProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--comet-cyan), var(--nebula-purple))',
            borderRadius: 2,
            transition: 'width 0.8s ease',
          }} />
        </div>

        {/* Rocket */}
        <div style={{
          position: 'absolute',
          left: `calc(5% + ${rocketProgress * 0.9}%)`,
          top: '50%',
          transform: 'translateY(-50%)',
          transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: `drop-shadow(0 0 8px rgba(0,229,255,0.8))`,
          fontSize: '2rem',
        }}>🚀</div>
      </div>

      {/* Main question area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 12 : 24,
        padding: isMobile ? '12px 14px' : '20px 24px',
        alignItems: 'flex-start',
        overflow: 'auto',
      }}>
        {/* Question panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? 10 : 16, minWidth: 0, width: '100%' }}>
          {/* Difficulty badge */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em' }}>Difficulty</span>
            {[1, 2, 3].map(d => (
              <div key={d} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: d <= question.difficulty ? 'var(--star-yellow)' : 'rgba(255,255,255,0.12)',
              }} />
            ))}
          </div>

          {/* Question text */}
          <div className="glass-card" style={{ padding: isMobile ? '16px 18px' : '24px 28px', position: 'relative' }}>
            <p style={{
              fontSize: question.display_mode === 'equation'
                ? (isMobile ? '1.4rem' : '1.8rem')
                : (isMobile ? '1rem' : '1.1rem'),
              fontWeight: question.display_mode === 'equation' ? 800 : 600,
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              fontFamily: question.display_mode === 'equation' ? 'monospace' : 'inherit',
              margin: 0,
              paddingRight: 44,
            }}>
              {question.question_text}
            </p>
            {/* Read aloud button */}
            <button
              onClick={handleSpeak}
              title={speaking ? 'Stop reading' : 'Read question aloud'}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36, borderRadius: '50%',
                background: speaking ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.08)',
                border: speaking ? '2px solid var(--comet-cyan)' : '2px solid var(--glass-border)',
                color: speaking ? 'var(--comet-cyan)' : 'var(--text-muted)',
                fontSize: '1.1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
                animation: speaking ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
              }}
              onMouseEnter={e => { if (!speaking) e.currentTarget.style.borderColor = 'var(--comet-cyan)' }}
              onMouseLeave={e => { if (!speaking) e.currentTarget.style.borderColor = 'var(--glass-border)' }}
            >
              {speaking ? '⏹' : '🔊'}
            </button>
          </div>

          {/* Visual question display */}
          {question.visual_type && (
            <div className="glass-card" style={{
              padding: '20px 24px', display: 'flex', justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(0,229,255,0.2)',
            }}>
              {question.visual_type === 'fraction-pie' && question.visual_config && (
                <FractionPie {...question.visual_config} hideLabel />
              )}
              {question.visual_type === 'fraction-compare' && question.visual_config && (
                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <FractionPie {...question.visual_config.left} size={140} hideLabel />
                    <div style={{ marginTop: 4, fontWeight: 700, color: question.visual_config.left.color }}>
                      {question.visual_config.left.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '2rem', color: 'var(--text-muted)', fontWeight: 800 }}>vs</div>
                  <div style={{ textAlign: 'center' }}>
                    <FractionPie {...question.visual_config.right} size={140} hideLabel />
                    <div style={{ marginTop: 4, fontWeight: 700, color: question.visual_config.right.color }}>
                      {question.visual_config.right.label}
                    </div>
                  </div>
                </div>
              )}
              {question.visual_type === 'array-dots' && question.visual_config && (
                <ArrayDots {...question.visual_config} size={260} hideAnswer />
              )}
              {question.visual_type === 'pattern' && question.visual_config && (
                <PatternSequence {...question.visual_config} />
              )}
              {question.visual_type === 'number-bonds' && question.visual_config && (
                <NumberBonds {...question.visual_config} />
              )}
              {question.visual_type === 'clock-face' && question.visual_config && (
                <ClockFace {...question.visual_config} />
              )}
              {question.visual_type === 'coins' && question.visual_config && (
                <CoinsDisplay {...question.visual_config} />
              )}
              {question.visual_type === 'coordinate-plane' && question.visual_config && (
                <CoordinatePlane {...question.visual_config} />
              )}
              {question.visual_type === 'bar-model' && question.visual_config && (
                <BarModel {...question.visual_config} />
              )}
              {question.visual_type === 'pattern-matrix' && question.visual_config && (
                <PatternMatrix {...question.visual_config} />
              )}
              {question.visual_type === 'rotation' && question.visual_config && (
                <RotationQuestion {...question.visual_config} />
              )}
              {question.visual_type === 'reflection' && question.visual_config && (
                <ReflectionQuestion {...question.visual_config} />
              )}
              {question.visual_type === 'odd-one-out' && question.visual_config && (
                <OddOneOut
                  items={question.visual_config.items}
                  selected={selectedOption}
                  correct={feedbackState ? question.visual_config.oddIndex : null}
                  feedbackState={feedbackState}
                  onSelect={idx => {
                    if (feedbackState) return
                    setSelectedOption(idx)
                    submitAnswer(String(idx))
                  }}
                />
              )}
              {question.visual_type === 'shape-net' && question.visual_config && (
                <ShapeNet {...question.visual_config} />
              )}
              {question.visual_type === 'visual-analogy' && question.visual_config && (
                <VisualAnalogy {...question.visual_config} />
              )}
              {question.visual_type === 'symmetry-complete' && question.visual_config && (
                <SymmetryComplete {...question.visual_config} />
              )}
            </div>
          )}

          {/* Feedback overlay */}
          {feedbackState && (
            <div style={{
              padding: '12px 20px',
              borderRadius: 12,
              background: feedbackState === 'correct'
                ? 'rgba(0,230,118,0.12)' : 'rgba(255,71,87,0.1)',
              border: `2px solid ${feedbackState === 'correct' ? 'var(--planet-green)' : 'var(--danger-red)'}`,
              fontSize: '1rem', fontWeight: 700,
              color: feedbackState === 'correct' ? 'var(--planet-green)' : 'var(--danger-red)',
              animation: feedbackState === 'wrong' ? 'wrong-shake 0.4s ease' : 'slide-up 0.3s ease',
            }}>
              {feedbackState === 'correct' ? '✓ Correct! Great work, Captain! 🚀' : '✕ Not quite — check Co-Pilot ARIA\'s hint!'}
            </div>
          )}

          {/* Answer input */}
          {isVisualReasoning && question.visual_options ? (
            <VisualOptionGrid
              options={question.visual_options}
              selected={selectedOption !== null ? optionLabels[selectedOption] : null}
              feedbackState={feedbackState}
              correctKey={String(question.correct_answer).toUpperCase()}
              onSelect={key => {
                if (feedbackState) return
                const idx = optionLabels.indexOf(key)
                setSelectedOption(idx)
                submitAnswer(key)
              }}
            />
          ) : isMultipleChoice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === i
                const isCorrectOption = i === correctOptionIdx
                let btnState = null
                if (isSelected && !feedbackState) btnState = 'selected'
                else if (feedbackState === 'correct' && isSelected) btnState = 'correct'
                else if (feedbackState === 'wrong' && isSelected) btnState = 'wrong'
                else if (feedbackState === 'wrong' && isCorrectOption) btnState = 'correct'

                return (
                  <ChoiceButton
                    key={i}
                    label={`${optionLabels[i]}. ${opt}`}
                    disabled={!!feedbackState}
                    state={btnState}
                    onClick={() => handleMCSelect(opt, i)}
                  />
                )
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={numericInput}
                onChange={e => setNumericInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNumericSubmit()}
                placeholder="Your answer..."
                disabled={!!feedbackState}
                style={{
                  flex: 1, padding: '14px 18px',
                  background: 'var(--glass-bg)',
                  border: feedbackState === 'correct'
                    ? '2px solid var(--planet-green)'
                    : feedbackState === 'wrong'
                    ? '2px solid var(--danger-red)'
                    : '2px solid var(--glass-border)',
                  borderRadius: 12, color: 'white',
                  fontSize: isMobile ? '1.1rem' : '1.3rem', textAlign: 'center',
                  outline: 'none',
                  minHeight: 52,
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleNumericSubmit}
                disabled={!!feedbackState || !numericInput.trim()}
                style={{ opacity: (feedbackState || !numericInput.trim()) ? 0.5 : 1, flexShrink: 0 }}
              >
                Check 🚀
              </button>
            </div>
          )}

          {/* Next button */}
          {feedbackState && (
            <button className="btn btn-success" onClick={handleNext} style={{ animation: 'slide-up 0.3s ease' }}>
              {currentQuestionIndex + 1 < currentQuestions.length ? 'Next Question →' : '🏁 Finish Mission'}
            </button>
          )}
        </div>

        {/* Manipulative panel — number-line and fraction-bar only (star-cubes removed) */}
        {question.manipulative && question.manipulative !== 'star-cubes' && question.manipulative_config && (
          <div className="glass-card" style={{
            padding: '16px 20px',
            width: isMobile ? '100%' : 320,
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {question.manipulative === 'number-line' && (
              <>
                <div style={{ fontSize: '0.75rem', color: 'var(--comet-cyan)', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  📏 Number Line
                </div>
                <NumberLine key={question.id} {...question.manipulative_config} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  Use the number line to count jumps!
                </p>
              </>
            )}
            {question.manipulative === 'fraction-bar' && (
              <>
                <div style={{ fontSize: '0.75rem', color: 'var(--comet-cyan)', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  📊 Fraction Bar
                </div>
                <FractionBar key={question.id} {...question.manipulative_config} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  Compare the colored parts to the whole bar!
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Co-pilot */}
      <AlienCopilot
        visible={showCopilot}
        message={copilotMessage}
        onDismiss={dismissCopilot}
      />
    </div>
  )
}

// ── Level Result Screen ───────────────────────────────────────────
function LevelResult({ passed, score, total, navigate, currentGrade, currentTopic }) {
  const pct = Math.round((score / total) * 100)
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1

  return (
    <div className="fill flex-center" style={{ position: 'relative', zIndex: 1 }}>
      <div className="glass-card" style={{
        padding: '48px 56px', textAlign: 'center', maxWidth: 480, width: '90%',
        animation: 'badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>
          {passed ? '🎉' : '😤'}
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 900,
          color: passed ? 'var(--planet-green)' : 'var(--danger-red)', marginBottom: 8 }}>
          {passed ? 'Mission Complete!' : 'Mission Failed'}
        </h2>

        <div style={{ fontSize: '3.5rem', margin: '16px 0', letterSpacing: 8 }}>
          {[1, 2, 3].map(s => <span key={s} style={{ opacity: s <= stars ? 1 : 0.2 }}>⭐</span>)}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: 8 }}>
          Score: <strong style={{ color: 'white' }}>{score}/{total}</strong> ({pct}%)
        </p>

        {!passed && (
          <div className="glass-card" style={{ padding: '12px 16px', margin: '16px 0',
            borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.06)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--star-yellow)', margin: 0 }}>
              💡 Tip: Score 60% or more to pass. Try again or enter the Nebula for extra practice!
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => navigate('planet', currentGrade, currentTopic)}>
            {passed ? '🪐 Return to Planet' : '🔄 Try Again'}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('galaxy', currentGrade)}>
            ← Galaxy Map
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Nebula Unlocked Screen ────────────────────────────────────────
function NebulaUnlocked({ navigate, currentGrade, currentTopic }) {
  const { startLevel } = useStore()
  const handleNebula = () => {
    const qs = getNebulaQuestions(currentGrade, currentTopic)
    startLevel(qs, true)
  }

  return (
    <div className="fill flex-center" style={{ position: 'relative', zIndex: 1 }}>
      <div className="glass-card" style={{
        padding: '48px 56px', textAlign: 'center', maxWidth: 480, width: '90%',
        animation: 'slide-up 0.5s ease forwards',
        background: 'linear-gradient(135deg, rgba(108,47,160,0.15), rgba(0,0,0,0))',
        borderColor: 'rgba(108,47,160,0.5)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌌</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ce93d8', marginBottom: 12 }}>
          Nebula Unlocked!
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
          You've attempted this planet twice. A special Nebula Zone has been unlocked
          with simpler problems and visual helpers. This will help you build confidence!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn" style={{
            background: 'linear-gradient(135deg, #6c2fa0, #4a148c)',
            color: 'white', border: '2px solid #ce93d8',
            boxShadow: '0 0 20px rgba(108,47,160,0.4)',
          }} onClick={handleNebula}>
            🌌 Enter the Nebula
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('planet', currentGrade, currentTopic)}>
            ← Back to Planet
          </button>
        </div>
      </div>
    </div>
  )
}
