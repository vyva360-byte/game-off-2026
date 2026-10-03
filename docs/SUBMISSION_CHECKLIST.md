# GitHub Game Off 2026: Official Submission Checklist

---

## Pre-Submission Verification (Target: November 30, 2026 – 24h Buffer)

### 1. Codebase & Repository Integrity
- [ ] Source code hosted in public GitHub repository (`main` branch).
- [ ] Clean git commit history with clear messages and verified authors.
- [ ] No private keys, passwords, personal tokens, or secrets committed.
- [ ] Root `LICENSE` present (MIT License).
- [ ] `ATTRIBUTION.md` documents all tools, audio formulas, and techniques.
- [ ] Automated headless test suite executes with 100% pass rate (`npm test`).
- [ ] Zero unhandled JavaScript errors in browser console during 10-minute stress run.

### 2. itch.io Game Page Asset Pack
- [ ] Game Title: Clean, punchy, memorable.
- [ ] Tagline: Under 140 characters, communicates core hook immediately.
- [ ] Cover Image: 630x500 PNG (and 1260x1000 retina version).
- [ ] Minimum 4 high-resolution 1080p in-game screenshots.
- [ ] Animated gameplay GIF illustrating the core mechanic.
- [ ] Explicitly marked as **"Playable in browser"** (Embed mode).
- [ ] Canvas viewport dimensions configured (1280x720 16:9 responsive).
- [ ] Public GitHub repository link prominently featured in description.
- [ ] Controls card clearly displayed below the game frame.
- [ ] Theme interpretation summary clearly articulated in 2-3 sentences.

### 3. Build & Packaging Artifacts
- [ ] `dist/game-off-2026.zip` generated via `npm run package`.
- [ ] Zip verified: contains `index.html` at archive root with all modular code bundled or relative paths intact.
- [ ] Local clean test: unzipped to temporary directory and tested via local HTTP server.
- [ ] Staged test upload to draft itch.io page verified across Chrome, Firefox, Safari, and Edge.

### 4. Official Jam Form Submission
- [ ] Jam submission submitted on official itch.io Game Off 2026 page.
- [ ] All required fields completed: Title, Engine/Framework, GitHub Repo URL.
- [ ] Timestamp of final submission confirmed well prior to December 1, 2026, 13:37 PST.
