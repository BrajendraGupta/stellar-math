/**
 * Stellar Math — Sound Manager
 *
 * Pure Web Audio API synthesis — no audio files required.
 * Produces cheerful, space-themed sounds for kids.
 */

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── Helpers ─────────────────────────────────────────────────────────

function playTone(freq, duration, type = 'sine', gainVal = 0.3, delay = 0) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime + delay)
  gain.gain.setValueAtTime(gainVal, c.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(c.currentTime + delay)
  osc.stop(c.currentTime + delay + duration)
}

function playNoise(duration, gainVal = 0.08, delay = 0) {
  const c = getCtx()
  const bufferSize = c.sampleRate * duration
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(gainVal, c.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration)
  source.connect(gain).connect(c.destination)
  source.start(c.currentTime + delay)
}

// ── Sound Effects ───────────────────────────────────────────────────

/** Happy ascending chime — correct answer */
export function playCorrect() {
  playTone(523, 0.15, 'sine', 0.25, 0)      // C5
  playTone(659, 0.15, 'sine', 0.25, 0.1)     // E5
  playTone(784, 0.25, 'sine', 0.3, 0.2)      // G5
}

/** Soft descending buzz — wrong answer */
export function playWrong() {
  playTone(330, 0.15, 'square', 0.12, 0)     // E4
  playTone(262, 0.25, 'square', 0.1, 0.12)   // C4
}

/** Sparkle arpeggio — badge unlocked */
export function playBadge() {
  const notes = [523, 659, 784, 1047]         // C5 E5 G5 C6
  notes.forEach((f, i) => {
    playTone(f, 0.2, 'sine', 0.2, i * 0.08)
  })
  playTone(1047, 0.5, 'triangle', 0.15, 0.35) // sustain C6
  playNoise(0.15, 0.04, 0.1)                   // sparkle shimmer
}

/** Triumphant fanfare — level complete / passed */
export function playLevelComplete() {
  const fanfare = [523, 659, 784, 1047, 784, 1047] // C E G C' G C'
  fanfare.forEach((f, i) => {
    playTone(f, 0.2, 'sine', 0.2, i * 0.12)
  })
  playTone(1047, 0.6, 'triangle', 0.18, 0.75)
  playNoise(0.2, 0.03, 0.5)
}

/** Gentle descending — level failed */
export function playLevelFailed() {
  playTone(440, 0.3, 'sine', 0.15, 0)        // A4
  playTone(392, 0.3, 'sine', 0.12, 0.25)     // G4
  playTone(330, 0.5, 'sine', 0.1, 0.5)       // E4
}

/** Quick click for button press */
export function playClick() {
  playTone(880, 0.06, 'sine', 0.1)
}

/** Whoosh for navigation transitions */
export function playWhoosh() {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15)
  gain.gain.setValueAtTime(0.08, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  osc.connect(gain).connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.2)
}

/** Streak chime — plays higher pitch for longer streaks */
export function playStreak(streak) {
  const base = 523 + (streak - 1) * 100  // higher pitch as streak grows
  playTone(base, 0.1, 'sine', 0.2, 0)
  playTone(base * 1.25, 0.1, 'sine', 0.2, 0.08)
  playTone(base * 1.5, 0.2, 'triangle', 0.15, 0.16)
}

// ── Text-to-Speech ──────────────────────────────────────────────

let currentUtterance = null

/**
 * Read text aloud using the browser's Speech Synthesis API.
 * Uses a child-friendly voice at a slightly slower rate.
 * Returns a promise that resolves when speech finishes.
 */
export function speakText(text) {
  if (!window.speechSynthesis) return Promise.resolve()

  // Cancel any in-progress speech
  window.speechSynthesis.cancel()

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85    // slightly slower for kids
    utterance.pitch = 1.1    // slightly higher, friendlier tone
    utterance.volume = 1

    // Try to pick a good voice — prefer female English voices
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'))
    if (preferred) utterance.voice = preferred

    utterance.onend = resolve
    utterance.onerror = resolve
    currentUtterance = utterance
    window.speechSynthesis.speak(utterance)
  })
}

/** Stop any in-progress speech */
export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
  currentUtterance = null
}

/** Check if currently speaking */
export function isSpeaking() {
  return window.speechSynthesis?.speaking || false
}

/** Rocket launch — ascending sweep */
export function playLaunch() {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(100, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.5)
  gain.gain.setValueAtTime(0.08, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6)
  osc.connect(gain).connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.6)
  playNoise(0.4, 0.06, 0.1)
}
