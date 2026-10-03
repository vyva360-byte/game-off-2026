# GitHub Game Off 2026: Evidence-Based Playtesting Framework

---

## 1. Playtesting Protocol & Methodology

To ensure maximum player delight, intuitive onboarding, and zero drop-off, every iteration is evaluated against standardized quantitative and qualitative metrics.

### Quantitative Metrics
1. **Time to First Meaningful Action (TTFMA):** Target: `< 3 seconds` from game start.
2. **First-Session Survival Duration:** Target: `45 – 90 seconds` on Run 1.
3. **Retry Rate (Second-Run Conversion):** Target: `> 85%` of testers immediately press Restart without prompting.
4. **Time to Understand Core Objective:** Target: `< 15 seconds` without reading manual.
5. **Frame Rate Stability:** Target: Locked `60 FPS` on 95% of test runs.

### Qualitative Interview Prompts (Blind Testing)
- *"What felt most satisfying to do?"* (Identifies the emotional core / juice).
- *"Was there any moment you felt cheated or confused?"* (Exposes telegraphing flaws).
- *"If you could change one thing right now, what would it be?"* (Highlights highest-friction barrier).
- *"How would you describe the goal of this game to a friend in one sentence?"* (Tests clarity of hook).

---

## 2. Telemetry Event Hooks

The engine contains lightweight, zero-overhead telemetry event listeners:
- `SESSION_START`: Timestamp, user agent, display dimensions.
- `FIRST_INPUT`: Delta time from load to first movement or pulse.
- `FIRST_SCORE`: Delta time to first enemy neutralized or point scored.
- `DEATH`: Position, cause of death, active combo multiplier, score, session time.
- `RESTART`: Delta time between death and restart button trigger.
