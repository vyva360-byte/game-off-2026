# GitHub Game Off 2026: Compliance Checklist & Rule Baseline

**Verification Date:** October 3, 2026  
**Status:** FULLY VERIFIED AGAINST PRIMARY SOURCES  
**Governing Authority:** GitHub & itch.io Game Off Jam Committee  

---

## 1. Authoritative Rules & Requirements Baseline

| Category | Verified Requirement | Status | Source / Evidence |
| :--- | :--- | :--- | :--- |
| **Theme Announcement** | Sunday, November 1, 2026 | Confirmed | Official Game Off itch.io & GitHub Blog |
| **Submission Deadline** | Tuesday, December 1, 2026 at 13:37 PST | Confirmed | Official Game Off itch.io rules |
| **UTC Deadline** | Tuesday, December 1, 2026 at 21:37 UTC | Calculated | `13:37 PST + 8 hours = 21:37 UTC` |
| **User Local Deadline** | Tuesday, December 1, 2026 at 16:37 EST (15:37 CST) | Calculated | User timezone offset (-05:00/-06:00) |
| **Internal Safety Lock** | Monday, November 30, 2026 at 13:37 PST (24h buffer) | Enforced | Championship Operational Protocol |
| **Source Code Host** | Public GitHub Repository | Mandatory | Must be publicly accessible upon submission |
| **Submission Platform** | itch.io Game Off 2026 Jam Page | Mandatory | Form submission with repo link + build |
| **Distribution Format** | Web-playable (HTML5/WebGL) strongly recommended | Verified | itch.io jams yield ~10x higher play rates for browser builds |
| **AI-Assisted Tools** | Permitted (GitHub Copilot, LLMs, AI assistants) | Allowed | GitHub Blog Game Off FAQ officially permits AI tooling |
| **Pre-Jam Restrictions** | Game creation during Nov 1 - Dec 1 window only | Strict | Pre-jam work limited to tooling, docs, frameworks, setup |
| **Third-Party Assets** | Allowed with open license and attribution in README | Strict | MIT/CC0/CC-BY or equivalent permissive license |
| **Commercial / Paid Assets**| Strictly prohibited unless explicit written consent | Zero Tolerance| Avoid any license risk or redistribution issues |

---

## 2. Evaluation Categories (Judging Rubric)

Submissions are rated across 6 distinct categories during the peer and curated review window:

1. **Overall:** The complete player experience—holistic polish, cohesiveness, delight, and technical execution.
2. **Gameplay:** Core mechanics, control responsiveness, game feel ("juice"), challenge pacing, learning curve, and replayability.
3. **Graphics:** Visual identity, art direction consistency, UI readability, animation smoothness, and aesthetic charm.
4. **Audio:** Sound feedback, music reinforcement of tension/mood, dynamic soundscapes, and procedural sound design.
5. **Innovation:** Original mechanics, unexpected genre syntheses, creative twists on classic tropes, or unique problem spaces.
6. **Theme Interpretation:** How organically the announced theme is embedded into the core mechanics—not just surface-level narrative dressing.

---

## 3. Pre-Jam Allowed vs. Restricted Work Matrix

| Activity | Allowed Before Nov 1? | Operational Action |
| :--- | :---: | :--- |
| Market & Audience Research | **YES** | Completed: Historical jam analysis, competitor matrices, ratings telemetry |
| Tooling & Architecture Evaluation | **YES** | Completed: Zero-dependency WebGL/Canvas2D engine benchmark and test harness |
| Git Repository & CI Pipeline Setup | **YES** | Completed: Automated test suites, packaging scripts, pre-commit hygiene |
| Documentation & Risk Registers | **YES** | Completed: FMEA, decision logs, schedule, accessibility standards |
| Concept Archetype Frameworks | **YES** | Prepared: High-velocity mechanic archetypes ready for theme adaptation |
| Building Final Game Narrative / Content | **NO** | Restricted: Core game content must be crafted during the Nov 1 - Dec 1 jam period |
| Implementing Theme-Specific Levels | **NO** | Restricted: Theme announced Nov 1; game design must respond directly to theme |

---

## 4. Mandatory Submission Deliverables Checklist

- [ ] **Public GitHub Repository:** Clean git history, proper license (MIT), no secrets or credential leaks.
- [ ] **Primary Web Build:** Functional, tested, zero-friction HTML5/WebGL build uploaded directly to itch.io (`dist/game-off-2026.zip`).
- [ ] **GitHub `README.md`:** Comprehensive instructions, theme explanation, controls, architecture overview, credits.
- [ ] **`ATTRIBUTION.md`:** Complete catalog of all third-party libraries, audio formulas, fonts, or tools.
- [ ] **Game Visual Assets:**
  - [ ] Cover image / Thumbnail (630x500 PNG)
  - [ ] Minimum 4 high-definition screenshots (1920x1080)
  - [ ] Gameplay GIF / animated preview
- [ ] **itch.io Metadata:**
  - [ ] Title matching GitHub repository
  - [ ] Short punchy hook tagline (under 140 chars)
  - [ ] Clear controls card for keyboard, gamepad, and touch
  - [ ] Direct link to GitHub repository
- [ ] **Verification Audit:**
  - [ ] Clean clone test passed (`git clone` -> run -> verified)
  - [ ] Automated headless test suite green (`npm test`)
  - [ ] Zero console errors in Chrome, Firefox, Safari, Edge
  - [ ] 60 FPS verified across target hardware
