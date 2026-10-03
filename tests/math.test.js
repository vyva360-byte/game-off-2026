import { Vec2, clamp, lerp, circleIntersectsCircle, pointInCircle } from '../src/core/math.js';

export function runMathTests(assert) {
  // Vec2 basic arithmetic
  const v1 = new Vec2(3, 4);
  assert(v1.length() === 5, 'Vec2.length() should be 5 for (3, 4)');
  assert(v1.lengthSq() === 25, 'Vec2.lengthSq() should be 25');

  const v2 = new Vec2(1, 2);
  v1.add(v2);
  assert(v1.x === 4 && v1.y === 6, 'Vec2.add() should produce (4, 6)');

  v1.sub(v2);
  assert(v1.x === 3 && v1.y === 4, 'Vec2.sub() should restore (3, 4)');

  v1.scale(2);
  assert(v1.x === 6 && v1.y === 8, 'Vec2.scale() should produce (6, 8)');

  v1.normalize();
  assert(Math.abs(v1.length() - 1.0) < 0.0001, 'Vec2.normalize() should result in unit length');

  // Math helper functions
  assert(clamp(15, 0, 10) === 10, 'clamp() upper bound');
  assert(clamp(-5, 0, 10) === 0, 'clamp() lower bound');
  assert(clamp(5, 0, 10) === 5, 'clamp() within bounds');
  assert(lerp(10, 20, 0.5) === 15, 'lerp() midpoint');

  // Collisions
  const p1 = new Vec2(0, 0);
  const p2 = new Vec2(10, 0);
  assert(circleIntersectsCircle(p1, 6, p2, 5), 'Circles with radii 6 and 5 at distance 10 should intersect');
  assert(!circleIntersectsCircle(p1, 4, p2, 4), 'Circles with radii 4 and 4 at distance 10 should NOT intersect');
  assert(pointInCircle(new Vec2(3, 4), p1, 6), 'Point (3, 4) is inside circle radius 6');
  assert(!pointInCircle(new Vec2(6, 6), p1, 5), 'Point (6, 6) is outside circle radius 5');
}
