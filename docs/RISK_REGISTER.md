# GitHub Game Off 2026: Risk Register & FMEA

**Last Updated:** October 3, 2026  
**Status:** ACTIVE RISK SURVEILLANCE  
**Scoring Formula:** `Risk Score (RPN) = Probability (1-5) × Impact (1-5)`

---

## 1. Risk Matrix Overview

| ID | Category | Risk Description | Prob (1-5) | Imp (1-5) | Score (1-25) | Mitigation Strategy | Owner / Trigger |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **R-01** | Rules | Pre-jam rule breach or dispute regarding starting state | 1 | 5 | **5** | Restrict pre-Nov 1 commits strictly to reusable engine harness, generic tools, and docs. All game theme content committed post Nov 1. | Autonomous Operator / Continuous |
| **R-02** | Theme | Ambiguous or abstract theme announcement on Nov 1 | 3 | 4 | **12** | Prepared 5 modular mechanical archetypes capable of pivot within 4 hours. Core loop maps to theme at a mechanical level, not surface lore. | Lead Designer / Nov 1, 13:37 PST |
| **R-03** | Platform | WebAudio autoplay block on modern browsers | 4 | 4 | **16** | Mandatory start-screen audio gate ("Click or Press Any Key to Start") which resumes `AudioContext` on first user interaction. | Audio Subsystem / Build Phase |
| **R-04** | Platform | itch.io iframe keyboard trapping and scroll hijacking | 4 | 3 | **12** | Implement `e.preventDefault()` on Arrow keys, Space, and Tab within the game canvas; auto-focus canvas element on load. | Input System / Day 1 |
| **R-05** | Production| Scope creep leading to unpolished, half-finished mechanics | 4 | 5 | **20** | Strict 3-tier backlog: Tier 1 (Core Slice - Day 7), Tier 2 (Juice & Polish - Day 20), Tier 3 (Nice-to-have - cut without hesitation). | Scrum / Daily Gate Check |
| **R-06** | UX | Player drop-off in first 30 seconds due to confusion | 4 | 5 | **20** | "Show, Don't Tell" intro. Immediate control feedback. No walls of text. Clear visual target within 3 seconds of spawn. | UX / Playtest Milestone |
| **R-07** | Performance| Framerate stutter / garbage collection pauses on low-end hardware | 2 | 4 | **8** | Object pooling for particles, bullets, and floating text. Zero per-frame allocations (`new Object()` avoided in game loop). | Core Engine / Architecture |
| **R-08** | Submission | itch.io server timeout or upload failure on Dec 1 deadline | 3 | 5 | **15** | Strict 24-hour freeze (Nov 30, 13:37 PST). Pre-stage draft page on itch.io by Nov 25; test uploads daily during final week. | Release Eng / Nov 30 Buffer |
| **R-09** | Legal | Third-party asset copyright claim or license conflict | 1 | 5 | **5** | 100% procedural sound synthesis (ZzFX architecture), procedural vector/pixel graphics, MIT/CC0 code only. Zero copyrighted external media. | Legal & Compliance / Audit Gate |
| **R-10** | Hardware | Lack of dedicated GPU on judge's laptop | 2 | 4 | **8** | 2D Canvas2D and WebGL dual-target fallback. Resolution scaling to maintain 60 FPS on integrated graphics. | Engine / Graphics Pipeline |

---

## 2. Kill / Pivot Triggers

If any of the following conditions are met during the Jam period, an immediate pivot protocol is initiated:

1. **The 30-Second Confusion Trigger:** If a playtester asks "What do I do?" after 30 seconds of gameplay, the core loop is fundamentally flawed. Stop adding features and redesign the tutorial/visual cues immediately.
2. **The "Juiceless" Test:** If the game is not satisfying to move and interact with in graybox mode (without art), the core mechanic is rejected. We do not apply visual lipstick to broken physics.
3. **The 24-Hour Scope Rule:** If a mechanic requires more than 48 hours to reach a playable state, it is immediately cut or replaced with a proven alternative.
4. **The Performance Ceiling:** If any frame drops below 55 FPS during peak particle bursts on a mid-range machine, the visual effect budget is cut by 50% until 60 FPS is locked.
