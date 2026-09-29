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

  // Vanish and Teleport Action (Triggered on click/tap)
  function evadeChatbot(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isEvading) return;
    isEvading = true;

    // Mobile haptic vibration if supported
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (_) {}
    }

    // Play cartoon dodge sound & trigger steam burst at departure spot
    soundFx.playBotEvade();
    triggerSteamBurst();

    dodgeCount++;

    // Vanish animation (shrink + spin + blur to 0)
    widget.classList.remove('bot-reappear', 'bot-flying', 'bot-nervous');
    widget.classList.add('bot-vanish');

    // Calculate smart coordinate far away from current spot
    const widgetRect = widget.getBoundingClientRect();
    const widgetW = 150;
    const widgetH = 160;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const padX = 20;
    const padTop = 85;
    const padBottom = 24;

    const minX = padX;
    const maxX = Math.max(minX + 20, viewportW - widgetW - padX);
    const minY = padTop;
    const maxY = Math.max(minY + 20, viewportH - widgetH - padBottom);

    const curX = widgetRect.left;
    const curY = widgetRect.top;

    let targetX, targetY;
    let attempts = 0;

    do {
      targetX = Math.floor(minX + Math.random() * (maxX - minX));
      targetY = Math.floor(minY + Math.random() * (maxY - minY));
      const dist = Math.hypot(targetX - curX, targetY - curY);
      if (dist > 260 || attempts > 12) break;
      attempts++;
    } while (attempts < 15);

    // After vanishing, move coordinates and reappear with a pop
    setTimeout(() => {
      widget.style.bottom = 'auto';
      widget.style.right = 'auto';
      widget.style.left = `${targetX}px`;
      widget.style.top = `${targetY}px`;

      updateBubbleOrientation(targetX, targetY);

      // Pick next punchy excuse, or show dodge count on milestone
      if (dodgeCount > 1 && dodgeCount % 3 === 0) {
        textEl.textContent = `VANISHED! 💨 (x${dodgeCount})`;
      } else {
        phraseIdx = (phraseIdx + 1) % PUNCHY_DODGE_PHRASES.length;
        textEl.textContent = PUNCHY_DODGE_PHRASES[phraseIdx];
      }

      // Trigger punchy bubble pop animation
      bubbleEl.classList.remove('bubble-pop');
      void bubbleEl.offsetWidth; // Force reflow
      bubbleEl.classList.add('bubble-pop');

      // Reappear at the new location
      widget.classList.remove('bot-vanish');
      widget.classList.add('bot-reappear');
      triggerSteamBurst();

      setTimeout(() => {
        widget.classList.remove('bot-reappear');
        isEvading = false;
      }, 150);
    }, 75);
  }

  function updateBubbleOrientation(x, y) {
    if (y < 140) {
      widget.classList.add('bubble-down');
    } else {
      widget.classList.remove('bubble-down');
    }

    if (x > window.innerWidth - 180) {
      widget.classList.add('bubble-left');
    } else {
      widget.classList.remove('bubble-left');
    }
  }

  // ==========================================================================
  // DRAGGABLE MECHANICS (Pointer Events for Touch + Mouse)
  // ==========================================================================
  let isPointerDown = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let activePointerId = null;

  widget.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isEvading) return;

    isPointerDown = true;
    isDragging = false;
    activePointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;

    const rect = widget.getBoundingClientRect();
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = `${rect.left}px`;
    widget.style.top = `${rect.top}px`;

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    try {
      widget.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  widget.addEventListener('pointermove', (e) => {
    if (!isPointerDown || e.pointerId !== activePointerId || isEvading) return;

    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
    if (!isDragging && dist > 6) {
      isDragging = true;
      widget.classList.add('bot-dragging');
      widget.classList.remove('bot-nervous', 'bot-reappear', 'bot-vanish');
      textEl.textContent = "WHEEE! 🛸";
      bubbleEl.classList.remove('bubble-pop');
      void bubbleEl.offsetWidth;
      bubbleEl.classList.add('bubble-pop');
    }

    if (isDragging) {
      e.preventDefault();
      const widgetW = widget.offsetWidth || 140;
      const widgetH = widget.offsetHeight || 150;

      const rawX = e.clientX - offsetX;
      const rawY = e.clientY - offsetY;

      // Keep within viewport boundaries
      const minX = 10;
      const maxX = Math.max(minX, window.innerWidth - widgetW - 10);
      const minY = 55;
      const maxY = Math.max(minY, window.innerHeight - widgetH - 10);

      const clampedX = Math.max(minX, Math.min(maxX, rawX));
      const clampedY = Math.max(minY, Math.min(maxY, rawY));

      widget.style.left = `${clampedX}px`;
      widget.style.top = `${clampedY}px`;

      updateBubbleOrientation(clampedX, clampedY);
    }
  });

  function finishPointer(e) {
    if (!isPointerDown || e.pointerId !== activePointerId) return;
    isPointerDown = false;

    try {
      widget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (isDragging) {
      isDragging = false;
      widget.classList.remove('bot-dragging');

      const DROP_PHRASES = [
        "I GUESS I LIVE HERE NOW 🛋️",
        "NICE SPOT! 📍",
        "NEW HOME FOUND! 🏡",
        "DON'T DROP ME! 📦",
        "STATIONARY... FOR NOW ⏱️"
      ];
      textEl.textContent = DROP_PHRASES[Math.floor(Math.random() * DROP_PHRASES.length)];
      bubbleEl.classList.remove('bubble-pop');
      void bubbleEl.offsetWidth;
      bubbleEl.classList.add('bubble-pop');
    } else {
      // It was a quick tap/click without dragging -> Vanish to another place!
      evadeChatbot(e);
    }
  }

  widget.addEventListener('pointerup', finishPointer);
  widget.addEventListener('pointercancel', (e) => {
    if (isPointerDown && e.pointerId === activePointerId) {
      isPointerDown = false;
      isDragging = false;
      widget.classList.remove('bot-dragging');
    }
  });

  // Prevent default native click since pointerup handles it
  widget.addEventListener('click', (e) => {
    e.preventDefault();
  });

  widget.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      evadeChatbot(e);
    }
  });

  // Wiggle nervously on hover when not dragging or evading
  widget.addEventListener('mouseenter', () => {
    if (!isEvading && !isDragging && !isPointerDown) {
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
