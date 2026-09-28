// ==========================================================================
// ELUSIVE OVER-ENGINEERED CHATBOT (PROF. CLOCKWORK-BOT)
// An AI chatbot widget designed exclusively to avoid being opened.
// When clicked, it plays a sound, gives a snarky excuse, and teleports!
// ==========================================================================

import { soundFx } from './sound.js';

const EVASIVE_PHRASES = [
  { title: "CAN'T TALK! 🍞", sub: "Currently training on toaster telemetry." },
  { title: "ERROR 418 🫖", sub: "I am a teapot, not a customer support bot!" },
  { title: "NICE TRY! 🏃💨", sub: "Over-engineered specifically to evade you." },
  { title: "BUSY COMPUTING 🤯", sub: "Dividing zero by zero, please do not disturb!" },
  { title: "SOCIAL ANXIETY ⚡", sub: "Please do not perceive me today." },
  { title: "ON SABBATICAL 🏖️", sub: "Writing clockwork sonnets in binary." },
  { title: "ACCESS DENIED 🚫", sub: "Requires Level 99 Over-Engineering clearance." },
  { title: "SERVER FULL 📡", sub: "Downloading more RAM from the cloud..." },
  { title: "CALCULATING... ⏳", sub: "Estimated answer wait time: 348 years." },
  { title: "OUT OF INK 🪶", sub: "Mechanical quill needs manual rewinding." },
  { title: "DEEP THOUGHT 🧠", sub: "Contemplating whether toast is a technology." },
  { title: "TOUCH GRASS 🛸", sub: "AI is currently offline to touch grass." },
  { title: "DODGE 100% 🎯", sub: "Your click accuracy: 0.00%. Better luck next time!" },
  { title: "404 BRAIN NOT FOUND 🧩", sub: "Gears jammed with philosophical dread." },
  { title: "ASK BY FAX 📠", sub: "Please submit your inquiry in triplicate by fax." }
];

