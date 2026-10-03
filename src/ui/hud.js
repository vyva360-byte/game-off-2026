/**
 * HUD, Visual Juice, and In-Game Accessibility/Settings Interface
 */

import { GameStates } from '../core/state.js';

export class HUD {
  constructor() {
    this.screenShake = 0;
    this.shakeDecay = 18;
    this.flashAlpha = 0;
    this.displayedScore = 0;
    this.selectedSettingIndex = 0;
    this.settingItems = [
      { id: 'screenShake', label: 'Screen Shake', type: 'slider', min: 0, max: 1.0, step: 0.1 },
      { id: 'masterVolume', label: 'Master Volume', type: 'slider', min: 0, max: 1.0, step: 0.1 },
      { id: 'highContrast', label: 'High Contrast Mode', type: 'toggle' },
      { id: 'reducedMotion', label: 'Reduced Motion', type: 'toggle' }
    ];
  }

  triggerShake(intensity = 8, userMultiplier = 1.0) {
    const finalIntensity = intensity * (userMultiplier !== undefined ? userMultiplier : 1.0);
    this.screenShake = Math.min(25, this.screenShake + finalIntensity);
  }

  triggerFlash(alpha = 0.3, reducedMotion = false) {
    if (reducedMotion) return;
    this.flashAlpha = Math.max(this.flashAlpha, alpha);
  }

