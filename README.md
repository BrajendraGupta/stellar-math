# 🚀 Stellar Math

An offline-first adaptive math PWA for grades K–10. Students travel through a space-themed galaxy map, earning XP, unlocking planets, and building mastery across math topics — including non-verbal reasoning and spatial visualization.

---

## Features

### Adaptive Learning
- Questions automatically adjust difficulty based on each student's mastery level
- Struggle zone detection — 3+ wrong answers unlocks a Nebula remediation mode
- 10 grade levels (Milky Way → Tadpole Galaxy), each with 4–5 topics

### Question Types
- **Multiple choice** and **numeric input**
- **Visual question types**: Fraction pie, array dots, pattern sequence, number bonds, clock face, coins, coordinate plane, bar model
- **Non-verbal reasoning**: Pattern matrices, rotations, reflections, odd-one-out, shape nets, visual analogies, symmetry completion

### Gamification
- XP system with leveling (every 100 XP = 1 level)
- 14 achievement badges (First Launch, Perfect Orbit, Galaxy Conqueror, Mind's Eye, and more)
- Daily streak tracking with 🔥 flame badge at 7 and 30 consecutive days
- Daily XP goal with progress ring on the Dashboard
- Rocket progress bar during missions
- Co-Pilot ARIA — alien hint system with text-to-speech

### Progress & Analytics
- **Profile screen** with 3 tabs: Badges, Mastery, Charts
- **Charts** (pure SVG): 14-day XP bar chart, daily accuracy line chart, mastery-over-time line chart per topic
- Mastery history snapshots stored hourly, pruned to last 30 per topic

### Parent / Teacher Portal
- PIN-protected (SHA-256 hashed, 5-attempt lockout)
- **Overview tab**: All students' XP, mastery, streak, recent badges, struggle zones
- **Reports tab**: Print-ready PDF report (via browser print) + JSON data export

### Accessibility
- Read-aloud button on every question (Web Speech API)
- Co-Pilot ARIA reads hints aloud on wrong answers
- Offline-first PWA — works without internet after first load

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| State | Zustand 5 |
| Database | Dexie 3 (IndexedDB) |
| PWA | vite-plugin-pwa + Workbox |
| Audio | Web Audio API (synthesized) + Web Speech API (TTS) |
| Charts | Pure SVG (no external chart library) |
| Styling | CSS variables + Flexbox/Grid |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build    # production build
npm run preview  # preview production build locally
```

---

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx        # Home screen with streak widget
│   ├── GalaxyMap.jsx        # Topic/planet selector
│   ├── PlanetScreen.jsx     # Pre-mission briefing
│   ├── LevelScreen.jsx      # Main gameplay
│   ├── ProfileScreen.jsx    # Badges, mastery, charts
│   ├── ProfilePicker.jsx    # Multi-student login
│   ├── PortalLockScreen.jsx # PIN entry for portal
│   └── ParentPortal.jsx     # Parent/teacher overview + reports
├── components/
│   ├── charts/              # XPBarChart, MasteryLineChart, AccuracyLineChart
│   ├── visuals/             # All SVG question visuals
│   ├── manipulatives/       # NumberLine, FractionBar
│   ├── ui/                  # StreakBadge, PinInput, VisualOptionGrid
│   ├── feedback/            # BadgePopup
│   └── svg/                 # AlienCopilot, Planet, RocketShip
├── data/
│   ├── schema.js            # TOPICS, PREREQUISITES, GRADE_GALAXIES
│   └── questions/           # Grade 1–5 banks + reasoning-k2/35/68/910
├── store/index.js           # Zustand store (all app state + actions)
├── db/index.js              # Dexie helpers (all DB operations)
└── audio/SoundManager.js    # Web Audio synthesized sounds + TTS
```

---

## Grades & Topics

| Grade | Galaxy | Topics |
|---|---|---|
| 1 | Milky Way | Counting, Addition, Subtraction, Shapes, Reasoning |
| 2 | Andromeda | Addition, Subtraction, Place Value, Measurement, Reasoning |
| 3 | Triangulum | Multiplication, Division, Fractions, Time, Reasoning |
| 4 | Sombrero | Multiplication, Division, Fractions, Decimals, Reasoning |
| 5 | Whirlpool | Fractions, Decimals, Geometry, Data, Reasoning |
| 6–10 | Various | Reasoning (algebra, trig, calculus-intro topics coming) |

---

## License

Private — all rights reserved.
