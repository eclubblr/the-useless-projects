// ==========================================================================
// CATASTROPHIC SITE COLLAPSE & GRAVITY VOID ENGINE
// All text, buttons, and elements collapse downward with heavy gravity
// and disappear completely off the page, leaving only the centered Rebuild Button!
// ==========================================================================

import { soundFx } from './sound.js';

export class SiteCollapseEngine {
  constructor() {
    this.isCollapsed = false;
    this.collapsedElements = [];

    // Keyboard shortcut to rebuild (Escape or Ctrl+Z)
    window.addEventListener('keydown', (e) => {
      if (this.isCollapsed && (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        this.rebuildReality();
      }
    });

    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById('collapse-engine-styles')) return;
    const style = document.createElement('style');
    style.id = 'collapse-engine-styles';
    style.textContent = `
      body.reality-collapsed {
        overflow: hidden !important;
        background-color: var(--bg-darker, #001f1b) !important;
      }

      /* Collapsing element animation state */
      .gravity-collapsing {
        will-change: transform, opacity !important;
        pointer-events: none !important;
      }

      /* Centered Rebuild Overlay in the Void */
      #realityEmergencyOverlay {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.7);
        z-index: 500000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        opacity: 0;
        pointer-events: none;
        transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.4s ease;
      }

      #realityEmergencyOverlay.show {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        pointer-events: auto;
      }

      .void-badge {
        font-family: var(--font-mono, monospace);
        font-weight: 800;
        font-size: 1rem;
        background: rgba(0, 0, 0, 0.85);
        color: var(--kind-coral, #ff5964);
        padding: 8px 20px;
        border: 2px solid var(--kind-coral, #ff5964);
        box-shadow: 0 0 20px rgba(221, 115, 110, 0.6);
        border-radius: 6px;
        letter-spacing: 2px;
        text-transform: uppercase;
        animation: warningPulse 1.4s infinite alternate;
      }

      @keyframes warningPulse {
        0% { transform: scale(0.96); opacity: 0.85; }
        100% { transform: scale(1.04); opacity: 1; box-shadow: 0 0 28px rgba(221, 115, 110, 0.9); }
      }

      .btn-rebuild-reality {
        font-family: var(--font-mono, monospace);
        font-weight: 900;
        font-size: 1.35rem;
        background: var(--mellow-yellow, #ffd166);
        color: #000;
        padding: 20px 48px;
        border: 4px solid #000;
        box-shadow: 8px 8px 0px var(--dark-green, #004740), 0 0 35px rgba(255, 209, 102, 0.9);
        cursor: pointer;
        border-radius: 10px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s;
      }

      .btn-rebuild-reality:hover {
        transform: translate(-4px, -4px) scale(1.05);
        box-shadow: 12px 12px 0px var(--kind-coral, #dd736e);
        background: #ffe082;
      }
    `;
    document.head.appendChild(style);
  }

