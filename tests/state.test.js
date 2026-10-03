import { GameState, GameStates } from '../src/core/state.js';

export function runStateTests(assert) {
  const state = new GameState();

  // Initial state
  assert(state.currentState === GameStates.TITLE, 'Initial state should be TITLE');
  assert(state.score === 0, 'Initial score should be 0');

  // Start game
  state.startNewGame();
  assert(state.currentState === GameStates.PLAYING, 'State after start should be PLAYING');
  assert(state.shield === 100, 'Starting shield should be 100');
  assert(state.energy === 100, 'Starting energy should be 100');
  assert(state.combo === 1, 'Starting combo should be 1');

  // Energy consumption
  assert(state.canFirePulse(), 'Should be able to fire pulse with 100 energy');
  const fired = state.consumePulseEnergy();
  assert(fired, 'consumePulseEnergy should return true');
  assert(state.energy === 100 - state.pulseEnergyCost, 'Energy should be deducted by pulse cost');
  assert(state.pulsesFired === 1, 'Pulses fired counter should increment');

  // Scoring and combo multipliers
  const pts1 = state.addScore(100, true);
  assert(pts1 === 100, 'First kill should yield 100 points at 1x combo');
  assert(state.combo === 2, 'Combo multiplier should increment to 2');
  assert(state.score === 100, 'Total score should be 100');

  const pts2 = state.addScore(100, true);
  assert(pts2 === 200, 'Second kill should yield 200 points at 2x combo');
  assert(state.combo === 3, 'Combo multiplier should increment to 3');
  assert(state.score === 300, 'Total score should be 300');

  // Graze mechanic
  state.addGraze(20);
  assert(state.grazeCount === 1, 'Graze count should be 1');
  assert(state.score === 300 + 20 * 3, 'Graze points should be multiplied by current combo');

  // Damage and fatal trigger
  const fatal1 = state.takeDamage(40);
  assert(!fatal1, 'Taking 40 damage on 100 shield is not fatal');
  assert(state.shield === 60, 'Shield should drop to 60');
  assert(state.combo === 1, 'Combo should reset to 1 upon taking damage');

  const fatal2 = state.takeDamage(70);
  assert(fatal2, 'Taking 70 damage on 60 shield should be fatal');
  assert(state.shield === 0, 'Shield should be clamped to 0');
  assert(state.currentState === GameStates.GAME_OVER, 'State should transition to GAME_OVER');
}
