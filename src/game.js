/**
 * Main Application Entry Point
 * GitHub Game Off 2026 Championship Engine
 */

import { Engine } from './core/engine.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Fatal: Canvas element #game-canvas not found.');
    return;
  }

  const engine = new Engine(canvas);
  engine.start();

  // Expose to window for telemetry and debugging
  window.__GAME_OFF_ENGINE__ = engine;
});
