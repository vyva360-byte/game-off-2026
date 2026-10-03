/**
 * Player Kinetic Craft Entity
 * High-agility vector vessel with reactive recoil and shockwave emission.
 */

import { Vec2, lerp } from '../core/math.js';

export class Player {
  constructor(x, y) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.radius = 16;
    this.angle = -Math.PI / 2;
    this.targetAngle = this.angle;
    this.maxSpeed = 380;
    this.acceleration = 1200;
    this.drag = 4.5;
    this.invulnerableTimer = 0;

    // Pulse shockwave properties
    this.activePulse = null;
    this.pulseCooldown = 0;
    this.trailTimer = 0;
  }

  reset(x, y) {
    this.pos.set(x, y);
    this.vel.set(0, 0);
    this.angle = -Math.PI / 2;
    this.targetAngle = this.angle;
    this.invulnerableTimer = 1.0;
    this.activePulse = null;
    this.pulseCooldown = 0;
  }

  update(dt, inputMoveVector, worldWidth, worldHeight) {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }
    if (this.pulseCooldown > 0) {
      this.pulseCooldown -= dt;
    }

    // Acceleration from input
    if (inputMoveVector.lengthSq() > 0) {
      this.vel.x += inputMoveVector.x * this.acceleration * dt;
      this.vel.y += inputMoveVector.y * this.acceleration * dt;
      this.targetAngle = Math.atan2(inputMoveVector.y, inputMoveVector.x);
    }

    // Velocity damping / drag
    this.vel.x -= this.vel.x * this.drag * dt;
    this.vel.y -= this.vel.y * this.drag * dt;

    // Clamp speed
    const currentSpeed = this.vel.length();
    if (currentSpeed > this.maxSpeed) {
      this.vel.normalize().scale(this.maxSpeed);
    }

    // Integrate position
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Smooth rotational slerp
    let diff = this.targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.angle += diff * 14 * dt;

    // World boundary containment with bouncy restitution
    const margin = this.radius + 4;
    if (this.pos.x < margin) {
      this.pos.x = margin;
      this.vel.x = -this.vel.x * 0.5;
    } else if (this.pos.x > worldWidth - margin) {
      this.pos.x = worldWidth - margin;
      this.vel.x = -this.vel.x * 0.5;
    }

    if (this.pos.y < margin) {
      this.pos.y = margin;
      this.vel.y = -this.vel.y * 0.5;
    } else if (this.pos.y > worldHeight - margin) {
      this.pos.y = worldHeight - margin;
      this.vel.y = -this.vel.y * 0.5;
    }

    // Update active pulse shockwave
    if (this.activePulse) {
      this.activePulse.radius += this.activePulse.expandSpeed * dt;
      this.activePulse.lifetime -= dt;
      if (this.activePulse.lifetime <= 0) {
        this.activePulse = null;
      }
    }
  }

  firePulse() {
    this.pulseCooldown = 0.25;

    // Spawn expanding shockwave
    this.activePulse = {
      pos: this.pos.clone(),
      radius: this.radius + 5,
      maxRadius: 135,
      expandSpeed: 420,
      lifetime: 0.32,
      maxLifetime: 0.32
    };

    // Kinetic recoil: kick ship forward/reverse
    const recoilDir = new Vec2(Math.cos(this.angle), Math.sin(this.angle));
    this.vel.x -= recoilDir.x * 120;
    this.vel.y -= recoilDir.y * 120;

    return this.activePulse;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);

    // If invulnerable, flicker
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Outer glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';

    // Ship Hull (Sleek aerodynamic delta vector)
    ctx.fillStyle = '#0a192f';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(this.radius * 1.3, 0); // Nose tip
    ctx.lineTo(-this.radius * 0.9, -this.radius * 0.9); // Left wing
    ctx.lineTo(-this.radius * 0.4, 0); // Inverted thruster core
    ctx.lineTo(-this.radius * 0.9, this.radius * 0.9); // Right wing
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Kinetic Core Reactor
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Thruster exhaust flame when moving
    if (this.vel.lengthSq() > 400) {
      const flameLen = Math.min(22, this.vel.length() * 0.06 + Math.random() * 6);
      ctx.fillStyle = '#ff0077';
      ctx.shadowColor = '#ff0077';
      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.4, -4);
      ctx.lineTo(-this.radius * 0.4 - flameLen, 0);
      ctx.lineTo(-this.radius * 0.4, 4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // Draw active shockwave ring
    if (this.activePulse) {
      ctx.save();
      const alpha = this.activePulse.lifetime / this.activePulse.maxLifetime;
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.9})`;
      ctx.lineWidth = 4 * alpha;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(this.activePulse.pos.x, this.activePulse.pos.y, this.activePulse.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner refraction ring
      ctx.strokeStyle = `rgba(255, 0, 119, ${alpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.activePulse.pos.x, this.activePulse.pos.y, this.activePulse.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