  // Trigger the full gravitational collapse where everything falls down & vanishes
  triggerCollapse() {
    if (this.isCollapsed) return;
    this.isCollapsed = true;

    // 1. Play seismic earth-shattering collapse audio
    soundFx.playExplosionCollapse();

    // 2. Violent screen tremor
    document.body.style.animation = 'screenShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    setTimeout(() => { document.body.style.animation = ''; }, 700);
    document.body.classList.add('reality-collapsed');

    // 3. Select all text, headings, buttons, cards, references, games, ticker, navbar & layout elements
    const rawElements = Array.from(document.querySelectorAll(`
      .ticker-wrap,
      .navbar,
      .hanging-tag-unit,
      .brand-logo,
      .nav-actions,
      main,
      main > section,
      .hero-content,
      .hero-badge,
      .hero-title,
      .hero-subtitle,
      .hero-cta-group,
      .hero-stats-strip,
      .stat-box,
      .references-section,
      .ref-filter-bar,
      .ref-carousel-wrapper,
      .bento-card,
      .games-hub-section,
      .games-grid,
      .game-card,
      .generator-section,
      .slot-machine-console,
      .rules-section,
      .rules-grid,
      .rule-card,
      .submit-container,
      .submit-card,
      .section-header,
      .section-title,
      .section-desc,
      .section-tag,
      .footer,
      .btn-primary,
      .btn-secondary,
      .btn-chaos,
      .btn-forbidden
    `)).filter(el => !el.closest('#realityEmergencyOverlay') && el.id !== 'realityEmergencyOverlay' && el.id !== 'chaosCanvas');

    // Deduplicate elements
    const elementsToCollapse = [...new Set(rawElements)];

    this.collapsedElements = [];
    const vh = window.innerHeight;

    elementsToCollapse.forEach((el) => {
      // Avoid collapsing the rebuild overlay itself
      if (el.closest('#realityEmergencyOverlay')) return;

      const delay = Math.random() * 0.22; // Cascading avalanche delay (0 to 220ms)
      const duration = 0.65 + Math.random() * 0.35; // 650ms to 1000ms fall time
      const dropDistance = vh + 1000 + Math.random() * 400; // Far below the screen viewport
      const xTumble = (Math.random() - 0.5) * 280; // Slight random sideways drift while falling
      const rotTumble = (Math.random() - 0.5) * 75; // Tumbling tilt

      el.classList.add('gravity-collapsing');
      el.style.transition = `transform ${duration}s cubic-bezier(0.55, 0.055, 0.675, 0.19) ${delay}s, opacity ${duration * 0.85}s ease-in ${delay}s`;
      el.style.transform = `translate3d(${xTumble}px, ${dropDistance}px, 0) rotate(${rotTumble}deg)`;
      el.style.opacity = '0';

      this.collapsedElements.push(el);
    });

    // 4. After all elements plummet and disappear off-screen, hide them completely into the void
    setTimeout(() => {
      if (!this.isCollapsed) return;
      this.collapsedElements.forEach(el => {
        el.style.visibility = 'hidden';
      });

      // Absolute void guarantee: ensure all core layout containers are hidden
      const mainEl = document.querySelector('main');
      const navEl = document.querySelector('.navbar');
      const footerEl = document.querySelector('footer');
      const tickerEl = document.querySelector('.ticker-wrap');
      if (mainEl) mainEl.style.visibility = 'hidden';
      if (navEl) navEl.style.visibility = 'hidden';
      if (footerEl) footerEl.style.visibility = 'hidden';
      if (tickerEl) tickerEl.style.visibility = 'hidden';

      // Show the Rebuild Button centered in the empty void
      this.showRebuildWidget();
    }, 950);
  }

  showRebuildWidget() {
    let overlay = document.getElementById('realityEmergencyOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'realityEmergencyOverlay';
      overlay.innerHTML = `
        <div class="void-badge">⚠️ EVERYTHING COLLAPSED INTO THE VOID</div>
        <button id="rebuildRealityBtn" class="btn-rebuild-reality">
          <span>🛠️ REBUILD SITE</span>
        </button>
      `;
      document.body.appendChild(overlay);

      const btn = overlay.querySelector('#rebuildRealityBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          this.rebuildReality();
        });
      }
    }

    setTimeout(() => {
      overlay.classList.add('show');
    }, 150);
  }

  // Restore everything back from the void into its exact original position
  rebuildReality() {
    if (!this.isCollapsed) return;

    // 1. Play reverse-time sci-fi rewind sound
    soundFx.playRebuildRewind();

    // 2. Hide the centered rebuild overlay
    const overlay = document.getElementById('realityEmergencyOverlay');
    if (overlay) {
      overlay.classList.remove('show');
    }

    // Unhide core layout containers
    const mainEl = document.querySelector('main');
    const navEl = document.querySelector('.navbar');
    const footerEl = document.querySelector('footer');
    const tickerEl = document.querySelector('.ticker-wrap');
    if (mainEl) mainEl.style.visibility = '';
    if (navEl) navEl.style.visibility = '';
    if (footerEl) footerEl.style.visibility = '';
    if (tickerEl) tickerEl.style.visibility = '';

    // 3. Make all elements visible again and animate them back up into place
    this.collapsedElements.forEach((el, index) => {
      el.style.visibility = 'visible';
      const delay = (index % 12) * 0.025; // Smooth upward cascade
      el.style.transition = `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.5s ease-out ${delay}s`;
      el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      el.style.opacity = '1';
    });

    // 4. Clean up all inline styles after reconstruction finishes
    setTimeout(() => {
      this.collapsedElements.forEach(el => {
        el.classList.remove('gravity-collapsing');
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.visibility = '';
      });
      this.collapsedElements = [];
      document.body.classList.remove('reality-collapsed');
      this.isCollapsed = false;
    }, 950);
  }
}

export const siteCollapse = new SiteCollapseEngine();
