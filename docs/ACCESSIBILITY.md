# GitHub Game Off 2026: Accessibility Guidelines & Options

---

## 1. Universal Design Commitments

Judges and players come from all backgrounds, visual acuities, and hardware capabilities. Our technical architecture is engineered around the following accessibility standards:

### Visual Accessibility
- **High-Contrast Silhouette Design:** Every game element has a distinct luminance contrast ratio greater than 4.5:1 against the background (WCAG AAA compliant).
- **Colorblind-Safe Palettes:** All essential gameplay information (e.g. enemy danger, collectible energy, safe zones) is communicated through shape, pulsation rate, and distinct icons, never color alone.
- **Screen Shake Slider:** Full toggle to reduce or disable screen shake from 100% down to 0% for players prone to motion sickness or vestibular disorders.
- **Flashing Light Reduction:** Particle bursts and background flashes use smooth opacity fades rather than rapid strobing to safeguard against photosensitivity triggers.

### Auditory Accessibility
- **Full Visual Redundancy:** Every audio cue (e.g., enemy spawn warning, shield low, combo multiplier ding) has an identical visual indicator (screen rim glow, floating text, icon pulse).
- **Independent Audio Sliders:** Separate master, sound effects (SFX), and ambient sound level adjustments.

### Motor Accessibility
- **Multi-Input Redundancy:** Supports one-handed keyboard control, two-handed keyboard control, gamepad, and touch.
- **Adjustable Game Speed:** Option to toggle 80% speed mode for players requiring slower reaction windows.
- **Instant Restart:** Single-key tap with zero penalty to retry immediately.
