# GitHub Game Off 2026: Architectural Decision Records (ADRs)

---

## ADR-001: Target Platform & Distribution Format

- **Status:** ACCEPTED
- **Context:** We need maximum player engagement, rating volume, and zero evaluation friction during the Game Off peer review period.
- **Decision:** Target **HTML5 Web-First (Canvas2D / WebGL2)** as the primary distribution channel, bundled into a self-contained zip for itch.io browser embedding. Desktop standalone builds (Windows/macOS/Linux via Electron or Tauri) can be generated as secondary convenience downloads, but the web build is the authoritative competition artifact.
- **Consequences:**
  - *Pros:* ~10x higher play conversion rate; instant loading; no OS-specific code signing or malware security warnings; seamless sharing via link.
  - *Cons:* WebAudio autoplay policies require explicit user touch/key event; canvas sizing must adapt dynamically to iframe aspect ratios.

---

## ADR-002: Core Technology Stack & Engine Architecture

- **Status:** ACCEPTED
- **Context:** We evaluated heavy game engines (Godot 4 HTML5 export, Unity WebGL) versus lightweight JavaScript frameworks (Phaser 3, PixiJS, LittleJS) versus a **Zero-Dependency Vanilla ES6 Game Engine Architecture**.
- **Evaluation:**
  - *Godot 4 WebGL:* Generates 25MB–40MB WASM payloads, requires `SharedArrayBuffer` headers (which frequently fail in itch.io iframes without custom server headers), takes 5–15 seconds to load on mobile/low-bandwidth connections.
  - *Phaser 3:* Solid but adds 1MB+ bundle size and rigid lifecycle abstractions.
  - *Zero-Dependency Custom High-Performance Engine (Vanilla ES6 Canvas2D/WebGL + Web Audio):*
    - Total bundle size: **< 100 KB uncompressed** (instantaneous loading, < 200ms).
    - 100% deterministic cross-browser compatibility (Chrome, Firefox, Safari, Edge, Mobile WebKit).
    - Zero compilation fragility, zero npm dependency vulnerability risks.
    - Direct control over game loop, collision math, particle pooling, and audio synthesis.
- **Decision:** Build upon a **Lightweight, Zero-Dependency Modular ES6 Engine Architecture** with custom vector math, spatial hashing collision detection, procedural particle pooling, and responsive canvas scaling.

---

## ADR-003: Audio Synthesis Architecture (Procedural Sound Design)

- **Status:** ACCEPTED
- **Context:** Audio is one of the six judging categories. Using external `.mp3` or `.wav` sound packs introduces licensing ambiguity, bloated file sizes, and disconnected sound dynamics.
- **Decision:** Implement a **Procedural Web Audio API Synthesizer (ZzFX Architecture)** that computes synthetic sound waves mathematically in real time using oscillator nodes and custom audio buffers.
- **Consequences:**
  - *Pros:* Zero audio asset size; 100% permissive (MIT/CC0 procedural code); pitch, frequency, and distortion can be dynamically modulated based on gameplay speed, combo multipliers, or player health.
  - *Cons:* Audio context must be unlocked on first user interaction. Handled via pre-game start overlay.

---

## ADR-004: Visual Style & Art Direction

- **Status:** ACCEPTED
- **Context:** Jam games must create a distinct, readable, and striking visual impression in screenshots and the first 3 seconds of gameplay.
- **Decision:** High-Contrast Neon-Vector Aesthetic with dynamic chromatic aberration, reactive camera easing, screen shake, trail effects, and procedural particle bursts.
- **Consequences:**
  - Scalable vector rendering looks ultra-crisp at any resolution (from 720p to 4K displays).
  - Clear silhouettes guarantee immediate gameplay readability.
  - Zero sprite sheet loading delays.

---

## ADR-005: Input & Accessibility Architecture

- **Status:** ACCEPTED
- **Context:** Evaluators play on diverse setups: mechanical keyboards, laptops with trackpads, Xbox/PlayStation controllers, and touchscreens.
- **Decision:** Unified Multi-Input Layer supporting:
  - Keyboard: WASD + Arrow Keys + Space/Z/X.
  - Gamepad: Standard HTML5 Gamepad API with analog stick deadzoning and haptic rumble (where supported).
  - Touch: Virtual thumbstick and tap buttons for mobile web testers.
  - Accessibility: High-contrast palette mode, screen shake toggle, and volume sliders.
