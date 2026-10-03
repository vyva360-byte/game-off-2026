# Contributing & Branching Protocol

## Branching Model
- `main`: Production release branch. Must be green at all times.
- `feat/*`: Feature branches (e.g., `feat/pulse-mechanic`, `feat/audio-synth`).
- `fix/*`: Bug fixes and regression repairs.

## Commit Hygiene
Commits must adhere to Conventional Commits:
- `feat:` New gameplay feature or mechanic
- `fix:` Bug or edge-case resolution
- `test:` Additions to headless test suite
- `docs:` Documentation and devlog updates
- `perf:` Performance optimizations and GC reductions
- `refactor:` Code restructuring without behavioral change

## Verification Gate
Before merging into `main`:
1. `npm test` must pass 100%.
2. Clean clone must run without error.
3. No secret credentials or sensitive tokens committed.
