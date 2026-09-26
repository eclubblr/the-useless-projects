// ==========================================================================
// DYNAMIC RANDOM TEXT COLOR ON HOVER (ULTRA-OPTIMIZED & 120 FPS SMOOTH)
// Zero getComputedStyle(), zero timers, zero layout thrashing, pure CSS transitions
// ==========================================================================

const VIBRANT_PALETTE = [
  '#ff007f', // Electric Pink
  '#00f5d4', // Cyber Teal
  '#fee440', // Laser Yellow
  '#f72585', // Neon Magenta
  '#4cc9f0', // Sky Cyan
  '#7209b7', // Deep Violet
  '#06d6a0', // Mint Green
  '#ff5964', // Coral Red
  '#f77f00', // Blaze Orange
  '#ffbe0b', // Radiant Gold
  '#3a86ff', // Electric Blue
  '#e0aaff', // Lavender Glow
  '#52b788', // Emerald
  '#ff70a6'  // Bubblegum
];

const PALETTE_LEN = VIBRANT_PALETTE.length;

export function initTextColorChaos() {
  // 1. High performance CSS: instant snap on hover (0.04s) and silky smooth native fade-back (0.45s)
  if (!document.getElementById('text-color-chaos-styles')) {
    const style = document.createElement('style');
    style.id = 'text-color-chaos-styles';
    style.textContent = `
      .hover-color-word,
      .hover-text-target {
        display: inline;
        /* Smooth native compositor color fade-back when mouse leaves */
        transition: color 0.45s cubic-bezier(0.2, 0.8, 0.25, 1);
        will-change: color;
      }

      /* Instant snappy color engagement on hover */
      .hover-color-word:hover,
      .hover-text-target:hover {
        transition: color 0.04s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Wrap words in major typographic containers
  const targetContainers = document.querySelectorAll(`
    .hero-title,
    .hero-subtitle,
    .section-title,
    .section-desc,
    .section-tag,
    .stat-label,
    .ticker-content,
    .rule-card h3,
    .rule-card p,
    .footer-brand p,
    .footer-copy,
    .ref-header h1,
    .submit-header h1,
    .guideline-item,
    .category-card h3,
    .category-card p
  `);

  targetContainers.forEach(container => {
    wrapTextNodes(container);
  });

  function wrapTextNodes(element) {
    const ignoreTags = ['SCRIPT', 'STYLE', 'CANVAS', 'INPUT', 'TEXTAREA', 'SELECT', 'SVG', 'BUTTON'];
    if (ignoreTags.includes(element.tagName) || element.classList.contains('hover-color-word')) return;

    const childNodes = Array.from(element.childNodes);
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text && text.trim().length > 0) {
          const frag = document.createDocumentFragment();
          const parts = text.split(/(\s+)/);
          for (const part of parts) {
            if (part.trim().length > 0) {
              const span = document.createElement('span');
              span.className = 'hover-color-word';
              span.textContent = part;
              frag.appendChild(span);
            } else if (part.length > 0) {
              frag.appendChild(document.createTextNode(part));
            }
          }
          node.replaceWith(frag);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        wrapTextNodes(node);
      }
    }
  }

  // Also tag nav items, brand logos, badges, and button text
  document.querySelectorAll('a, button span, .brand-logo span, .badge-gitam, .stat-num').forEach(el => {
    el.classList.add('hover-text-target');
  });

  // 3. Zero-Reflow Event Delegation
  let currentTarget = null;

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || target === currentTarget) return;

    // Direct classList check is 10x faster than .matches(complexSelector)
    const isWord = target.classList.contains('hover-color-word');
    const isTarget = target.classList.contains('hover-text-target');

    if (!isWord && !isTarget) return;

    currentTarget = target;
    // Fast bitwise random index selection
    const randColor = VIBRANT_PALETTE[(Math.random() * PALETTE_LEN) | 0];
    target.style.color = randColor;
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target) return;
    if (target === currentTarget) currentTarget = null;

    const isWord = target.classList.contains('hover-color-word');
    const isTarget = target.classList.contains('hover-text-target');

    if (!isWord && !isTarget) return;

    // Resetting inline color allows native CSS transition to smoothly interpolate
    // back to the original stylesheet color with zero JavaScript timers or reflow!
    target.style.color = '';
  }, { passive: true });
}
