import { ThemeAdapter } from '../src/theme/themeAdapter.js';
import { GameState } from '../src/core/state.js';

export function runThemeAndSettingsTests(assert) {
  const adapter = new ThemeAdapter();

  // Initial state before Nov 1
  assert(!adapter.isThemeLocked, 'Theme should not be locked initially');
  assert(adapter.themeName.includes('UNANNOUNCED'), 'Initial theme name should indicate unannounced');

  // Lock theme simulation (Nov 1 event)
  adapter.lockTheme('WAVES', 'Simulated test wave theme', {
    comboDecayMultiplier: 0.8,
    pulseBehavior: 'EXPANDING_RIPPLE'
  });

  assert(adapter.isThemeLocked, 'Theme should be locked after lockTheme()');
  assert(adapter.themeName === 'WAVES', 'Theme name should be uppercase WAVES');
  assert(adapter.modifiers.comboDecayMultiplier === 0.8, 'Custom modifier should be applied');

  // Settings testing
  const state = new GameState();
  assert(state.settings.masterVolume === 0.7, 'Default master volume should be 0.7');
  assert(state.settings.screenShake === 1.0, 'Default screen shake should be 1.0');
  assert(!state.settings.highContrast, 'High contrast should be false by default');
  assert(!state.settings.reducedMotion, 'Reduced motion should be false by default');
}
