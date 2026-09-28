// ==========================================================================
// MAIN APPLICATION CONTROLLER (FRONTEND + BACKEND INTEGRATION)
// ==========================================================================

import { soundFx } from './sound.js';
import { slotSubjects, slotObjects, slotActions, judgesList } from './ideas.js';
import { ChaosEngine } from './chaos.js';
import { initMiniGames } from './games.js';
import { initHammerCursor } from './hammerCursor.js';
import { initTextColorChaos } from './textColorChaos.js';
import { siteCollapse } from './siteCollapse.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize animated hammer cursor with sound and swing physics
  initHammerCursor();

  // Initialize dynamic random text color shift on hover
  initTextColorChaos();

  const chaos = new ChaosEngine('chaosCanvas');

  // Initialize mini-games if present
  initMiniGames();

  // --------------------------------------------------
  // 1. BACKEND API INTEGRATION & SHOWCASE RENDERING
  // --------------------------------------------------
  const showcaseGrid = document.getElementById('showcaseGrid');

  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn('Backend API offline or unreachable, fallback mode enabled.');
    }
    return [
      {
        id: 'sub_101',
        title: 'Solar-Powered Flashlight 🔦',
        team: 'SunHater99',
        category: 'Hardware Chaos',
        desc: 'A high-intensity flashlight powered exclusively by solar panels mounted on top. Only operates under direct sunlight at noon!',
        rating: 999,
        upvotes: 1420
      },
      {
        id: 'sub_102',
        title: 'Snooze-Resignation Bot ⏰💣',
        team: 'SleepyCoder',
        category: 'Over-Engineered AI',
        desc: 'An alarm clock synced to your email. Hitting snooze twice automatically drafts and sends a resignation letter to your employer.',
        rating: 100,
        upvotes: 3890
      }
    ];
  }

  async function renderShowcase() {
    if (!showcaseGrid) return;
    const projects = await fetchSubmissions();

    showcaseGrid.innerHTML = projects.map(p => `
      <div class="showcase-card">
        <div>
          <div class="card-top">
            <span class="card-tag">${p.category || 'HARDWARE TRASH'}</span>
            <span class="card-rating">${p.rating || 100}% USELESS</span>
          </div>
          <h3 class="card-name">${p.title}</h3>
          <p class="card-desc">${p.desc}</p>
        </div>
        <div class="card-footer">
          <span class="card-author">By @${p.team}</span>
          <button class="btn-upvote" data-id="${p.id}">
            🔥 <span class="upvote-count">${p.upvotes || 1}</span>
          </button>
        </div>
      </div>
    `).join('');

    // Wire up real backend upvote buttons
    showcaseGrid.querySelectorAll('.btn-upvote').forEach(btn => {
      btn.addEventListener('click', async () => {
        soundFx.playClick(800, 0.04);
        const id = btn.dataset.id;
        const countSpan = btn.querySelector('.upvote-count');
        let currentCount = parseInt(countSpan.textContent, 10);
        countSpan.textContent = currentCount + 1;

        try {
          await fetch(`/api/submissions/${id}/upvote`, { method: 'POST' });
        } catch (e) {}

        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);
      });
    });
  }

  renderShowcase();

  // --------------------------------------------------
  // 2. SOUND TOGGLE & CHAOS MODE CONTROLLER
  // --------------------------------------------------
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = soundFx.toggleMute();
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) soundFx.playClick(700);
    });
  }

  const chaosToggleBtn = document.getElementById('chaosToggleBtn');
  const mobileChaosBtn = document.getElementById('mobileChaosBtn');

  function handleChaosToggle() {
    const isActive = chaos.toggleChaos();
    soundFx.playSiren();
    const bg = isActive ? 'var(--kind-coral)' : 'var(--mellow-yellow)';
    if (chaosToggleBtn) {
      chaosToggleBtn.style.background = bg;
      chaosToggleBtn.style.color = '#000';
    }
    if (mobileChaosBtn) {
      mobileChaosBtn.style.background = bg;
      mobileChaosBtn.style.color = '#000';
    }
  }

  if (chaosToggleBtn) chaosToggleBtn.addEventListener('click', handleChaosToggle);
  if (mobileChaosBtn) mobileChaosBtn.addEventListener('click', handleChaosToggle);

  // Mobile Menu Drawer Controller
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      soundFx.playClick(isOpen ? 850 : 500);
    });

    // Close when clicking any nav link
    mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (!mobileNavDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        if (mobileNavDrawer.classList.contains('open')) {
          mobileNavDrawer.classList.remove('open');
          mobileMenuBtn.classList.remove('active');
        }
      }
    });
  }

  // Retractable hanging ropes when scrolling past hero
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      document.body.classList.add('scrolled-down');
    } else {
      document.body.classList.remove('scrolled-down');
    }
  }, { passive: true });

  // --------------------------------------------------
  // BENTO CAROUSEL & CAMPUS IDEAS CONTROLLER
  // --------------------------------------------------
  const refCarouselTrack = document.getElementById('refCarouselTrack');
  const carouselViewport = document.querySelector('.ref-carousel-viewport');
  const refPrevBtn = document.getElementById('refPrevBtn');
  const refNextBtn = document.getElementById('refNextBtn');
  const refCounter = document.getElementById('refCounter');
  const dotBtns = document.querySelectorAll('.carousel-indicators .dot-btn');
  const tabBtns = document.querySelectorAll('.ref-filter-bar .ref-tab-btn');
  const slides = document.querySelectorAll('.ref-carousel-slide');

  const DRIVE_PROJECTS_URL = 'https://drive.google.com/file/d/1ZyYM88FG7usQgE7jokoCNcF3-XBQQD3W/view?usp=sharing';

  let currentSlide = 0;
  const totalSlides = slides.length || 3;

  function updateCarouselHeight() {
    const activeSlide = slides[currentSlide];
    if (activeSlide && carouselViewport) {
      const slideHeight = activeSlide.offsetHeight;
      if (slideHeight > 0) {
        carouselViewport.style.height = `${slideHeight}px`;
      }
    }
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlide = index;

    if (refCarouselTrack) {
      refCarouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (refCounter) {
      refCounter.textContent = `SLIDE 0${currentSlide + 1} / 0${totalSlides}`;
    }

    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    if (refPrevBtn) refPrevBtn.disabled = currentSlide === 0;

    // Last slide (Slide 3/3): morph button into MORE IDEAS link!
    if (refNextBtn) {
      if (currentSlide === totalSlides - 1) {
        refNextBtn.disabled = false;
        refNextBtn.innerHTML = 'MORE IDEAS 📂 ↗';
        refNextBtn.title = 'Open More Projects in Google Drive';
        refNextBtn.classList.add('btn-more-ideas-nav');
      } else {
        refNextBtn.disabled = false;
        refNextBtn.innerHTML = 'NEXT SLIDE →';
        refNextBtn.title = 'Go to next slide';
        refNextBtn.classList.remove('btn-more-ideas-nav');
      }
    }

    // Adapt viewport height dynamically to eliminate awkward gaps in Slide 1 and 2
    updateCarouselHeight();
  }

  if (refPrevBtn) {
    refPrevBtn.addEventListener('click', () => {
      soundFx.playClick(600, 0.03);
      goToSlide(currentSlide - 1);
    });
  }

  if (refNextBtn) {
    refNextBtn.addEventListener('click', () => {
      if (currentSlide === totalSlides - 1) {
        // Last slide: redirect to Google Drive
        soundFx.playClick(900, 0.05);
        window.open(DRIVE_PROJECTS_URL, '_blank', 'noopener,noreferrer');
      } else {
        soundFx.playClick(750, 0.03);
        goToSlide(currentSlide + 1);
      }
    });
  }

  dotBtns.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetSlide = parseInt(dot.dataset.goto, 10);
      soundFx.playClick(700, 0.03);
      goToSlide(targetSlide);
    });
  });

  // Adjust height on window resize and initial asset load
  window.addEventListener('resize', updateCarouselHeight);
  setTimeout(updateCarouselHeight, 150);
  setTimeout(updateCarouselHeight, 500);

  const categoryToSlideMap = {
    'all': 0,
    'telugu': 0,
    'kannada': 1,
    'hindi': 1,
    'multilingual': 2
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      soundFx.playClick(850, 0.03);

      const cat = btn.dataset.category;
      if (categoryToSlideMap[cat] !== undefined) {
        goToSlide(categoryToSlideMap[cat]);
      }
    });
  });

  // Touch swipe support for carousel on mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  if (carouselViewport) {
    carouselViewport.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    carouselViewport.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0 && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
          } else if (diff < 0 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
          }
        }
      }
    }, { passive: true });
  }

  // Initialize first slide state
  goToSlide(0);

  // --------------------------------------------------
  // 3. FORBIDDEN BUTTON
  // --------------------------------------------------
  const forbiddenBtn = document.getElementById('forbiddenBtn');
  if (forbiddenBtn) {
    forbiddenBtn.addEventListener('click', () => {
      // Trigger full gravity collapse: all text & elements plummet off-screen into the void
      siteCollapse.triggerCollapse();
    });
  }

  // --------------------------------------------------
  // 4. 3D CYLINDRICAL CHAOS WHEEL DRUM CONTROLLER
  // --------------------------------------------------
  const reelStrip1 = document.getElementById('reelStrip1');
  const reelStrip2 = document.getElementById('reelStrip2');
  const reelStrip3 = document.getElementById('reelStrip3');
  const slotCoinUnit = document.getElementById('slotCoinUnit');
  const flyingInsertCoin = document.getElementById('flyingInsertCoin');
  const slotArcadeBtn = document.getElementById('slotArcadeBtn');
  const slotMarquee = document.getElementById('slotMarquee');
  const slotMarqueeText = document.getElementById('slotMarqueeText');
  const slotResultText = document.getElementById('slotResultText');
  const slotStatusIndicator = document.getElementById('slotStatusIndicator');
  const spinReelsBtn = document.getElementById('spinReelsBtn');
  const copyIdeaBtn = document.getElementById('copyIdeaBtn');

  let currentIdea = "A Bluetooth-Enabled Spoon that tweets live whenever you eat.";
  let isSpinning = false;

  function triggerCoinJackpot() {
    const consoleEl = document.querySelector('.slot-machine-console');
    if (!consoleEl) return;
    const rect = consoleEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const coins = ['🪙', '💰', '✨', '⭐', '7️⃣'];
    for (let i = 0; i < 22; i++) {
      const coin = document.createElement('div');
      coin.textContent = coins[Math.floor(Math.random() * coins.length)];
      coin.style.position = 'fixed';
      coin.style.left = `${centerX}px`;
      coin.style.top = `${centerY}px`;
      coin.style.fontSize = `${20 + Math.random() * 16}px`;
      coin.style.pointerEvents = 'none';
      coin.style.zIndex = '999999';
      document.body.appendChild(coin);

      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
      const velocity = 80 + Math.random() * 150;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 90; // upward bias

      const startTime = performance.now();
      const duration = 800 + Math.random() * 350;

      function animateCoin(now) {
        const elapsed = now - startTime;
        const p = elapsed / duration;
        if (p >= 1) {
          coin.remove();
          return;
        }
        const curX = vx * p;
        const curY = vy * p + 0.5 * 380 * (p * p); // gravity drop
        coin.style.transform = `translate(${curX}px, ${curY}px) scale(${1 - p * 0.3}) rotate(${p * 360}deg)`;
        coin.style.opacity = `${1 - p * 0.6}`;
        requestAnimationFrame(animateCoin);
      }
      requestAnimationFrame(animateCoin);
    }
  }

  function spinSlotMachine() {
    if (isSpinning) return;
    isSpinning = true;

    // 1. Arcade button tactile press animation & click sound
    if (slotArcadeBtn) {
      slotArcadeBtn.classList.add('pressed');
      setTimeout(() => slotArcadeBtn.classList.remove('pressed'), 400);
    }
    soundFx.playArcadeButton();

    // 2. Animate 3D Gold Coin sliding into slot with metallic chute sounds
    if (flyingInsertCoin) {
      flyingInsertCoin.classList.remove('inserting');
      void flyingInsertCoin.offsetWidth; // force reflow
      flyingInsertCoin.classList.add('inserting');
      setTimeout(() => flyingInsertCoin.classList.remove('inserting'), 600);
    }
    soundFx.playCoinInsert();

    // 3. Engage Jackpot Mission Mode on Marquee and Status Card
    if (slotMarquee) slotMarquee.classList.add('mission-active');
    if (slotMarqueeText) slotMarqueeText.textContent = "🚀 JACKPOT MISSION IN PROGRESS 🚀";
    if (slotStatusIndicator) {
      slotStatusIndicator.classList.add('mission-active');
      slotStatusIndicator.textContent = "🪙 COIN INSERTED! MISSION ENGAGED...";
    }

    const subj = slotSubjects[Math.floor(Math.random() * slotSubjects.length)];
    const obj = slotObjects[Math.floor(Math.random() * slotObjects.length)];
    const act = slotActions[Math.floor(Math.random() * slotActions.length)];
    currentIdea = `${subj} ${obj} ${act}`;

    // 4. Reels start spinning after coin drops into slot (at 300ms)
    setTimeout(() => {
      soundFx.playReelRoll(1.2);
      if (slotStatusIndicator) slotStatusIndicator.textContent = "⚡ MISSION RUNNING: CALCULATING RANDOM USELESSNESS...";
      [reelStrip1, reelStrip2, reelStrip3].forEach(strip => {
        if (strip) strip.classList.add('spinning');
      });
    }, 300);

    // 5. Staggered Reel Lock Sequence with Mission Target Status:
    // Drum 1: Stop at 750ms
    setTimeout(() => {
      if (reelStrip1) {
        reelStrip1.classList.remove('spinning');
        reelStrip1.innerHTML = `<div class="reel-item">${subj}</div>`;
      }
      soundFx.playClick(480, 0.08);
      if (slotStatusIndicator) slotStatusIndicator.textContent = `🎯 TARGET LOCKED: [${subj}]`;
    }, 750);

    // Drum 2: Stop at 1150ms
    setTimeout(() => {
      if (reelStrip2) {
        reelStrip2.classList.remove('spinning');
        reelStrip2.innerHTML = `<div class="reel-item">${obj}</div>`;
      }
      soundFx.playClick(680, 0.08);
      if (slotStatusIndicator) slotStatusIndicator.textContent = `⚙️ VEHICLE LOCKED: [${obj}]`;
    }, 1150);

    // Drum 3: Stop at 1550ms -> MISSION ACCOMPLISHED & JACKPOT CASINO WIN!
    setTimeout(() => {
      if (reelStrip3) {
        reelStrip3.classList.remove('spinning');
        reelStrip3.innerHTML = `<div class="reel-item">${act}</div>`;
      }

      // Authentic Casino Jackpot sound suite (Bells + Coins + Fanfare)
      soundFx.playJackpotWin();

      // Trigger celebratory coin shower
      triggerCoinJackpot();

      if (slotResultText) {
        slotResultText.textContent = `"${currentIdea}"`;
      }
      if (slotStatusIndicator) {
        slotStatusIndicator.textContent = "🎉 MISSION ACCOMPLISHED! ABSURD JACKPOT UNLOCKED! 💰";
      }
      if (slotMarqueeText) {
        slotMarqueeText.textContent = "🏆 JACKPOT MISSION COMPLETED! 🏆";
      }

      // Reset mission active styling after celebration
      setTimeout(() => {
        if (slotMarquee) slotMarquee.classList.remove('mission-active');
        if (slotMarqueeText) slotMarqueeText.textContent = "⚡ 3-REEL CHAOS WHEEL CYLINDER ⚡";
        if (slotStatusIndicator) slotStatusIndicator.classList.remove('mission-active');
        isSpinning = false;
      }, 3500);
    }, 1550);
  }

  if (spinReelsBtn) spinReelsBtn.addEventListener('click', spinSlotMachine);
  if (slotArcadeBtn) slotArcadeBtn.addEventListener('click', spinSlotMachine);
  if (slotCoinUnit) slotCoinUnit.addEventListener('click', spinSlotMachine);

  // Also clicking any drum reel triggers spin
  [reelStrip1, reelStrip2, reelStrip3].forEach(reel => {
    if (reel && reel.parentElement) {
      reel.parentElement.style.cursor = 'pointer';
      reel.parentElement.addEventListener('click', spinSlotMachine);
    }
  });

  if (copyIdeaBtn) {
    copyIdeaBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentIdea);
      soundFx.playClick(900);
      copyIdeaBtn.textContent = '✅ Copied!';
      setTimeout(() => copyIdeaBtn.textContent = '📋 Copy Absurd Idea', 2000);
    });
  }

  // --------------------------------------------------
  // 5. SUBMIT FORM TO BACKEND API (SUBMIT.HTML)
  // --------------------------------------------------
  const dedicatedSubmitForm = document.getElementById('dedicatedSubmitForm');
  const ratingSlider = document.getElementById('ratingSlider');
  const ratingDisplay = document.getElementById('ratingDisplay');
  const submitStampOverlay = document.getElementById('submitStampOverlay');

  if (ratingSlider && ratingDisplay) {
    ratingSlider.addEventListener('input', (e) => {
      ratingDisplay.textContent = `${e.target.value}% USELESS`;
      soundFx.playClick(300 + Number(e.target.value) / 2, 0.02);
    });
  }

  if (dedicatedSubmitForm) {
    dedicatedSubmitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      soundFx.playFanfare();

      const payload = {
        title: document.getElementById('pName').value,
        team: document.getElementById('tName').value,
        category: document.getElementById('pCategory').value,
        desc: document.getElementById('pDesc').value,
        rating: ratingSlider ? ratingSlider.value : 100
      };

      if (submitStampOverlay) submitStampOverlay.classList.add('stamped');

      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('Submission API Result:', result);
      } catch (err) {
        console.warn('Backend API submit fallback.');
      }

      setTimeout(() => {
        alert("🎉 CONGRATULATIONS! Your submission has been saved to the backend database & stamped as trash!");
        if (submitStampOverlay) submitStampOverlay.classList.remove('stamped');
        dedicatedSubmitForm.reset();
        renderShowcase();
      }, 1500);
    });
  }

  // --------------------------------------------------
  // 9. FLOATING JET-ENGINE DUCK MASCOT INTERACTION
  // --------------------------------------------------
  const duckContainer = document.getElementById('floatingDuck');
  const duckSpeechBubble = document.getElementById('duckSpeechBubble');
  const duckZone = document.getElementById('duckInteractiveZone');

  if (duckContainer && duckSpeechBubble) {
    const duckPhrases = [
      { text: "JUST VIBES! 🦆💨", sub: "100% Unnecessary" },
      { text: "NOT FOR ANYTHING! 😂", sub: "Zero Practical Use Cases" },
      { text: "QUACK OVER-ENGINEERING! ⚡", sub: "Jet Thruster at 100% RPM" },
      { text: "BPSI CRITICAL! 🥞", sub: "48 Dosa Holes Detected" },
      { text: "SWALPA ADJUST MAADI! ☕", sub: "Code Decaf Forbidden" },
      { text: "VALUATION: $10 BILLION! 🦄", sub: "TAM $1 Trillion | Balance ₹12" }
    ];
    let phraseIdx = 0;

    const triggerDuckQuack = () => {
      // Play synthesized duck squeak sound
      soundFx.playDuckSqueak();

      // Trigger 360 degree spin hop animation
      duckContainer.classList.remove('duck-clicked');
      void duckContainer.offsetWidth; // Force CSS reflow
      duckContainer.classList.add('duck-clicked');

      // Cycle funny comic phrases
      phraseIdx = (phraseIdx + 1) % duckPhrases.length;
      const phrase = duckPhrases[phraseIdx];
      const textEl = duckSpeechBubble.querySelector('.bubble-text');
      const subEl = duckSpeechBubble.querySelector('.bubble-sub');
      if (textEl) textEl.textContent = phrase.text;
      if (subEl) subEl.textContent = phrase.sub;
    };

    duckContainer.addEventListener('click', triggerDuckQuack);
    duckSpeechBubble.addEventListener('click', triggerDuckQuack);

    // 3D Parallax tilt tracking mouse position inside zone
    if (duckZone) {
      duckZone.addEventListener('mousemove', (e) => {
        const rect = duckZone.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateY = (x / rect.width) * 18;
        const rotateX = -(y / rect.height) * 18;
        duckContainer.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-16px)`;
      });

      duckZone.addEventListener('mouseleave', () => {
        duckContainer.style.transform = '';
      });
    }
  }

  // Generic Button Sound FX
  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => soundFx.playClick(1000, 0.02));
  });
});
