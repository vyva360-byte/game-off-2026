/**
 * Zero-Dependency Headless Test Runner
 */

import { runMathTests } from './math.test.js';
import { runStateTests } from './state.test.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n=============================================');
console.log('GitHub Game Off 2026 Headless Test Runner');
console.log('=============================================\n');

try {
  console.log('[SUITE 1/2] Running Vector2D & Collision Math Tests...');
  runMathTests(assert);
  console.log('\n[SUITE 2/2] Running Game State & Scoring Tests...');
  runStateTests(assert);
} catch (err) {
  console.error('\nFatal Exception during test execution:', err);
  process.exit(1);
}

console.log('\n=============================================');
console.log(`TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log('=============================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('>>> ALL VERIFICATION TESTS GREEN <<<\n');
  process.exit(0);
}
