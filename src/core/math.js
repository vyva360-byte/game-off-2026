/**
 * Vector2D and Collision Mathematics Engine
 * High-performance, allocation-conscious 2D mathematics.
 */

export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    const len = this.length();
    if (len > 0.00001) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  distSq(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  dist(v) {
    return Math.sqrt(this.distSq(v));
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const rx = this.x * cos - this.y * sin;
    const ry = this.x * sin + this.y * cos;
    this.x = rx;
    this.y = ry;
    return this;
  }
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function circleIntersectsCircle(c1Pos, c1Rad, c2Pos, c2Rad) {
  const dx = c1Pos.x - c2Pos.x;
  const dy = c1Pos.y - c2Pos.y;
  const radSum = c1Rad + c2Rad;
  return dx * dx + dy * dy <= radSum * radSum;
}

export function pointInCircle(point, circlePos, circleRad) {
  const dx = point.x - circlePos.x;
  const dy = point.y - circlePos.y;
  return dx * dx + dy * dy <= circleRad * circleRad;
}
