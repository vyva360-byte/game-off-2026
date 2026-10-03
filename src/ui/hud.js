/**
 * HUD, Screen Shake, and Visual Juice Pipeline
 */

import { GameStates } from '../core/state.js';

export class HUD {
  constructor() {
    this.screenShake = 0;
    this.shakeDecay = 18;
    this.flashAlpha = 0;
    this.displayedScore = 0;
  }

  triggerShake(intensity = 8) {
    this.screenShake = Math.min(25, this.screenShake + intensity);
  }

  triggerFlash(alpha = 0.3) {
    this.flashAlpha = Math.max(this.flashAlpha, alpha);
  }

  update(dt, actualScore) {
    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - this.shakeDecay * dt);
    }

    // Flash decay
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.5);
    }

    // Smooth score interpolation
    this.displayedScore += (actualScore - this.displayedScore) * Math.min(1, dt * 10);
  }

  applyScreenShake(ctx) {
    if (this.screenShake > 0.05) {
      const offsetX = (Math.random() * 2 - 1) * this.screenShake;
      const offsetY = (Math.random() * 2 - 1) * this.screenShake;
      ctx.translate(offsetX, offsetY);
    }
  }

  draw(ctx, gameState, worldWidth, worldHeight) {
    // Impact flash overlay
    if (this.flashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      ctx.fillRect(0, 0, worldWidth, worldHeight);
      ctx.restore();
    }

    if (gameState.currentState === GameStates.PLAYING) {
      this.drawPlayingHUD(ctx, gameState, worldWidth);
    } else if (gameState.currentState === GameStates.TITLE) {
      this.drawTitleScreen(ctx, gameState, worldWidth, worldHeight);
    } else if (gameState.currentState === GameStates.GAME_OVER) {
      this.drawGameOverScreen(ctx, gameState, worldWidth, worldHeight);
    } else if (gameState.currentState === GameStates.PAUSED) {
      this.drawPausedScreen(ctx, worldWidth, worldHeight);
    }
  }

  drawPlayingHUD(ctx, state, width) {
    ctx.save();

    // 1. Top HUD Bar
    ctx.fillStyle = 'rgba(8, 12, 24, 0.75)';
    ctx.fillRect(0, 0, width, 55);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, 55);

    // Score display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${Math.floor(this.displayedScore).toLocaleString()}`, 20, 34);

    // High Score
    ctx.fillStyle = '#a0aec0';
    ctx.font = '13px monospace';
    ctx.fillText(`HIGH: ${state.highScore.toLocaleString()}`, 260, 34);

    // Wave indicator
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`WAVE ${state.wave}`, width * 0.5, 34);

    // Shield Bar
    const barWidth = 140;
    const barHeight = 12;
    const shieldX = width - 360;
    const shieldY = 22;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(shieldX, shieldY, barWidth, barHeight);
    const shieldRatio = Math.max(0, state.shield / state.maxShield);
    ctx.fillStyle = shieldRatio > 0.4 ? '#00f0ff' : '#ff0055';
    ctx.fillRect(shieldX, shieldY, barWidth * shieldRatio, barHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(shieldX, shieldY, barWidth, barHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('SHIELD', shieldX - 8, shieldY + 10);

    // Pulse Energy Bar
    const energyX = width - 160;
    const energyY = 22;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(energyX, energyY, barWidth, barHeight);
    const energyRatio = Math.max(0, state.energy / state.maxEnergy);
    ctx.fillStyle = state.canFirePulse() ? '#ff00aa' : '#552255';
    ctx.fillRect(energyX, energyY, barWidth * energyRatio, barHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(energyX, energyY, barWidth, barHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('PULSE', energyX - 8, energyY + 10);

    // 2. Dynamic Combo Banner (below HUD)
    if (state.combo > 1) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 18px monospace';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.fillText(`${state.combo}x MULTIPLIER!`, 20, 85);

      // Combo countdown bar
      const comboBarWidth = 120;
      const comboRatio = state.comboTimer / state.maxComboTimer;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.fillRect(20, 92, comboBarWidth * comboRatio, 4);
    }

    ctx.restore();
  }

  drawTitleScreen(ctx, state, width, height) {
    ctx.save();
    // Dim background
    ctx.fillStyle = 'rgba(5, 8, 16, 0.85)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';

    // Game Title
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 52px monospace';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00f0ff';
    ctx.fillText('PULSE RESONANCE', width * 0.5, height * 0.32);

    // Subtitle / Hook
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px monospace';
    ctx.shadowBlur = 0;
    ctx.fillText('GITHUB GAME OFF 2026 BENCHMARK ENGINE', width * 0.5, height * 0.38);

    // Start prompt (pulsing)
    const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
    ctx.fillStyle = `rgba(255, 0, 119, ${pulseAlpha})`;
    ctx.font = 'bold 24px monospace';
    ctx.fillText('[ CLICK OR PRESS SPACE / ENTER TO START ]', width * 0.5, height * 0.52);

    // Controls Card Box
    const cardW = 540;
    const cardH = 170;
    const cardX = (width - cardW) * 0.5;
    const cardY = height * 0.60;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('CONTROLS & HOW TO PLAY', width * 0.5, cardY + 28);

    ctx.font = '13px monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('• Move: WASD / Arrow Keys / Left Analog Stick / Touch Drag', width * 0.5, cardY + 60);
    ctx.fillText('• Kinetic Pulse: SPACEBAR / Left Click / Gamepad A / Touch Tap', width * 0.5, cardY + 85);
    ctx.fillText('• Goal: Repel & dissolve hazards, graze dangers for energy, chain combos!', width * 0.5, cardY + 110);
    ctx.fillText('• Zero external assets • 100% Procedural Web Audio API synthesis', width * 0.5, cardY + 135);

    ctx.restore();
  }

  drawGameOverScreen(ctx, state, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 5, 12, 0.88)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';

    // Game Over Header
    ctx.fillStyle = '#ff0055';
    ctx.font = 'bold 48px monospace';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0055';
    ctx.fillText('SIGNAL TERMINATED', width * 0.5, height * 0.30);

    // Score breakdown
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`FINAL SCORE: ${state.score.toLocaleString()}`, width * 0.5, height * 0.40);

    ctx.fillStyle = '#ffaa00';
    ctx.font = '16px monospace';
    ctx.fillText(`ALL-TIME HIGH: ${state.highScore.toLocaleString()}`, width * 0.5, height * 0.46);

    // Stats
    ctx.fillStyle = '#a0aec0';
    ctx.font = '14px monospace';
    ctx.fillText(`Wave Reached: ${state.wave}  |  Grazes: ${state.grazeCount}  |  Pulses: ${state.pulsesFired}`, width * 0.5, height * 0.53);

    // Restart prompt
    const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.006) * 0.5;
    ctx.fillStyle = `rgba(0, 240, 255, ${pulseAlpha})`;
    ctx.font = 'bold 22px monospace';
    ctx.fillText('[ PRESS R OR SPACEBAR TO RESTART ]', width * 0.5, height * 0.65);

    ctx.restore();
  }

  drawPausedScreen(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('PAUSED', width * 0.5, height * 0.5);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press ESC or P to Resume', width * 0.5, height * 0.5 + 40);
    ctx.restore();
  }
}
