# GitHub Game Off 2026: Known Issues & Resolution Log

---

## Active & Monitored Issues

| Issue ID | Severity | Description | Status | Workaround / Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01**| Low | WebAudio requires user interaction before unmuting on Safari/Chrome. | Resolved | Splash screen requires click/key press to unlock AudioContext. |
| **ISSUE-02**| Low | Page scrolls when pressing space/arrow keys if canvas is not focused. | Resolved | `event.preventDefault()` bound to keydown listener on game keys. |
| **ISSUE-03**| Low | Gamepad triggers may register as analog axis or digital button depending on OS. | Resolved | Unified mapping layer normalizes triggers to range [0, 1]. |
| **ISSUE-04**| Medium | Tab switching causes large delta spike in requestAnimationFrame. | Resolved | `dt` is clamped to maximum 0.1s in main engine loop. |
