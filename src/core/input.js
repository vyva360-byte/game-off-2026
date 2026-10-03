/**
 * Unified Input Manager
 * Handles Keyboard, Mouse, Gamepad, and Touch with Zero Input Lag.
 */

import { Vec2 } from './math.js';

export class InputManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.keys = new Map();
    this.prevKeys = new Map();
    this.mousePos = new Vec2(0, 0);
    this.mouseWorldPos = new Vec2(0, 0);
    this.isMouseDown = false;
    this.wasMouseJustPressed = false;

    // Virtual Touch Joystick
    this.touchActive = false;
    this.touchStart = new Vec2(0, 0);
    this.touchCurrent = new Vec2(0, 0);
    this.touchVector = new Vec2(0, 0);
    this.touchPulseTriggered = false;

    // Gamepad state
    this.gamepadConnected = false;
    this.gamepadMove = new Vec2(0, 0);
    this.gamepadPulseDown = false;
    this.prevGamepadPulseDown = false;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      // Prevent scrolling in itch.io iframe
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(code)) {
        e.preventDefault();
      }
      this.keys.set(code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.mousePos.set(
          (e.clientX - rect.left) * scaleX,
          (e.clientY - rect.top) * scaleY
        );
      });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.isMouseDown = true;
          this.wasMouseJustPressed = true;
        }
      });

      window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
          this.isMouseDown = false;
        }
      });

      // Touch events for mobile/tablet evaluators
      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        if (x < this.canvas.width * 0.5) {
          // Left side: virtual joystick
          this.touchActive = true;
          this.touchStart.set(x, y);
          this.touchCurrent.set(x, y);
          this.touchVector.set(0, 0);
        } else {
          // Right side: pulse tap
          this.touchPulseTriggered = true;
        }
      }, { passive: false });

      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!this.touchActive) return;
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.touchCurrent.set(
          (touch.clientX - rect.left) * scaleX,
          (touch.clientY - rect.top) * scaleY
        );

        const dx = this.touchCurrent.x - this.touchStart.x;
        const dy = this.touchCurrent.y - this.touchStart.y;
        const maxRadius = 60;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          const clampedLen = Math.min(len, maxRadius);
          this.touchVector.set((dx / len) * (clampedLen / maxRadius), (dy / len) * (clampedLen / maxRadius));
        }
      }, { passive: false });

      this.canvas.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
          this.touchActive = false;
          this.touchVector.set(0, 0);
        }
      });
    }

    window.addEventListener('gamepadconnected', () => {
      this.gamepadConnected = true;
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadConnected = false;
    });
  }

  update() {
    this.pollGamepad();
  }

  postUpdate() {
    // Record previous keys for wasJustPressed detection
    this.prevKeys = new Map(this.keys);
    this.wasMouseJustPressed = false;
    this.touchPulseTriggered = false;
    this.prevGamepadPulseDown = this.gamepadPulseDown;
  }

  pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (gp && gp.connected) {
      this.gamepadConnected = true;
      const deadzone = 0.2;
      let ax = gp.axes[0] || 0;
      let ay = gp.axes[1] || 0;
      if (Math.abs(ax) < deadzone) ax = 0;
      if (Math.abs(ay) < deadzone) ay = 0;
      this.gamepadMove.set(ax, ay);

      // Button A or Right Trigger
      const buttonA = gp.buttons[0] && gp.buttons[0].pressed;
      const triggerR = gp.buttons[7] && gp.buttons[7].pressed;
      this.gamepadPulseDown = !!(buttonA || triggerR);
    } else {
      this.gamepadConnected = false;
      this.gamepadMove.set(0, 0);
      this.gamepadPulseDown = false;
    }
  }

  isKeyDown(code) {
    return !!this.keys.get(code);
  }

  wasKeyJustPressed(code) {
    return !!this.keys.get(code) && !this.prevKeys.get(code);
  }

  getMovementVector() {
    const move = new Vec2(0, 0);

    // Keyboard (WASD or Arrows)
    if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) move.y -= 1;
    if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) move.y += 1;
    if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) move.x -= 1;
    if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize();
      return move;
    }

    // Gamepad
    if (this.gamepadConnected && this.gamepadMove.lengthSq() > 0.01) {
      return this.gamepadMove.clone();
    }

    // Touch
    if (this.touchActive && this.touchVector.lengthSq() > 0.01) {
      return this.touchVector.clone();
    }

    return move;
  }

  isPulseTriggered() {
    const keyPulse = this.wasKeyJustPressed('Space') || this.wasKeyJustPressed('KeyZ');
    const mousePulse = this.wasMouseJustPressed;
    const padPulse = this.gamepadPulseDown && !this.prevGamepadPulseDown;
    const touchPulse = this.touchPulseTriggered;
    return keyPulse || mousePulse || padPulse || touchPulse;
  }

  isRestartTriggered() {
    return this.wasKeyJustPressed('KeyR') || this.wasKeyJustPressed('Space') || (this.gamepadPulseDown && !this.prevGamepadPulseDown);
  }

  isPauseTriggered() {
    return this.wasKeyJustPressed('Escape') || this.wasKeyJustPressed('KeyP');
  }
}
