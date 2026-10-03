# GitHub Game Off 2026: Delivery Schedule & Execution Roadmap

**Total Jam Window:** November 1, 2026 (13:37 PST) – December 1, 2026 (13:37 PST)  
**Safety Buffer:** 24 Hours (Internal Code Freeze: November 30, 2026, 13:37 PST)  
**Current Date:** October 3, 2026 (Pre-Jam Preparation Phase)

---

## 1. Schedule Milestones & Deadlines (Working Backward)

```mermaid
flowchart LR
    A[Oct 3-31: Pre-Jam Architecture & Research] --> B[Nov 1: Theme Drop & Rapid Concept Lock]
    B --> C[Nov 2-7: Phase 1 Vertical Slice]
    C --> D[Nov 8-18: Phase 2 Content & Systems]
    D --> E[Nov 19-25: Phase 3 Juice, Audio & Polish]
    E --> F[Nov 26-29: Phase 4 QA, Playtesting & Tuning]
    F --> G[Nov 30: Final Freeze & Pre-Submission]
    G --> H[Dec 1: Official Submission 13:37 PST]
```

### Milestone Schedule Table

| Milestone | Date / Target | Deliverables & Verification Criteria | Gatekeeper Rule |
| :--- | :--- | :--- | :--- |
| **M0: Tooling & Engine Scaffolding** | Oct 3 – Oct 31, 2026 | Benchmark game engine scaffold, verify automated test suite, set up GitHub operating system, package script, market research dossier. | Zero build friction, 60fps verified, 100% test pass. |
| **M1: Theme Announcement & Concept Lock** | Nov 1, 2026 (13:37 PST) | Theme revealed. Evaluate 5 concept archetypes against theme. Score on 13-point rubric. Select #1 concept within 6 hours. | Explicit written rationale; must pass "10-second hook" test. |
| **M2: Vertical Slice Completion** | Nov 7, 2026 (Day 7) | Playable core loop: player input, core challenge, win/loss condition, basic audio bleeps, restart loop, web export verified. | "Is it fun in graybox?" If NO, pivot immediately. |
| **M3: Systems & Content Expansion** | Nov 18, 2026 (Day 18)| Progression systems, level variety/enemy behaviors, score multiplier, difficulty scaling, distinct visual identity. | 5-minute session retention verified; 0 game-breaking bugs. |
| **M4: Audio & Juiciness Immersion** | Nov 25, 2026 (Day 25)| Procedural dynamic audio, screen shake, hit stop, particle explosions, floating score text, juice pass. | Audio must react to gameplay intensity; 60 FPS locked. |
| **M5: Public Playtest & Blind QA** | Nov 28, 2026 (Day 28)| External playtest with blind testers. Telemetry review. Fix confusion points, adjust difficulty curve. | >80% testers request an immediate second run. |
| **M6: Internal Hard Freeze & Packaging** | Nov 30, 2026 (13:37 PST)| Code freeze. Complete itch.io asset pack (screenshots, thumbnail, gif, readme, credits). Upload test build to itch.io draft. | 24-hour buffer active; no new features allowed. |
| **M7: Final Verification & Submission** | Dec 1, 2026 (10:00 PST)| Clean clone verification, final integrity check, submit official itch.io entry with public GitHub repository link. | Fully verified 3.5 hours before official 13:37 PST deadline. |

---

## 2. Buffer & Contingency Allocation

- **24-Hour Final Freeze:** Dedicated strictly to recovery in case of itch.io upload downtime, cloud failure, or critical packaging regressions.
- **Mid-Jam Pivot Budget:** 48 hours reserved between Nov 7 and Nov 9. If the vertical slice fails the fun test, the architecture allows dropping a replacement archetype into the engine harness without rewriting audio/rendering/input subsystems.
- **Audio & Visual Polish Budget:** 7 days (Nov 19 - Nov 25) allocated to game feel, sound, and visual hierarchy, ensuring top scores in Graphics, Audio, and Overall categories.
