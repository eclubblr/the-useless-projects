// ==========================================================================
// CRAZY MINI-GAMES ENGINE FOR LANDING PAGE
// ==========================================================================

import { soundFx } from './sound.js';

export function initMiniGames() {
  initClickerGame();
  initCatcherGame();
  initSwitchboardGame();
}

// --------------------------------------------------
// 1. THE INFINITE USELESS CLICKER GAME
// --------------------------------------------------
export const CLICKER_MILESTONES = {
  1: "🏆 First Step into the Void!",
  5: "🏆 5 Clicks Wasted!",
  10: "🏆 Junior Procrastination Intern!",
  15: "🏆 Carpal Tunnel Trainee!",
  20: "🏆 Master of Pointless Tapping!",
  25: "🏆 Denial of Productive Reality!",
  35: "🏆 Finger Muscle Overdrive!",
  50: "🏆 0% Commercial Value Certified!",
  69: "🏆 Absurdity Coefficient Aligned!",
  75: "🏆 Kinetic Energy Waste Specialist!",
  100: "🏆 Absolute Legend of Nothingness! 💯",
  125: "🏆 Mechanical Switch Executioner!",
  150: "🏆 Over-Engineered Tendonitis!",
  175: "🏆 Disqualified from Productivity!",
  200: "🏆 Certified Pointless Engineer!",
  225: "🏆 Human Auto-Clicker Prototype!",
  250: "🏆 Thermodynamic Waste Exemplar!",
  275: "🏆 Caffeine-Fueled Futility!",
  300: "🏆 Cloud Compute Bill: $0.00, Waste: 100%!",
  325: "🏆 Entropy Generation Virtuoso!",
  350: "🏆 Silicon Valley VC Thoroughly Horrified!",
  375: "🏆 Defier of Basic Time Management!",
  400: "🏆 PhD in Kinetic Entropy!",
  425: "🏆 Mouse Spring Fatigue Warning!",
  450: "🏆 Duct Tape Won't Fix This Time!",
  475: "🏆 Existential Dread Approaching!",
  500: "🔥 HALF-MILLENNIUM OF PURE REGRET! 🔥",
  525: "🏆 Pointless Velocity Maxed Out!",
  550: "🏆 The Left Mouse Button Weeps!",
  575: "🏆 Ignoring Every Important Life Goal!",
  600: "🏆 Quantum Level of Absolute Futility!",
  625: "🏆 Fatal Syntax Error in Priorities!",
  650: "🏆 Added Clicker to Resume as Hard Skill!",
  675: "🏆 Overclocked Forearm Tendons!",
  700: "🏆 Makerspace Hall of Infamy Inductee!",
  725: "🏆 Perpetual Motion Machine of Procrastination!",
  750: "🏆 75% Detached From Earthly Reality!",
  775: "🏆 Calibration Complete: 100% Worthless!",
  800: "🏆 Grandmaster of Counter-Productivity!",
  825: "🏆 Beyond All Human Reason!",
  850: "🏆 0 Real-World Problems Solved!",
  875: "🏆 Terminal Index of Pointlessness!",
  900: "🏆 Transcendent Waste of Bandwidth!",
  925: "🏆 Heat Death of Personal Ambition!",
  950: "⚠️ Emergency Stop Button Viciously Ignored!",
  975: "🏆 The Matrix Glitches in Utter Despair!",
  990: "🏆 The Final Point of No Return!",
  999: "⏳ ONE CLICK FROM ETERNAL FUTILITY...",
  1000: "👑 GOD OF FUTILITY: 1,000 CLICKS OF PURE VOID! 👑"
};

function initClickerGame() {
  const clickerBtn = document.getElementById('clickerBtn');
  const clickerScore = document.getElementById('clickerScoreNum');
  const clickerAchievement = document.getElementById('clickerAchievement');

  let points = 0;

  if (clickerBtn && clickerScore) {
    clickerBtn.addEventListener('click', () => {
      points++;
      clickerScore.textContent = `${points} pts`;
      soundFx.playClick(400 + Math.min(points * 10, 1200), 0.03);

      if (clickerAchievement) {
        if (CLICKER_MILESTONES[points]) {
          clickerAchievement.textContent = CLICKER_MILESTONES[points];
          clickerAchievement.classList.remove('milestone-pop');
          void clickerAchievement.offsetWidth;
          clickerAchievement.classList.add('milestone-pop');

          // Audio celebrations for major milestones
          if (points === 100 || points === 500 || points === 1000) {
            soundFx.playJackpotWin();
          } else {
            soundFx.playCoinInsert();
          }
        } else if (points > 1000 && points % 100 === 0) {
          clickerAchievement.textContent = `👑 GOD OF FUTILITY (Level ${points} Transcended!)`;
          clickerAchievement.classList.remove('milestone-pop');
          void clickerAchievement.offsetWidth;
          clickerAchievement.classList.add('milestone-pop');
          soundFx.playJackpotWin();
        }
      }
    });
  }
}

