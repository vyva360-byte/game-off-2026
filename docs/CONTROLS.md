# GitHub Game Off 2026: Control Scheme & Input Mappings

---

## 1. Supported Input Methods

The game provides immediate plug-and-play support across all major input devices without requiring configuration:

### Keyboard & Mouse Controls (Primary)
- **Movement / Steering:** `W`, `A`, `S`, `D` or `Arrow Keys`
- **Directional Pulse / Blast:** `Spacebar`, `Z`, or `Left Mouse Click`
- **Focus / Slow Drift (Graze Mode):** `Shift` or `X`
- **Pause / Settings Menu:** `Escape` or `P`
- **Restart (on Game Over):** `R` or `Spacebar`

### Gamepad Controls (Xbox / PlayStation / Generic USB)
- **Movement / Steering:** `Left Analog Stick` or `D-Pad`
- **Directional Pulse / Blast:** `A Button` (Xbox) / `Cross` (PS) / `Right Trigger`
- **Focus / Precision Graze:** `Left Bumper` / `L1` or `Left Trigger`
- **Pause Menu:** `Start` / `Options`
- **Restart (on Game Over):** `A Button` / `Start`

### Touch / Mobile Controls (Automatic on Touch Devices)
- **Left Screen Area:** Drag anywhere for virtual dynamic analog thumbstick.
- **Right Screen Area:** Tap to discharge directional kinetic shockwave.
- **Top Right Button:** Pause & settings toggle.

---

## 2. Input Polish & Game Feel Guarantees

1. **Input Buffering:** Pulse inputs are buffered for 120ms (7 frames) before cooldown finishes, ensuring zero dropped inputs.
2. **Coyote Steering:** Turning inertia provides crisp snap-to-angle responsiveness with 0.05s smoothing.
3. **Deadzone Filtering:** 15% inner deadzone and 95% outer deadzone for analog sticks prevent phantom drift.
