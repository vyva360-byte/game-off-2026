/**
 * Core Game Engine and Fixed-Timestep Orchestrator
 */

import { Vec2, circleIntersectsCircle } from './math.js';
import { GameStates, GameState } from './state.js';
import { InputManager } from './input.js';
import { AudioManager } from '../audio/sound.js';
import { Player } from '../entities/player.js';
import { HazardSpawner } from '../entities/hazards.js';
import { ParticleSystem } from '../entities/particles.js';
import { HUD } from '../ui/hud.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Virtual resolution (standard 16:9 arcade canvas)
    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Fixed timestep settings
    this.fixedDelta = 1 / 60;
    this.accumulator = 0;
    this.lastTime = 0;
    this.maxFrameDelta = 0.1;

    // Subsystems
    this.input = new InputManager(canvas);
    this.audio = new AudioManager();
    this.state = new GameState();
    this.hud = new HUD();
    this.particles = new ParticleSystem(500, 50);

    // Synchronize volume
    this.audio.setVolume(this.state.settings.masterVolume);

    // Entities
    this.player = new Player(this.width * 0.5, this.height * 0.5);
    this.spawner = new HazardSpawner(this.width, this.height);

    // Starfield
    this.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.2
    }));

    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (delta > this.maxFrameDelta) delta = this.maxFrameDelta;

    this.accumulator += delta;
    this.input.update();

    while (this.accumulator >= this.fixedDelta) {
      this.fixedUpdate(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
    }

    this.render();
    this.input.postUpdate();

    requestAnimationFrame((t) => this.loop(t));
  }

  fixedUpdate(dt) {
    // 1. Title Screen State
    if (this.state.currentState === GameStates.TITLE) {
      if (this.input.isPulseTriggered() || this.input.isRestartTriggered()) {
        this.audio.unlock();
        this.audio.startMusic();
        this.state.startNewGame();
        this.player.reset(this.width * 0.5, this.height * 0.5);
        this.spawner.reset();
        this.particles.reset();
        this.hud.triggerFlash(0.4, this.state.settings.reducedMotion);
        this.audio.playPulse();
      }
      return;
    }

    // 2. Settings Menu Navigation
    if (this.state.currentState === GameStates.SETTINGS) {
      this.handleSettingsInput();
      if (this.input.isPauseTriggered()) {
        this.state.currentState = GameStates.PLAYING;
      }
      return;
    }

    // 3. Game Over State
    if (this.state.currentState === GameStates.GAME_OVER) {
      if (this.input.isRestartTriggered()) {
        this.audio.unlock();
        this.state.startNewGame();
        this.player.reset(this.width * 0.5, this.height * 0.5);
        this.spawner.reset();
        this.particles.reset();
        this.hud.triggerFlash(0.3, this.state.settings.reducedMotion);
        this.audio.playPulse();
      }
      this.particles.update(dt);
      this.hud.update(dt, this.state.score);
      return;
    }

    // 4. Pause / Settings Toggle
    if (this.input.isPauseTriggered()) {
      if (this.state.currentState === GameStates.PLAYING) {
        this.state.currentState = GameStates.SETTINGS;
        return;
      }
    }

    // 5. Playing Simulation
    this.state.update(dt);
    this.hud.update(dt, this.state.score);
    this.audio.updateMusic(this.state.combo);

    // Player update
    const move = this.input.getMovementVector();
    this.player.update(dt, move, this.width, this.height);

    // Pulse trigger
    if (this.input.isPulseTriggered() && this.player.pulseCooldown <= 0) {
      if (this.state.consumePulseEnergy()) {
        this.player.firePulse();
        this.audio.playPulse();
        this.hud.triggerShake(5, this.state.settings.screenShake);
        this.particles.emitBurst(this.player.pos.x, this.player.pos.y, 16, '#00f0ff', 0.8);
      }
    }

    // Hazards update
    this.spawner.update(dt, this.player.pos, this.state.wave);

    // Particles update
    this.particles.update(dt);

    // Collisions
    this.resolveCollisions();
  }

  handleSettingsInput() {
    const items = this.hud.settingItems;
    let idx = this.hud.selectedSettingIndex;

    if (this.input.wasKeyJustPressed('ArrowUp') || this.input.wasKeyJustPressed('KeyW')) {
      idx = (idx - 1 + items.length) % items.length;
      this.hud.selectedSettingIndex = idx;
      this.audio.playGraze();
    } else if (this.input.wasKeyJustPressed('ArrowDown') || this.input.wasKeyJustPressed('KeyS')) {
      idx = (idx + 1) % items.length;
      this.hud.selectedSettingIndex = idx;
      this.audio.playGraze();
    }

    const currentItem = items[idx];
    if (this.input.wasKeyJustPressed('ArrowLeft') || this.input.wasKeyJustPressed('KeyA')) {
      this.adjustSetting(currentItem, -1);
    } else if (this.input.wasKeyJustPressed('ArrowRight') || this.input.wasKeyJustPressed('KeyD') || this.input.wasKeyJustPressed('Space') || this.input.wasKeyJustPressed('Enter')) {
      this.adjustSetting(currentItem, 1);
    }
  }

  adjustSetting(item, dir) {
    const s = this.state.settings;
    if (item.type === 'slider') {
      s[item.id] = Math.max(item.min, Math.min(item.max, Math.round((s[item.id] + dir * item.step) * 10) / 10));
      if (item.id === 'masterVolume') {
        this.audio.setVolume(s.masterVolume);
      }
    } else if (item.type === 'toggle') {
      s[item.id] = !s[item.id];
    }
    this.state.saveSettings();
    this.audio.playCombo(1);
  }

  resolveCollisions() {
    const pulse = this.player.activePulse;
    const playerPos = this.player.pos;
    const playerRad = this.player.radius;
    const grazeRad = playerRad + 28;
    const shakeMult = this.state.settings.screenShake;
    const redMotion = this.state.settings.reducedMotion;

    for (const h of this.spawner.hazards) {
      if (h.destroyed) continue;

      // Pulse vs Hazard
      if (pulse && circleIntersectsCircle(pulse.pos, pulse.radius, h.pos, h.radius)) {
        h.destroyed = true;
        this.state.enemiesDestroyed++;
        const pts = this.state.addScore(h.points, true);
        this.hud.triggerShake(7, shakeMult);
        this.hud.triggerFlash(0.12, redMotion);
        this.audio.playExplosion(1.0);
        this.audio.playCombo(this.state.combo);
        this.particles.emitBurst(h.pos.x, h.pos.y, 25, h.color, 1.4);
        this.particles.emitText(h.pos.x, h.pos.y, `+${pts}`, '#00f0ff');
        continue;
      }

      // Player vs Hazard
      if (circleIntersectsCircle(playerPos, playerRad, h.pos, h.radius)) {
        if (this.player.invulnerableTimer <= 0) {
          h.destroyed = true;
          this.hud.triggerShake(14, shakeMult);
          this.hud.triggerFlash(0.35, redMotion);
          this.audio.playDamage();
          this.particles.emitBurst(playerPos.x, playerPos.y, 30, '#ff0055', 1.8);
          this.player.invulnerableTimer = 1.2;

          const fatal = this.state.takeDamage(35);
          if (fatal) {
            this.audio.playGameOver();
            this.audio.stopMusic();
          }
        }
        continue;
      }

      // Graze Detection
      if (circleIntersectsCircle(playerPos, grazeRad, h.pos, h.radius)) {
        if (!h.grazed) {
          h.grazed = true;
          this.state.addGraze(20);
          this.audio.playGraze();
          this.particles.emitTrail(playerPos.x, playerPos.y, '#ffffff');
          this.particles.emitText(playerPos.x, playerPos.y - 12, 'GRAZE!', '#ffaa00');
        }
      }
    }
  }

  render() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    const isHC = this.state.settings.highContrast;
    this.ctx.fillStyle = isHC ? '#000000' : '#060913';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.hud.applyScreenShake(this.ctx, this.state.settings.screenShake);
    this.drawBackgroundGrid(isHC);

    this.spawner.draw(this.ctx);
    this.player.draw(this.ctx);
    this.particles.draw(this.ctx);

    this.hud.draw(this.ctx, this.state, this.width, this.height);
    this.ctx.restore();
  }

  drawBackgroundGrid(isHC) {
    this.ctx.save();
    if (!isHC) {
      for (const star of this.stars) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        this.ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    }

    this.ctx.strokeStyle = isHC ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 240, 255, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 64;

    this.ctx.beginPath();
    for (let x = 0; x <= this.width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }
}
