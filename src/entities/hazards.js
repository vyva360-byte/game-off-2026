/**
 * Dynamic Hazard Entities and Wave Spawner
 * High-performance obstacle ecosystem with diverse kinetic behaviors.
 */

import { Vec2, randRange } from '../core/math.js';

export const HazardType = {
  SEEKER: 'SEEKER',
  ORBITER: 'ORBITER',
  MINE: 'MINE'
};

export class Hazard {
  constructor(x, y, type = HazardType.SEEKER, waveLevel = 1) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.type = type;
    this.waveLevel = waveLevel;
    this.destroyed = false;
    this.angle = 0;
    this.age = 0;

    if (type === HazardType.SEEKER) {
      this.radius = 12;
      this.speed = randRange(110, 160) + waveLevel * 8;
      this.turnRate = 2.4;
      this.points = 100;
      this.color = '#ff0055';
    } else if (type === HazardType.ORBITER) {
      this.radius = 15;
      this.speed = randRange(80, 120);
      this.orbitCenter = new Vec2(x, y);
      this.orbitRadius = randRange(60, 140);
      this.orbitSpeed = randRange(1.2, 2.2);
      this.points = 150;
      this.color = '#ffaa00';
    } else { // MINE
      this.radius = 18;
      this.speed = 0;
      this.points = 80;
      this.pulsePhase = randRange(0, Math.PI * 2);
      this.color = '#aa00ff';
    }
  }

  update(dt, playerPos, worldWidth, worldHeight) {
    this.age += dt;

    if (this.type === HazardType.SEEKER) {
      // Seek towards player
      const toPlayer = new Vec2(playerPos.x - this.pos.x, playerPos.y - this.pos.y);
      const targetAngle = toPlayer.angle();

      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * this.turnRate * dt;

      this.vel.x = Math.cos(this.angle) * this.speed;
      this.vel.y = Math.sin(this.angle) * this.speed;

      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    } else if (this.type === HazardType.ORBITER) {
      this.angle += this.orbitSpeed * dt;
      this.pos.x = this.orbitCenter.x + Math.cos(this.angle) * this.orbitRadius;
      this.pos.y = this.orbitCenter.y + Math.sin(this.angle) * this.orbitRadius;
    } else { // MINE
      this.pulsePhase += dt * 4;
    }

    // Wrap / bounce at edges
    const pad = this.radius;
    if (this.pos.x < -pad) this.pos.x = worldWidth + pad;
    if (this.pos.x > worldWidth + pad) this.pos.x = -pad;
    if (this.pos.y < -pad) this.pos.y = worldHeight + pad;
    if (this.pos.y > worldHeight + pad) this.pos.y = -pad;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;

    if (this.type === HazardType.SEEKER) {
      ctx.rotate(this.angle);
      ctx.strokeStyle = this.color;
      ctx.fillStyle = '#1c0512';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.radius * 1.2, 0);
      ctx.lineTo(-this.radius, -this.radius * 0.7);
      ctx.lineTo(-this.radius * 0.5, 0);
      ctx.lineTo(-this.radius, this.radius * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Menacing eye dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.radius * 0.3, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === HazardType.ORBITER) {
      ctx.rotate(this.angle * 2);
      ctx.strokeStyle = this.color;
      ctx.fillStyle = '#221500';
      ctx.lineWidth = 2;
      // Diamond
      ctx.beginPath();
      ctx.moveTo(0, -this.radius);
      ctx.lineTo(this.radius, 0);
      ctx.lineTo(0, this.radius);
      ctx.lineTo(-this.radius, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else { // MINE
      const scale = 1.0 + Math.sin(this.pulsePhase) * 0.15;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = '#120024';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pulsing spiky core
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export class HazardSpawner {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.hazards = [];
    this.spawnTimer = 0;
    this.baseSpawnInterval = 1.6; // seconds
  }

  reset() {
    this.hazards = [];
    this.spawnTimer = 0.5; // Quick initial spawn
  }

  update(dt, playerPos, waveLevel) {
    // Spawn interval accelerates with wave
    const spawnInterval = Math.max(0.45, this.baseSpawnInterval - (waveLevel - 1) * 0.12);
    this.spawnTimer -= dt;

    const maxHazards = 12 + waveLevel * 4;

    if (this.spawnTimer <= 0 && this.hazards.length < maxHazards) {
      this.spawnTimer = spawnInterval;
      this.spawnHazard(playerPos, waveLevel);
    }

    // Update existing hazards
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      if (h.destroyed) {
        this.hazards.splice(i, 1);
      } else {
        h.update(dt, playerPos, this.worldWidth, this.worldHeight);
      }
    }
  }

  spawnHazard(playerPos, waveLevel) {
    // Spawn at random perimeter edge
    let x, y;
    const edge = Math.floor(Math.random() * 4);
    const pad = 40;

    if (edge === 0) { // Top
      x = randRange(0, this.worldWidth);
      y = -pad;
    } else if (edge === 1) { // Right
      x = this.worldWidth + pad;
      y = randRange(0, this.worldHeight);
    } else if (edge === 2) { // Bottom
      x = randRange(0, this.worldWidth);
      y = this.worldHeight + pad;
    } else { // Left
      x = -pad;
      y = randRange(0, this.worldHeight);
    }

    // Select type based on wave
    let type = HazardType.SEEKER;
    const roll = Math.random();
    if (waveLevel >= 2 && roll > 0.65) {
      type = HazardType.ORBITER;
    } else if (waveLevel >= 3 && roll < 0.25) {
      type = HazardType.MINE;
    }

    this.hazards.push(new Hazard(x, y, type, waveLevel));
  }

  draw(ctx) {
    for (const h of this.hazards) {
      h.draw(ctx);
    }
  }
}
