// ==========================================================================
// ELUSIVE OVER-ENGINEERED CHATBOT ICON (PROF. CLOCKWORK-BOT)
// A prominent floating mascot designed to run away whenever clicked.
// ==========================================================================

import { soundFx } from './sound.js';

const PUNCHY_DODGE_PHRASES = [
  "NOPE! 🏃💨",
  "CAN'T TALK! 🍞",
  "ERROR 418: 🫖",
  "NO CHAT, ONLY VIBES! 🙅‍♂️",
  "DON'T TOUCH ME! ⚡",
  "BUSY OVERTHINKING! 🤯",
  "ON SABBATICAL 🏖️",
  "ACCESS DENIED 🚫",
  "WAIT 348 YEARS ⏳",
  "DOWNLOADING RAM 📡",
  "I'M OUT OF INK! 🪶",
  "TOUCHING GRASS 🛸",
  "SUBMIT VIA FAX 📠",
  "GEARS JAMMED! ⚙️",
  "ACCURACY: 0.00% 🎯"
];

export function initUselessChatbot() {
  if (document.getElementById('uselessChatWidget')) return;

  let phraseIdx = 0;
  let dodgeCount = 0;
  let isEvading = false;

  // Build the floating mascot chatbot widget
  const widget = document.createElement('div');
  widget.id = 'uselessChatWidget';
  widget.className = 'useless-chat-widget';
  widget.setAttribute('role', 'button');
  widget.setAttribute('aria-label', 'Ask Useless AI Assistant');
  widget.setAttribute('tabindex', '0');

  widget.innerHTML = `
    <!-- Compact Comic Speech Bubble (Small, punchy, proportional) -->
    <div class="bot-speech-bubble" id="botSpeechBubble">
      <span class="bot-bubble-text" id="botBubbleText">CAN'T HELP! 💬</span>
      <div class="bot-bubble-tail" aria-hidden="true"></div>
    </div>

    <!-- The Floating Mascot Character Container (Large & Detailed) -->
    <div class="bot-character-container" id="botFabButton">
      <!-- Glow Aura Behind Mascot -->
      <div class="bot-character-glow" aria-hidden="true"></div>

      <!-- Transparent Steampunk Mascot Image -->
      <img src="src/useless-bot.png" alt="Prof. Clockwork-Bot" class="bot-avatar-img" />

      <!-- Mini Status Badge -->
      <div class="bot-mini-badge" title="AI Status: Avoiding You">
        <span class="bot-badge-dot"></span>
        <span class="bot-badge-txt">AI</span>
      </div>

      <!-- Steam Exhaust Particles -->
      <div class="bot-steam-burst" id="botSteamBurst" aria-hidden="true"></div>
    </div>
  `;

  document.body.appendChild(widget);

  const bubbleEl = widget.querySelector('#botSpeechBubble');
  const textEl = widget.querySelector('#botBubbleText');
  const steamBurstEl = widget.querySelector('#botSteamBurst');

  // Spawn smoke/steam puff on dodge
  function triggerSteamBurst() {
    if (!steamBurstEl) return;
    steamBurstEl.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const puff = document.createElement('span');
      puff.className = `steam-dot steam-${i + 1}`;
      puff.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
      puff.style.setProperty('--dy', `${(Math.random() - 0.5) * 60}px`);
      steamBurstEl.appendChild(puff);
    }
    setTimeout(() => {
      if (steamBurstEl) steamBurstEl.innerHTML = '';
    }, 550);
  }

  // The Teleport / Evade Action
  function evadeChatbot(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isEvading) return;
    isEvading = true;

    // Mobile haptic vibration if supported
    if (navigator.vibrate) {
      try { navigator.vibrate(30); } catch (_) {}
    }

    // Play synthesized cartoon dodge sound
    soundFx.playBotEvade();
    triggerSteamBurst();

    dodgeCount++;

    // Pick next punchy excuse, or show dodge count on milestone
    if (dodgeCount > 1 && dodgeCount % 3 === 0) {
      textEl.textContent = `DODGED! 💨 (x${dodgeCount})`;
    } else {
      phraseIdx = (phraseIdx + 1) % PUNCHY_DODGE_PHRASES.length;
      textEl.textContent = PUNCHY_DODGE_PHRASES[phraseIdx];
    }

    // Trigger punchy bubble pop animation
    bubbleEl.classList.remove('bubble-pop');
    void bubbleEl.offsetWidth; // Force CSS reflow
    bubbleEl.classList.add('bubble-pop');

    // Calculate smart coordinate far away from click/cursor
    const widgetRect = widget.getBoundingClientRect();
    const widgetW = 160;
    const widgetH = 170;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const padX = 20;
    const padTop = 85;
    const padBottom = 24;

    const minX = padX;
    const maxX = Math.max(minX + 20, viewportW - widgetW - padX);
    const minY = padTop;
    const maxY = Math.max(minY + 20, viewportH - widgetH - padBottom);

    const curX = e && e.clientX ? e.clientX : widgetRect.left;
    const curY = e && e.clientY ? e.clientY : widgetRect.top;

    let targetX, targetY;
    let attempts = 0;

    do {
      targetX = Math.floor(minX + Math.random() * (maxX - minX));
      targetY = Math.floor(minY + Math.random() * (maxY - minY));
      const dist = Math.hypot(targetX - curX, targetY - curY);
      if (dist > 200 || attempts > 10) break;
      attempts++;
    } while (attempts < 12);

    // Apply flight swoop
    widget.classList.add('bot-flying');

    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = `${targetX}px`;
    widget.style.top = `${targetY}px`;

    // Adjust speech bubble orientation if near top or right edge
    if (targetY < 140) {
      widget.classList.add('bubble-down');
    } else {
      widget.classList.remove('bubble-down');
    }

    if (targetX > viewportW - 180) {
      widget.classList.add('bubble-left');
    } else {
      widget.classList.remove('bubble-left');
    }

    setTimeout(() => {
      widget.classList.remove('bot-flying');
      isEvading = false;
    }, 420);
  }

  // Intercept click, touch, and enter keys to dodge immediately
  widget.addEventListener('click', evadeChatbot);
  widget.addEventListener('pointerdown', evadeChatbot);
  widget.addEventListener('touchstart', evadeChatbot, { passive: false });

  widget.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      evadeChatbot(e);
    }
  });

  // Wiggle nervously on hover
  widget.addEventListener('mouseenter', () => {
    if (!isEvading) {
      widget.classList.add('bot-nervous');
      textEl.textContent = "DON'T CLICK ME! ⚡";
      bubbleEl.classList.remove('bubble-pop');
      void bubbleEl.offsetWidth;
      bubbleEl.classList.add('bubble-pop');
    }
  });

  widget.addEventListener('mouseleave', () => {
    widget.classList.remove('bot-nervous');
  });

  // Safe reposition on window resize
  window.addEventListener('resize', () => {
    const rect = widget.getBoundingClientRect();
    if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      widget.style.left = `${Math.max(16, window.innerWidth - 180)}px`;
      widget.style.top = `${Math.max(85, window.innerHeight - 190)}px`;
    }
  });
}
