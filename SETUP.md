# Stellar Math — Setup Guide

## Prerequisites
Install Node.js (v18+): https://nodejs.org

## Quick Start

```bash
cd ~/Desktop/stellar-math
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for Production (offline PWA)

```bash
npm run build
npm run preview
```

The `dist/` folder is a fully offline-capable PWA. Deploy to any static host
or open via `npm run preview`.

## Project Structure

```
stellar-math/
├── src/
│   ├── App.jsx                     # Root router & layout
│   ├── main.jsx                    # Entry point + SW registration
│   ├── styles.css                  # Global design tokens & animations
│   │
│   ├── audio/
│   │   └── SoundManager.js         # Web Audio API sounds + Speech Synthesis TTS
│   │
│   ├── db/index.js                 # Dexie.js (IndexedDB) — all persistence
│   ├── store/index.js              # Zustand global state ("Flight Log")
│   │
│   ├── data/
│   │   ├── schema.js               # Question schema, topic maps, prerequisites, grade gating
│   │   └── questions/
│   │       ├── index.js            # Question bank registry + adaptive selection
│   │       ├── grade1.js           # Grade 1 (counting, addition, subtraction, shapes)
│   │       ├── grade2.js           # Grade 2 (addition, subtraction, place-value, measurement)
│   │       ├── grade3.js           # Grade 3 (multiplication, division, fractions, time)
│   │       ├── grade4.js           # Grade 4 (multi-digit ops, fractions, decimals)
│   │       └── grade5.js           # Grade 5 (fraction ops, decimals, geometry, data)
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx           # Home screen + grade selector with mastery progress
│   │   ├── GalaxyMap.jsx           # Planet picker with prerequisite-gated unlocking
│   │   ├── PlanetScreen.jsx        # Pre-level briefing with adaptive difficulty info
│   │   ├── LevelScreen.jsx         # Active gameplay + visuals + manipulatives + TTS
│   │   └── ProfileScreen.jsx       # XP, badges, mastery breakdown
│   │
│   └── components/
│       ├── svg/
│       │   ├── RocketShip.jsx      # Animated SVG rocket
│       │   ├── Planet.jsx          # SVG planet with mastery ring
│       │   └── AlienCopilot.jsx    # Co-Pilot ARIA hint character (reads hints aloud)
│       ├── visuals/
│       │   ├── FractionPie.jsx     # SVG fraction pie chart
│       │   ├── ArrayDots.jsx       # Rows × cols dot array for multiplication
│       │   └── PatternSequence.jsx # Shape/color pattern matching
│       ├── manipulatives/
│       │   ├── StarCubes.jsx       # Draggable star-cube groups
│       │   ├── NumberLine.jsx      # Interactive number line with skip-count arcs
│       │   └── FractionBar.jsx     # Tappable fraction bar segments
│       └── feedback/
│           └── BadgePopup.jsx      # Badge award animation
│
└── public/
    ├── sw.js                       # Service Worker (dev fallback)
    └── icon-*.svg                  # App icons
```

## Key Features

### Adaptive Learning
Questions are selected based on the student's current mastery level:
- <30% mastery → mostly easy questions
- 30–60% → mix of easy and medium
- 60–80% → medium and hard
- 80%+ → challenge mode (mostly hard)
Struggle zones (3+ wrong in last 5 attempts) trigger additional support.

### Sound & Audio
- Synthesized sound effects via Web Audio API (correct, wrong, badge, level complete, streaks)
- Text-to-Speech reads questions aloud (browser Speech Synthesis API)
- Co-Pilot ARIA reads hints automatically on wrong answers

### Visual Question Types
- `visual_type: "fraction-pie"` — SVG pie chart
- `visual_type: "array-dots"` — rows × columns dot grid
- `visual_type: "fraction-compare"` — side-by-side pie comparison
- `visual_type: "pattern"` — shape/color pattern sequence

### Virtual Manipulatives
- `manipulative: "star-cubes"` — draggable star groups (multiplication/division)
- `manipulative: "number-line"` — interactive number line with skip-counting arcs
- `manipulative: "fraction-bar"` — tappable fraction bar segments

### Mastery-Gated Progression
- Topics have prerequisites (e.g., division requires 50% mastery in multiplication)
- Grades unlock when average mastery in previous grade reaches 60%
- Defined in `schema.js` via `PREREQUISITES` and `GRADE_UNLOCK_THRESHOLD`

## Adding More Content

Add `gradeN.js` files following the existing schema.
Register them in `src/data/questions/index.js`.

Each question supports:
- `type: "mc"` — multiple choice
- `type: "numeric"` — number input
- `difficulty: 1|2|3` — progressive difficulty (also XP multiplier)
- `display_mode: "text"|"equation"|"visual"` — rendering style
- `visual_type` + `visual_config` — inline graphical display
- `manipulative` + `manipulative_config` — side-panel interactive tool
- `hint_logic.common_errors` — per-wrong-answer Co-Pilot hints

## Tech Stack
- **React 18** + **Vite 6** — fast dev & build
- **Zustand** — lightweight global state
- **Dexie.js** — IndexedDB wrapper for offline persistence
- **vite-plugin-pwa** — service worker + manifest generation
- **Web Audio API** — synthesized sound effects
- **Speech Synthesis API** — text-to-speech for accessibility
- **Pure SVG** — all visual assets, zero image dependencies
