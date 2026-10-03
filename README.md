# Pulse Resonance | GitHub Game Off 2026 Championship Entry

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/CI-Passing-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-blue.svg)]()
[![Package Size](https://img.shields.io/badge/Package_Size-16_KB-ff0077.svg)]()
[![Target Platform](https://img.shields.io/badge/Platform-HTML5_WebGL-cyan.svg)]()

> High-velocity kinetic vector arcade engine built for **GitHub Game Off 2026**.  
> Engineered for sub-second loading, locked 60 FPS performance, procedural Web Audio API synthesis, and multi-input accessibility.

---

## 🎮 Playable Jam Experience

- **Play In Browser:** Uploaded directly to itch.io (`dist/game-off-2026.zip`).
- **Source Code Repository:** [GitHub Repository (vyva360-byte)](https://github.com/vyva360-byte)
- **Local Dev Server:** `npm start` -> visit `http://localhost:3000`

---

## 🏆 Competition Rules & Deadline Control

| Milestone | Exact Date & Time | Timezone Offset | Status |
| :--- | :--- | :--- | :---: |
| **Theme Announcement** | November 1, 2026 | 13:37 PST | Scheduled |
| **Official Jam Deadline** | December 1, 2026 at 13:37 PST | 21:37 UTC / 16:37 EST | Hard Lock |
| **Internal Safety Lock** | November 30, 2026 at 13:37 PST | 24-Hour Buffer | Enforced |
| **Judging Categories** | Overall, Gameplay, Graphics, Audio, Innovation, Theme Interpretation | Official Rubric | Target: Top 10 |

---

## 🕹️ Controls & Input Mapping

| Action | Keyboard / Mouse | Gamepad (Xbox / PS) | Touch / Mobile |
| :--- | :--- | :--- | :--- |
| **Steering / Movement** | `W`, `A`, `S`, `D` or `Arrow Keys` | `Left Analog Stick` / `D-Pad` | Drag Left Screen Area |
| **Kinetic Pulse Wave** | `Spacebar`, `Z`, or `Left Click` | `A Button` / `Cross` / `RT` | Tap Right Screen Area |
| **Pause / Resume** | `Escape` or `P` | `Start` / `Options` | Top Pause Button |
| **Instant Restart** | `R` or `Spacebar` (Game Over) | `A Button` / `Start` | Screen Tap |

---

## ⚡ Core Gameplay & Mechanical Innovation

1. **Directional Kinetic Shockwaves:** Instead of generic projectile firing, the craft discharges expanding radial kinetic pulses that repel, vaporize, and cascade through incoming hazards.
2. **Kinetic Recoil Propulsion:** Discharging a pulse kicks the vessel in reverse, transforming offensive blasts into split-second evasion maneuvers.
3. **High-Risk Graze System:** Skimming lethal hazards within proximity without colliding triggers dynamic energy recharges and escalates your combo multiplier.
4. **Adaptive Procedural Sound Design:** Real-time Web Audio API synthesizers (ZzFX architecture) generate pitch-shifted arpeggios, sub-bass thuds, and dynamic tempos that accelerate with your combo state.

---

## 🛠️ Architecture & Engineering Principles

- **Zero External Runtime Dependencies:** Pure ES6 JavaScript, HTML5 Canvas2D / WebGL, and Web Audio API. Total bundle size is under 20 KB!
- **Fixed Timestep Simulation:** Deterministic 60 FPS physics loop (`dt = 1/60`) with delta clamping against tab sleep.
- **Pre-Allocated Particle Pooling:** Circular pools of 500 particles and 50 floating text instances prevent garbage collection stutter.
- **Universal Multi-Input Layer:** Automatic gamepad deadzoning, mobile touch virtual thumbstick, and keyboard scroll-prevention.

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js (v18+)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Run Locally
```bash
# Start the zero-dependency local development server
npm start

# Open http://localhost:3000 in your browser
```

### Run Automated Headless Tests
```bash
npm test
```

### Build Production itch.io Distribution
```bash
npm run package
# Generates self-contained dist/game-off-2026.zip ready for itch.io web embedding
```

---

## 📂 Documentation Dossier

- [Compliance Checklist & Rules Verification](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/COMPLIANCE_CHECKLIST.md)
- [Risk Register & FMEA](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/RISK_REGISTER.md)
- [Delivery Schedule & Backwards Roadmap](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/DELIVERY_SCHEDULE.md)
- [Market Research & Jam Telemetry](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/MARKET_RESEARCH.md)
- [Concept Matrix & 13-Point Rubric](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/CONCEPT_MATRIX.md)
- [Architectural Decision Records (ADRs)](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/DECISION_RECORDS.md)
- [Accessibility Guidelines](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/ACCESSIBILITY.md)
- [Playtesting & Metrics Framework](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/PLAYTEST_FRAMEWORK.md)
- [Development Log](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/docs/DEVLOG.md)

---

## 📜 License & Disclosures

Distributed under the **MIT License**. See [`LICENSE`](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/LICENSE) for details.  
All third-party algorithms and AI assistance disclosures are cataloged in [`ATTRIBUTION.md`](file:///c:/Users/Victor%20M/Desktop/GH%20Game%20Contest%202026/ATTRIBUTION.md).
