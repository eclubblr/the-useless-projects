// ==========================================================================
// ANIMATED HAMMER CURSOR WITH RETRO PARTICLES & SOUND INTEGRATION
// ==========================================================================

import { soundFx } from './sound.js';

export function initHammerCursor() {
  // Graceful fallback for mobile / touch-only devices
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0 && window.innerWidth <= 768);
  if (isTouchDevice) {
    return;
  }

  // Inject styles if not present
  if (!document.getElementById('hammer-cursor-styles')) {
    const style = document.createElement('style');
    style.id = 'hammer-cursor-styles';
    style.textContent = `
      /* Hide system cursor when hammer cursor is active */
      html.hammer-active,
      html.hammer-active * {
        cursor: none !important;
      }

      /* Hammer Container */
      #hammerCursorContainer {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 2147483647;
        will-change: transform;
        opacity: 0;
        transition: opacity 0.15s ease-out;
      }

      #hammerCursorContainer.visible {
        opacity: 1;
      }

      /* Aim / Target Crosshair Dot */
      .hammer-aim-dot {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        margin-top: -4px;
        margin-left: -4px;
        border: 1.5px solid var(--kind-coral, #e76f51);
        border-radius: 50%;
        background: rgba(244, 162, 97, 0.4);
        box-shadow: 0 0 6px rgba(231, 111, 81, 0.8);
        transform-origin: center center;
        transition: transform 0.12s ease-out, border-color 0.12s;
      }

      .hammer-hover .hammer-aim-dot {
        transform: scale(1.6);
        border-color: #ffd166;
        background: rgba(255, 209, 102, 0.6);
        box-shadow: 0 0 10px #ffd166;
      }

      /* Hammer Sprite Wrapper - POV Right-Handed Perspective */
      .hammer-sprite-wrap {
        position: absolute;
        width: 54px;
        height: 50px;
        /* Position striking head right at the aim dot */
        left: -4px;
        top: -30px;
        transform-origin: 85% 88%;
        transform: rotate(8deg);
        transition: transform 0.08s ease-out;
        will-change: transform;
      }

      .hammer-sprite {
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        filter: drop-shadow(-2px 4px 6px rgba(0, 0, 0, 0.65));
      }

      /* Hover state: Hammer raises & winds back (POV wind-up) ready to strike */
      .hammer-hover .hammer-sprite-wrap {
        transform: rotate(26deg) scale(1.1) translate(4px, -5px);
        filter: drop-shadow(0 0 10px rgba(255, 209, 102, 0.8));
      }

      /* Active Click: POV forward & downward hammer smash */
      .hammer-sprite-wrap.striking {
        animation: hammerSmash 0.19s cubic-bezier(0.12, 0.95, 0.2, 1) forwards;
      }

      @keyframes hammerSmash {
        0% {
          transform: rotate(28deg) scale(1.12) translate(5px, -6px);
        }
        38% {
          transform: rotate(-38deg) scale(0.92) translate(-8px, 6px);
        }
        68% {
          transform: rotate(-6deg) scale(1.02) translate(-1px, 1px);
        }
        100% {
          transform: rotate(8deg) scale(1) translate(0, 0);
        }
      }

      /* Impact Shockwave Ring */
      .hammer-shockwave {
        position: fixed;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        margin-left: -8px;
        border-radius: 50%;
        border: 2px solid #ffd166;
        pointer-events: none;
        z-index: 999999;
        animation: shockwaveExpand 0.28s ease-out forwards;
      }

      @keyframes shockwaveExpand {
        0% {
          transform: scale(0.4);
          opacity: 1;
          border-width: 3px;
        }
        100% {
          transform: scale(3.5);
          opacity: 0;
          border-width: 1px;
        }
      }

      /* Flying Pixel Spark Debris */
      .hammer-spark {
        position: fixed;
        width: 6px;
        height: 6px;
        pointer-events: none;
        z-index: 2147483646;
        border-radius: 1px;
        will-change: transform, opacity;
      }

      /* Floating Comic Onomatopoeia */
      .hammer-comic-text {
        position: fixed;
        pointer-events: none;
        z-index: 2147483647;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 0.95rem;
        letter-spacing: 1px;
        text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
        animation: comicFloat 0.38s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
      }

      @keyframes comicFloat {
        0% {
          transform: translate(-50%, -50%) scale(0.5) rotate(-12deg);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -100%) scale(1.2) rotate(6deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -150%) scale(1) rotate(10deg);
          opacity: 0;
        }
      }

      /* Recoil animation for hit targets */
      .hammer-recoil {
        animation: targetSquish 0.15s ease-out !important;
      }

      @keyframes targetSquish {
        0% { transform: scale(0.97) translateY(2px); }
        50% { transform: scale(1.02) translateY(-1px); }
        100% { transform: scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Create cursor container
  let container = document.getElementById('hammerCursorContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'hammerCursorContainer';
    container.innerHTML = `
      <div class="hammer-aim-dot"></div>
      <div class="hammer-sprite-wrap" id="hammerSpriteWrap">
        <img src="src/hammer.png" class="hammer-sprite" alt="Hammer Cursor">
      </div>
    `;
    document.body.appendChild(container);
  }

  const spriteWrap = document.getElementById('hammerSpriteWrap');
  document.documentElement.classList.add('hammer-active');

  let mouseX = -100;
  let mouseY = -100;
  let targetX = -100;
  let targetY = -100;
  let isHovering = false;
  let isStriking = false;
  let isVisible = false;

  const COMIC_WORDS = ['CLANG!', 'CLINK!', 'BONK!', 'WHACK!', 'SMASH!', 'POW!'];
  const SPARK_COLORS = ['#ffd166', '#ffffff', '#e0e6ed', '#4cc9f0', '#f72585', '#ffb703'];

  // Direct zero-latency hardware cursor position update
  let lastTarget = null;

  window.addEventListener('mousemove', (e) => {
    // Instant direct transform - zero input delay
    container.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

    if (!isVisible) {
      isVisible = true;
      container.classList.add('visible');
    }

    // Only compute clickable check when hovered element actually changes
    const target = e.target;
    if (target !== lastTarget) {
      lastTarget = target;
      const clickable = target && !!(
        target.closest('a, button, input, textarea, select, [role="button"], .slot-lever, .stat-box, .card, .matrix-switch')
      );

      if (clickable && !isHovering) {
        isHovering = true;
        container.classList.add('hammer-hover');
      } else if (!clickable && isHovering) {
        isHovering = false;
        container.classList.remove('hammer-hover');
      }
    }
  }, { passive: true });

  // Mouse Leave / Enter window
  document.addEventListener('mouseleave', () => {
    isVisible = false;
    lastTarget = null;
    container.classList.remove('visible');
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    container.classList.add('visible');
  });

  // Spawn visual impact particles
  function spawnImpactEffects(x, y) {
    // 1. Shockwave ring
    const wave = document.createElement('div');
    wave.className = 'hammer-shockwave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 300);

    // 2. Flying pixel sparks
    const count = 7;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'hammer-spark';
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      const size = 3 + Math.random() * 4;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.backgroundColor = color;
      spark.style.boxShadow = `0 0 4px ${color}`;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 25 + Math.random() * 35;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      document.body.appendChild(spark);

      const startTime = performance.now();
      const duration = 250 + Math.random() * 100;

      function animateSpark(now) {
        const elapsed = now - startTime;
        const progress = elapsed / duration;
        if (progress >= 1) {
          spark.remove();
          return;
        }
        const curX = vx * progress;
        const curY = vy * progress + 0.5 * 180 * (progress * progress); // gravity
        spark.style.transform = `translate(${curX}px, ${curY}px) scale(${1 - progress})`;
        spark.style.opacity = `${1 - progress}`;
        requestAnimationFrame(animateSpark);
      }
      requestAnimationFrame(animateSpark);
    }

    // 3. Comic sound word popup
    const comic = document.createElement('div');
    comic.className = 'hammer-comic-text';
    const word = COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];
    const wordColor = SPARK_COLORS[Math.floor(Math.random() * (SPARK_COLORS.length - 1))];
    comic.textContent = word;
    comic.style.color = wordColor;
    comic.style.left = `${x + (Math.random() * 20 - 10)}px`;
    comic.style.top = `${y - 15}px`;
    document.body.appendChild(comic);
    setTimeout(() => comic.remove(), 400);
  }

  // Guaranteed Strike & Sound Trigger on every user click
  let lastStrikeTime = 0;

  const handleHammerStrike = (e) => {
    // Only primary button (left click)
    if (e.button !== undefined && e.button !== 0) return;

    // Throttle micro-duplicate events (e.g., pointerdown + mousedown within 30ms)
    const now = performance.now();
    if (now - lastStrikeTime < 30) return;
    lastStrikeTime = now;

    // 1. Play synthesized metallic hammer hit (always active & unlocked)
    soundFx.playHammerHit();

    // 2. Trigger visual swing animation
    if (spriteWrap) {
      spriteWrap.classList.remove('striking');
      void spriteWrap.offsetWidth;
      spriteWrap.classList.add('striking');
      setTimeout(() => {
        spriteWrap.classList.remove('striking');
      }, 190);
    }

    // 3. Spawn sparks and shockwave at click coordinates
    spawnImpactEffects(e.clientX, e.clientY);

    // 4. Apply squish/recoil to clicked interactive element
    if (e.target && e.target.closest) {
      const clickedEl = e.target.closest('a, button, .card, .btn-primary, .btn-secondary, .btn-forbidden, .matrix-switch, .slot-lever');
      if (clickedEl) {
        clickedEl.classList.remove('hammer-recoil');
        void clickedEl.offsetWidth;
        clickedEl.classList.add('hammer-recoil');
        setTimeout(() => clickedEl.classList.remove('hammer-recoil'), 160);
      }
    }
  };

  // Capture phase ensures events are caught at root even if child elements stop propagation
  window.addEventListener('pointerdown', handleHammerStrike, { capture: true, passive: true });
}
