// ==========================================================================
// CHAOS & PHYSICS ENGINE OVERLAY (SLOW RANDOM DRIFT & HIGH PERFORMANCE)
// ==========================================================================

export class ChaosEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.active = false;
    this.items = [];
    this.animating = false;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.spawnTimer = 0;
    this.emojis = ['🐤', '📎', '💾', ';', '🍌', '🧦', '⚡', '💣', '💩'];
    this.emojiBitmaps = {};
    this.MAX_ITEMS = 50;

    if (this.canvas) {
      this.resize();
      this.initEmojiCache();
      window.addEventListener('resize', () => this.resize(), { passive: true });
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }, { passive: true });
    }
  }

  // Pre-render larger emojis once to 128x128 offscreen canvases for crisp GPU drawImage()
  initEmojiCache() {
    const size = 128;
    this.emojis.forEach((emoji) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const oCtx = offscreen.getContext('2d');
      oCtx.font = '86px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillText(emoji, size / 2, size / 2 + 4);
      this.emojiBitmaps[emoji] = offscreen;
    });
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  toggleChaos() {
    this.active = !this.active;
    if (this.active) {
      this.spawnTimer = 0;
      this.spawnBatch(14);
      this.startLoop();
    } else {
      this.items = [];
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.active;
  }

  // Spawn an individual floating emoji with random sway & slow fall dynamics
  createItem(x, y, vyOverride = null, vxOverride = null) {
    // Bigger, chunkier emoji size (54px to 80px)
    const size = 54 + Math.random() * 26;
    return {
      x: x,
      y: y,
      vx: vxOverride !== null ? vxOverride : (Math.random() - 0.5) * 4,
      vy: vyOverride !== null ? vyOverride : (0.4 + Math.random() * 1.0),
      gravity: 0.04 + Math.random() * 0.04, // Very gentle, floating gravity
      maxFallSpeed: 1.4 + Math.random() * 1.6, // Slow drifting terminal velocity
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.035,
      swayAmp: 0.9 + Math.random() * 1.8,
      bounce: 0.35 + Math.random() * 0.2, // Soft, cushiony bounce
      size: size,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.04, // Gentle tumbling
      emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
      settledFrames: 0,
      opacity: 1
    };
  }

  spawnBatch(count = 12, originX = null, originY = null) {
    while (this.items.length + count > this.MAX_ITEMS && this.items.length > 0) {
      this.items.shift();
    }

    for (let i = 0; i < count; i++) {
      const x = originX !== null ? originX : Math.random() * (this.canvas.width - 100) + 50;
      const y = originY !== null ? originY : -60 - Math.random() * 250;
      const vx = originX !== null ? (Math.random() - 0.5) * 14 : null;
      const vy = originY !== null ? (Math.random() - 0.5) * 10 - 4 : null;
      this.items.push(this.createItem(x, y, vy, vx));
    }
  }

  explodeAt(x, y) {
    this.active = true;
    this.spawnBatch(18, x, y);
    this.startLoop();
  }

  startLoop() {
    if (this.animating) return;
    this.animating = true;
    this.loop();
  }

  loop() {
    if (!this.ctx) {
      this.animating = false;
      return;
    }

    if (!this.active && this.items.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animating = false;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const canvasH = this.canvas.height;
    const canvasW = this.canvas.width;

    // Continuous gentle random rain while Chaos Mode is active
    if (this.active) {
      this.spawnTimer++;
      if (this.spawnTimer % 28 === 0 && this.items.length < this.MAX_ITEMS) {
        const x = Math.random() * (canvasW - 120) + 60;
        this.items.push(this.createItem(x, -70));
      }
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];

      // Slow random horizontal sway (like a feather or balloon drifting)
      item.swayPhase += item.swaySpeed;
      const swayForce = Math.sin(item.swayPhase) * item.swayAmp;

      // Physics integration with slow terminal velocity
      item.vy += item.gravity;
      if (item.vy > item.maxFallSpeed) {
        item.vy = item.maxFallSpeed;
      }

      item.x += item.vx + swayForce;
      item.y += item.vy;
      item.rotation += item.vRot;
      item.vx *= 0.97; // Gentle air damping

      // Playful Hammer Repulsion (swatting floating emojis like beach balls)
      const dx = item.x - this.mouseX;
      const dy = item.y - this.mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 14400 && distSq > 1) { // 120px interaction radius
        const dist = Math.sqrt(distSq);
        const force = (120 - dist) / 120;
        item.vx += (dx / dist) * force * 5.5;
        item.vy += (dy / dist) * force * 5.0;
        item.settledFrames = 0;
      }

      // Ground landing
      if (item.y + item.size / 2 >= canvasH) {
        item.y = canvasH - item.size / 2;
        item.vy = -item.vy * item.bounce;
        item.vx *= 0.82;
        item.vRot *= 0.82;

        if (Math.abs(item.vy) < 0.4) item.vy = 0;
        if (Math.abs(item.vx) < 0.2) item.vx = 0;
      }

      // Wall boundaries
      if (item.x - item.size / 2 <= 10) {
        item.x = item.size / 2 + 10;
        item.vx = -item.vx * 0.7;
      } else if (item.x + item.size / 2 >= canvasW - 10) {
        item.x = canvasW - item.size / 2 - 10;
        item.vx = -item.vx * 0.7;
      }

      // Resting auto-cleanup after ~4 seconds
      if (Math.abs(item.vy) < 0.1 && Math.abs(item.vx) < 0.1 && item.y >= canvasH - item.size) {
        item.settledFrames++;
        if (item.settledFrames > 220) {
          item.opacity -= 0.02;
          if (item.opacity <= 0) {
            this.items.splice(i, 1);
            continue;
          }
        }
      }

      // Render high-res cached emoji bitmap
      const bmp = this.emojiBitmaps[item.emoji];
      if (bmp) {
        this.ctx.save();
        if (item.opacity < 1) {
          this.ctx.globalAlpha = item.opacity;
        }
        this.ctx.translate(item.x, item.y);
        this.ctx.rotate(item.rotation);
        const half = item.size / 2;
        this.ctx.drawImage(bmp, -half, -half, item.size, item.size);
        this.ctx.restore();
      }
    }

    if (this.active || this.items.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animating = false;
    }
  }
}