// --------------------------------------------------
// 2. SEMICOLON CATCHER ARCADE GAME
// --------------------------------------------------
function initCatcherGame() {
  const canvas = document.getElementById('catcherCanvas');
  const scoreSpan = document.getElementById('catcherScore');
  const startBtn = document.getElementById('startCatcherBtn');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationId = null;
  let running = false;
  let score = 0;
  let basketX = 100;
  const basketWidth = 60;

  let semicolons = [];

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  resizeCanvas();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
  });

  function spawnSemicolon() {
    semicolons.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: -20,
      speed: 2 + Math.random() * 3
    });
  }

  function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Basket
    ctx.fillStyle = '#DD736E';
    ctx.fillRect(basketX, canvas.height - 20, basketWidth, 14);

    // Update & Draw Semicolons
    if (Math.random() < 0.04) spawnSemicolon();

    for (let i = semicolons.length - 1; i >= 0; i--) {
      const s = semicolons[i];
      s.y += s.speed;

      ctx.font = '22px monospace';
      ctx.fillStyle = '#E0B541';
      ctx.fillText(';', s.x, s.y);

      // Catch Check
      if (s.y >= canvas.height - 30 && s.x >= basketX && s.x <= basketX + basketWidth) {
        score++;
        if (scoreSpan) scoreSpan.textContent = score;
        soundFx.playClick(900, 0.03);
        semicolons.splice(i, 1);
        continue;
      }

      // Miss Check
      if (s.y > canvas.height) {
        semicolons.splice(i, 1);
      }
    }

    animationId = requestAnimationFrame(loop);
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      running = !running;
      if (running) {
        score = 0;
        if (scoreSpan) scoreSpan.textContent = '0';
        semicolons = [];
        startBtn.textContent = 'Pause Arcade ⏸️';
        loop();
      } else {
        cancelAnimationFrame(animationId);
        startBtn.textContent = 'Start Semicolon Catcher 🎮';
      }
    });
  }
}

// --------------------------------------------------
// 3. OVER-ENGINEERED SWITCHBOARD MATRIX
// --------------------------------------------------
function initSwitchboardGame() {
  const grid = document.getElementById('switchboardGrid');
  const status = document.getElementById('switchboardStatus');
  if (!grid) return;

  const switches = Array(9).fill(false);

  function renderGrid() {
    grid.innerHTML = switches.map((state, idx) => `
      <button class="matrix-switch ${state ? 'active' : ''}" data-idx="${idx}">
        S${idx + 1}: ${state ? 'ON' : 'OFF'}
      </button>
    `).join('');

    grid.querySelectorAll('.matrix-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        toggleSwitch(idx);
      });
    });
  }

  function toggleSwitch(idx) {
    soundFx.playClick(600 + idx * 50);
    switches[idx] = !switches[idx];

    // Toggle adjacent switches (chaos rule!)
    if (idx % 3 > 0) switches[idx - 1] = !switches[idx - 1]; // Left
    if (idx % 3 < 2) switches[idx + 1] = !switches[idx + 1]; // Right
    if (idx >= 3) switches[idx - 3] = !switches[idx - 3];     // Up
    if (idx < 6) switches[idx + 3] = !switches[idx + 3];     // Down

    renderGrid();

    const allOn = switches.every(s => s === true);
    if (status) {
      if (allOn) {
        status.textContent = "💡 VICTORY! Single Useless Bulb is Illuminated!";
        status.style.color = "#E0B541";
        soundFx.playFanfare();
      } else {
        status.textContent = "Lamp status: Bulb Offline 🔌";
        status.style.color = "#DD736E";
      }
    }
  }

  renderGrid();
}