  update(dt, actualScore) {
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - this.shakeDecay * dt);
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.5);
    }
    this.displayedScore += (actualScore - this.displayedScore) * Math.min(1, dt * 10);
  }

  applyScreenShake(ctx, userMultiplier = 1.0) {
    if (userMultiplier <= 0) return;
    if (this.screenShake > 0.05) {
      const scale = this.screenShake * userMultiplier;
      const offsetX = (Math.random() * 2 - 1) * scale;
      const offsetY = (Math.random() * 2 - 1) * scale;
      ctx.translate(offsetX, offsetY);
    }
  }

  draw(ctx, gameState, worldWidth, worldHeight) {
    // Impact flash overlay
    if (this.flashAlpha > 0.01 && !gameState.settings.reducedMotion) {
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
    } else if (gameState.currentState === GameStates.PAUSED || gameState.currentState === GameStates.SETTINGS) {
      this.drawSettingsScreen(ctx, gameState, worldWidth, worldHeight);
    }
  }

  drawPlayingHUD(ctx, state, width) {
    ctx.save();
    const isHC = state.settings.highContrast;

    // Top HUD Bar
    ctx.fillStyle = isHC ? '#000000' : 'rgba(8, 12, 24, 0.85)';
    ctx.fillRect(0, 0, width, 55);
    ctx.strokeStyle = isHC ? '#ffffff' : 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, width, 55);

    // Score display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${Math.floor(this.displayedScore).toLocaleString()}`, 20, 34);

    // High Score
    ctx.fillStyle = isHC ? '#ffff00' : '#a0aec0';
    ctx.font = '13px monospace';
    ctx.fillText(`HIGH: ${state.highScore.toLocaleString()}`, 250, 34);

    // Wave indicator
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`WAVE ${state.wave}`, width * 0.5, 34);

    // Settings prompt
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('[P / ESC: SETTINGS]', width * 0.5, 48);

    // Shield Bar
    const barWidth = 140;
    const barHeight = 12;
    const shieldX = width - 360;
    const shieldY = 22;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(shieldX, shieldY, barWidth, barHeight);
    const shieldRatio = Math.max(0, state.shield / state.maxShield);
    ctx.fillStyle = shieldRatio > 0.4 ? (isHC ? '#00ffff' : '#00f0ff') : '#ff0055';
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
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

    // Dynamic Combo Banner
    if (state.combo > 1) {
      ctx.textAlign = 'left';
      ctx.fillStyle = isHC ? '#ffff00' : '#00f0ff';
      ctx.font = 'bold 18px monospace';
      ctx.shadowBlur = isHC ? 0 : 10;
      ctx.shadowColor = '#00f0ff';
      ctx.fillText(`${state.combo}x MULTIPLIER!`, 20, 85);

      const comboBarWidth = 120;
      const comboRatio = state.comboTimer / state.maxComboTimer;
      ctx.fillStyle = isHC ? '#ffff00' : 'rgba(0, 240, 255, 0.8)';
      ctx.fillRect(20, 92, comboBarWidth * comboRatio, 5);
    }

    ctx.restore();
  }

  drawTitleScreen(ctx, state, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(5, 8, 16, 0.88)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';

    // Game Title
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 50px monospace';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00f0ff';
    ctx.fillText('PULSE RESONANCE', width * 0.5, height * 0.28);

    // Pre-Jam Status Tag
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.shadowBlur = 0;
    ctx.fillText('OFFICIAL GITHUB GAME OFF 2026 PRE-JAM TEMPLATE', width * 0.5, height * 0.34);

    // Theme Status
    ctx.fillStyle = '#f59e0b';
    ctx.font = '13px monospace';
    ctx.fillText(`THEME STATUS: ${state.theme.themeName}`, width * 0.5, height * 0.38);

    // Start prompt
    const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
    ctx.fillStyle = `rgba(255, 0, 119, ${pulseAlpha})`;
    ctx.font = 'bold 24px monospace';
    ctx.fillText('[ CLICK OR PRESS SPACE / ENTER TO START ]', width * 0.5, height * 0.49);

    // Controls & Architecture Card
    const cardW = 600;
    const cardH = 200;
    const cardX = (width - cardW) * 0.5;
    const cardY = height * 0.57;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('PRE-JAM OPERATING SPECIFICATION', width * 0.5, cardY + 28);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('• Movement: WASD / Arrow Keys / Left Analog Stick / Touch Drag', width * 0.5, cardY + 58);
    ctx.fillText('• Kinetic Pulse: SPACEBAR / Left Click / Gamepad A / Touch Tap', width * 0.5, cardY + 82);
    ctx.fillText('• Settings / Accessibility: Press P or ESC to adjust volume & motion', width * 0.5, cardY + 106);
    ctx.fillText('• Zero Dependencies • 100% Procedural Web Audio • 60 FPS Fixed Timestep', width * 0.5, cardY + 130);
    ctx.fillText('• Pre-jam work limited to tooling; game content builds Nov 1 - Dec 1', width * 0.5, cardY + 154);
    ctx.fillText('• Theme integration hook ready: src/theme/themeAdapter.js', width * 0.5, cardY + 178);

    ctx.restore();
  }

  drawSettingsScreen(ctx, state, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(3, 6, 12, 0.92)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px monospace';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.fillText('SETTINGS & ACCESSIBILITY', width * 0.5, height * 0.22);

    ctx.shadowBlur = 0;
    ctx.font = '14px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Use Up/Down Arrow keys to navigate, Left/Right to change, ESC to close', width * 0.5, height * 0.28);

    const boxW = 540;
    const boxH = 250;
    const boxX = (width - boxW) * 0.5;
    const boxY = height * 0.35;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    this.settingItems.forEach((item, index) => {
      const y = boxY + 45 + index * 48;
      const isSelected = index === this.selectedSettingIndex;

      // Selection indicator
      if (isSelected) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.fillRect(boxX + 15, y - 24, boxW - 30, 36);
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`> ${item.label}`, boxX + 25, y);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`  ${item.label}`, boxX + 25, y);
      }

      // Value display
      ctx.textAlign = 'right';
      const val = state.settings[item.id];
      if (item.type === 'slider') {
        const percent = Math.round(val * 100);
        ctx.fillStyle = isSelected ? '#ff00aa' : '#cbd5e1';
        ctx.fillText(`[ ${percent}% ]`, boxX + boxW - 30, y);
      } else {
        ctx.fillStyle = val ? '#10b981' : '#ef4444';
        ctx.fillText(val ? '[ ENABLED ]' : '[ DISABLED ]', boxX + boxW - 30, y);
      }
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('[ PRESS ESC OR P TO RETURN TO GAME ]', width * 0.5, height * 0.80);

    ctx.restore();
  }

  drawGameOverScreen(ctx, state, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 5, 12, 0.90)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff0055';
    ctx.font = 'bold 48px monospace';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0055';
    ctx.fillText('SIGNAL TERMINATED', width * 0.5, height * 0.30);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`FINAL SCORE: ${state.score.toLocaleString()}`, width * 0.5, height * 0.40);

    ctx.fillStyle = '#ffaa00';
    ctx.font = '16px monospace';
    ctx.fillText(`HIGH SCORE: ${state.highScore.toLocaleString()}`, width * 0.5, height * 0.46);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '14px monospace';
    ctx.fillText(`Wave Reached: ${state.wave}  |  Grazes: ${state.grazeCount}  |  Pulses: ${state.pulsesFired}`, width * 0.5, height * 0.53);

    const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.006) * 0.5;
    ctx.fillStyle = `rgba(0, 240, 255, ${pulseAlpha})`;
    ctx.font = 'bold 22px monospace';
    ctx.fillText('[ PRESS R OR SPACEBAR TO RESTART ]', width * 0.5, height * 0.65);

    ctx.restore();
  }
}