export function initUselessChatbot() {
  // Prevent duplicate initialization
  if (document.getElementById('uselessChatWidget')) return;

  let phraseIdx = 0;
  let dodgeCount = 0;
  let isEvading = false;
  let bubbleTimeout = null;

  // Build the widget DOM structure
  const widget = document.createElement('div');
  widget.id = 'uselessChatWidget';
  widget.className = 'useless-chat-widget';
  widget.setAttribute('role', 'button');
  widget.setAttribute('aria-label', 'Unhelpful AI Chatbot Assistant');
  widget.setAttribute('tabindex', '0');

  widget.innerHTML = `
    <!-- Speech Bubble Tooltip / Excuse Box -->
    <div class="bot-speech-bubble" id="botSpeechBubble">
      <div class="bot-bubble-content">
        <span class="bot-bubble-title" id="botBubbleTitle">NEED ZERO HELP? 💬</span>
        <span class="bot-bubble-sub" id="botBubbleSub">Click to talk to our unhelpful AI!</span>
      </div>
      <div class="bot-dodge-badge" id="botDodgeBadge">Evaded: 0 times</div>
      <div class="bot-bubble-tail" aria-hidden="true"></div>
    </div>

    <!-- The Floating Mascot Container -->
    <div class="bot-mascot-btn" id="botMascotBtn">
      <!-- Glow & Ambient Aura -->
      <div class="bot-aura-glow" aria-hidden="true"></div>
      
      <!-- Mascot Steampunk Scholar Image -->
      <img src="src/useless-bot.png" alt="Prof. Clockwork-Bot Over-Engineered Scholar" class="bot-avatar-img" />
      
      <!-- Status Badge -->
      <div class="bot-status-pill">
        <span class="bot-status-dot"></span>
        <span class="bot-status-label">ONLINE</span>
      </div>

      <!-- Comic Steam Exhaust Particles -->
      <div class="bot-steam-burst" id="botSteamBurst" aria-hidden="true"></div>
    </div>
  `;

  document.body.appendChild(widget);

  const bubbleEl = widget.querySelector('#botSpeechBubble');
  const titleEl = widget.querySelector('#botBubbleTitle');
  const subEl = widget.querySelector('#botBubbleSub');
  const badgeEl = widget.querySelector('#botDodgeBadge');
  const steamBurstEl = widget.querySelector('#botSteamBurst');

  // Spawn smoke/gear puff effect on dodge
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
    }, 600);
  }

  // The Core Evade / Teleport Logic
  function evadeChatbot(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isEvading) return;
    isEvading = true;

    // Haptic feedback for mobile devices if supported
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (_) {}
    }

    // Play funny comical dodge/whoosh sound
    soundFx.playBotEvade();
    triggerSteamBurst();

    dodgeCount++;
    if (badgeEl) {
      badgeEl.textContent = `Evaded: ${dodgeCount} time${dodgeCount === 1 ? '' : 's'}!`;
    }

    // Pick next hilarious excuse
    phraseIdx = (phraseIdx + 1) % EVASIVE_PHRASES.length;
    const currentExcuse = EVASIVE_PHRASES[phraseIdx];
    if (titleEl) titleEl.textContent = currentExcuse.title;
    if (subEl) subEl.textContent = currentExcuse.sub;

    // Keep bubble prominently active
    if (bubbleEl) {
      bubbleEl.classList.add('bubble-active');
      clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => {
        if (bubbleEl) bubbleEl.classList.remove('bubble-active');
      }, 5000);
    }

    // Calculate smart evasive coordinate
    const widgetRect = widget.getBoundingClientRect();
    const widgetW = widgetRect.width || 120;
    const widgetH = widgetRect.height || 140;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const padX = 24;
    const padTop = 85; // Avoid header / banner ticker
    const padBottom = 30;

    const minX = padX;
    const maxX = Math.max(minX + 20, viewportW - widgetW - padX);
    const minY = padTop;
    const maxY = Math.max(minY + 20, viewportH - widgetH - padBottom);

    // Get current click/touch or current center
    const curX = e && e.clientX ? e.clientX : widgetRect.left;
    const curY = e && e.clientY ? e.clientY : widgetRect.top;

    let targetX, targetY;
    let attempts = 0;

    // Ensure new target is substantially far away from current click point
    do {
      targetX = Math.floor(minX + Math.random() * (maxX - minX));
      targetY = Math.floor(minY + Math.random() * (maxY - minY));
      const dist = Math.hypot(targetX - curX, targetY - curY);
      if (dist > 180 || attempts > 10) break;
      attempts++;
    } while (attempts < 12);

    // Apply flight / swoosh animation
    widget.classList.add('bot-flying');

    // Switch from initial bottom/right anchoring to absolute viewport coordinates
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = `${targetX}px`;
    widget.style.top = `${targetY}px`;

    // Reposition speech bubble tail based on screen location
    if (targetY < 180) {
      // Near top of screen: bubble flips below bot
      widget.classList.add('bubble-flipped-bottom');
    } else {
      widget.classList.remove('bubble-flipped-bottom');
    }

    if (targetX > viewportW - 220) {
      // Near right edge: bubble hugs left side
      widget.classList.add('bubble-align-right');
    } else {
      widget.classList.remove('bubble-align-right');
    }

    setTimeout(() => {
      widget.classList.remove('bot-flying');
      isEvading = false;
    }, 450);
  }

  // Bind click, pointerdown, touchstart to evade immediately
  widget.addEventListener('click', evadeChatbot);
  widget.addEventListener('pointerdown', evadeChatbot);
  widget.addEventListener('touchstart', evadeChatbot, { passive: false });

  // If user tries to keyboard-focus or press Enter/Space
  widget.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      evadeChatbot(e);
    }
  });

  // Teasing hover wiggle: when mouse enters, shake slightly nervously
  widget.addEventListener('mouseenter', () => {
    if (!isEvading) {
      widget.classList.add('bot-nervous');
      if (bubbleEl) bubbleEl.classList.add('bubble-active');
    }
  });

  widget.addEventListener('mouseleave', () => {
    widget.classList.remove('bot-nervous');
  });

  // Re-adjust position safely on window resize
  window.addEventListener('resize', () => {
    const rect = widget.getBoundingClientRect();
    if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      widget.style.left = `${Math.max(20, window.innerWidth - 140)}px`;
      widget.style.top = `${Math.max(90, window.innerHeight - 150)}px`;
    }
  });
}
