/**
 * Game State Machine, Scoring, and Accessibility Settings
 */

import { globalThemeAdapter } from '../theme/themeAdapter.js';

export const GameStates = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  SETTINGS: 'SETTINGS',
  GAME_OVER: 'GAME_OVER'
};

export class GameState {
  constructor() {
    this.currentState = GameStates.TITLE;
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.combo = 1;
    this.comboTimer = 0;
    this.maxComboTimer = 2.5; // seconds to maintain combo
    this.grazeCount = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.waveDuration = 25.0; // seconds per wave escalation
    this.gameTime = 0;

    // Player stats
    this.maxShield = 100;
    this.shield = 100;
    this.maxEnergy = 100;
    this.energy = 100;
    this.energyRechargeRate = 35; // energy per second
    this.pulseEnergyCost = 28;

    // Stats telemetry
    this.enemiesDestroyed = 0;
    this.pulsesFired = 0;

    // Accessibility & User Preferences
    this.settings = this.loadSettings();

    // Theme hook reference
    this.theme = globalThemeAdapter;
  }

  loadHighScore() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return parseInt(localStorage.getItem('gh_game_off_2026_highscore') || '0', 10);
      }
    } catch {
      // Sandboxed iframe fallback
    }
    return 0;
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('gh_game_off_2026_highscore', this.highScore.toString());
        }
      } catch {
        // Sandboxed fallback
      }
    }
  }

  loadSettings() {
    const defaults = {
      masterVolume: 0.7,
      screenShake: 1.0, // 0.0 to 1.0 multiplier
      highContrast: false,
      reducedMotion: false
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('gh_game_off_2026_settings');
        if (saved) return { ...defaults, ...JSON.parse(saved) };
      }
    } catch {
      // Ignored
    }
    return defaults;
  }

  saveSettings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('gh_game_off_2026_settings', JSON.stringify(this.settings));
      }
    } catch {
      // Ignored
    }
  }

  startNewGame() {
    this.currentState = GameStates.PLAYING;
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
    this.grazeCount = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.gameTime = 0;
    this.shield = this.maxShield;
    this.energy = this.maxEnergy;
    this.enemiesDestroyed = 0;
    this.pulsesFired = 0;
  }

  update(dt) {
    if (this.currentState !== GameStates.PLAYING) return;

    this.gameTime += dt;
    this.waveTimer += dt;

    // Wave progression
    if (this.waveTimer >= this.waveDuration) {
      this.waveTimer = 0;
      this.wave += 1;
    }

    // Energy recharge
    if (this.energy < this.maxEnergy) {
      this.energy = Math.min(this.maxEnergy, this.energy + this.energyRechargeRate * dt);
    }

    // Combo decay with theme modifier
    if (this.comboTimer > 0) {
      const decayRate = dt * (this.theme.modifiers.comboDecayMultiplier || 1.0);
      this.comboTimer -= decayRate;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }
  }

  canFirePulse() {
    return this.energy >= this.pulseEnergyCost;
  }

  consumePulseEnergy() {
    if (this.canFirePulse()) {
      this.energy -= this.pulseEnergyCost;
      this.pulsesFired++;
      return true;
    }
    return false;
  }

  addScore(basePoints, multiplierBonus = false) {
    const points = basePoints * this.combo;
    this.score += points;
    if (multiplierBonus) {
      this.combo = Math.min(10, this.combo + 1);
      this.comboTimer = this.maxComboTimer;
    }
    this.saveHighScore();
    return points;
  }

  addGraze(points = 15) {
    this.grazeCount++;
    this.score += points * this.combo;
    this.energy = Math.min(this.maxEnergy, this.energy + 8);
    this.comboTimer = Math.min(this.maxComboTimer, this.comboTimer + 0.4);
    this.saveHighScore();
  }

  takeDamage(amount) {
    this.shield = Math.max(0, this.shield - amount);
    this.combo = 1;
    this.comboTimer = 0;
    if (this.shield <= 0) {
      this.currentState = GameStates.GAME_OVER;
      this.saveHighScore();
      return true; // Fatal
    }
    return false;
  }
}
