/**
 * Pre-Allocated Particle Pooling System
 * Zero Garbage Collection Thrashing at 60 FPS.
 */

import { Vec2, randRange } from '../core/math.js';

class Particle {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.color = '#ffffff';
    this.size = 2;
    this.life = 0;
    this.maxLife = 1;
    this.active = false;
    this.drag = 0.95;
  }

  spawn(x, y, vx, vy, color, size, maxLife, drag = 0.95) {
    this.pos.set(x, y);
    this.vel.set(vx, vy);
    this.color = color;
    this.size = size;
    this.maxLife = maxLife;
    this.life = maxLife;
    this.drag = drag;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }

    this.vel.scale(this.drag);
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    if (!this.active) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingText {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, -40);
    this.text = '';
    this.color = '#ffffff';
    this.life = 0;
    this.maxLife = 0.8;
    this.active = false;
  }

  spawn(x, y, text, color = '#00f0ff', maxLife = 0.8) {
    this.pos.set(x, y);
    this.vel.set(randRange(-15, 15), randRange(-50, -30));
    this.text = text;
    this.color = color;
    this.maxLife = maxLife;
    this.life = maxLife;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.life -= dt;
    if (this.life <= 0) {
      this.active = false;
      return;
    }
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx) {
    if (!this.active) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillText(this.text, this.pos.x, this.pos.y);
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor(poolSize = 500, textPoolSize = 50) {
    this.particles = Array.from({ length: poolSize }, () => new Particle());
    this.texts = Array.from({ length: textPoolSize }, () => new FloatingText());
  }

  reset() {
    for (const p of this.particles) p.active = false;
    for (const t of this.texts) t.active = false;
  }

  emitBurst(x, y, count = 25, color = '#ff0055', speedMultiplier = 1) {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        const angle = randRange(0, Math.PI * 2);
        const speed = randRange(80, 240) * speedMultiplier;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = randRange(2, 5);
        const maxLife = randRange(0.25, 0.65);
        p.spawn(x, y, vx, vy, color, size, maxLife);

        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  emitTrail(x, y, color = '#00f0ff') {
    for (const p of this.particles) {
      if (!p.active) {
        const vx = randRange(-10, 10);
        const vy = randRange(-10, 10);
        p.spawn(x, y, vx, vy, color, randRange(1.5, 3), 0.25, 0.9);
        break;
      }
    }
  }

  emitText(x, y, text, color = '#00f0ff') {
    for (const t of this.texts) {
      if (!t.active) {
        t.spawn(x, y, text, color);
        break;
      }
    }
  }

  update(dt) {
    for (const p of this.particles) {
      if (p.active) p.update(dt);
    }
    for (const t of this.texts) {
      if (t.active) t.update(dt);
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      if (p.active) p.draw(ctx);
    }
    for (const t of this.texts) {
      if (t.active) t.draw(ctx);
    }
  }
}
