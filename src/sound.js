// ==========================================================================
// WEB AUDIO SYNTHESIZER ENGINE FOR USELESS PROJECTS
// Zero external audio files required! Pure Web Audio API synthesizers.
// ==========================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.noiseBuffer = null;
    this.setupAutoUnlock();
  }

  // Pre-unlock AudioContext on first user interaction to bypass browser autoplay suspension
  setupAutoUnlock() {
    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };
    ['pointerdown', 'mousedown', 'keydown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, unlock, { capture: true, once: true });
    });
  }

  init() {
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      // Pre-allocate noise buffer once for consistent, zero-latency impact clicks
      if (this.ctx && !this.noiseBuffer) {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
        }
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playClick(freq = 600, duration = 0.05) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  playDuckSqueak() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playSpin() {
    this.playReelRoll(1.0);
  }

  // Authentic metallic coin insert & chute drop sound
  playCoinInsert() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.002;

      // 1. Initial high metallic slot rim impact "Ting!"
      const pings = [3400, 4800, 5600];
      pings.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.015);
        gain.gain.setValueAtTime(0.24, now + i * 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.015 + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.015);
        osc.stop(now + i * 0.015 + 0.09);
      });

      // 2. Chute slide & micro-rattles as coin rolls down the metal channel
      const rattles = [2400, 1900, 1600, 2100];
      rattles.forEach((freq, idx) => {
        const t = now + 0.07 + idx * 0.038;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      });

      // 3. Mechanical microswitch latch "Chunk-Clack"
      const switchTime = now + 0.22;
      const swOsc = this.ctx.createOscillator();
      const swGain = this.ctx.createGain();
      swOsc.type = 'square';
      swOsc.frequency.setValueAtTime(420, switchTime);
      swOsc.frequency.exponentialRampToValueAtTime(90, switchTime + 0.05);
      swGain.gain.setValueAtTime(0.25, switchTime);
      swGain.gain.exponentialRampToValueAtTime(0.001, switchTime + 0.05);
      swOsc.connect(swGain);
      swGain.connect(this.ctx.destination);
      swOsc.start(switchTime);
      swOsc.stop(switchTime + 0.05);

      // 4. Mission Ready Chime (Dual Tone Arcade Stinger)
      const stingerTime = now + 0.28;
      [659.25, 880.00, 1318.51].forEach((f, index) => {
        const stOsc = this.ctx.createOscillator();
        const stGain = this.ctx.createGain();
        stOsc.type = 'sine';
        const stT = stingerTime + index * 0.06;
        stOsc.frequency.setValueAtTime(f, stT);
        stGain.gain.setValueAtTime(0.18, stT);
        stGain.gain.exponentialRampToValueAtTime(0.001, stT + 0.16);
        stOsc.connect(stGain);
        stGain.connect(this.ctx.destination);
        stOsc.start(stT);
        stOsc.stop(stT + 0.16);
      });
    } catch (e) {}
  }

  // Tactile Arcade Push Button click sound
  playArcadeButton() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.002;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Authentic mechanical casino slot reel ratchet roll ticking
  playReelRoll(duration = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.003;
      let tickTime = now;
      let interval = 0.032;

      while (tickTime < now + duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750 + Math.random() * 350, tickTime);
        osc.frequency.exponentialRampToValueAtTime(140, tickTime + 0.016);
        gain.gain.setValueAtTime(0.12, tickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.016);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(tickTime);
        osc.stop(tickTime + 0.016);

        interval *= 1.055; // Natural mechanical deceleration
        tickTime += interval;
      }
    } catch (e) {}
  }

  // Full authentic Vegas Casino Jackpot payout sound effect
  playJackpotWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.003;

      // 1. Vegas Electronic Bell Arpeggio (Double Octave Rising Chimes)
      const bells = [
        523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00,
        1567.98, 2093.00, 2637.02
      ];
      bells.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.065;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });

      // 2. Cascading Metallic Coin Hopper Shower (Coins pouring into metal tray)
      const coinCount = 18;
      for (let i = 0; i < coinCount; i++) {
        const coinTime = now + 0.25 + i * (0.05 + Math.random() * 0.035);
        const coinOsc = this.ctx.createOscillator();
        const coinGain = this.ctx.createGain();
        const coinFreq = 2200 + Math.random() * 1800; // Bright metallic coin ping
        coinOsc.type = 'triangle';
        coinOsc.frequency.setValueAtTime(coinFreq, coinTime);
        coinGain.gain.setValueAtTime(0.2, coinTime);
        coinGain.gain.exponentialRampToValueAtTime(0.001, coinTime + 0.07);
        coinOsc.connect(coinGain);
        coinGain.connect(this.ctx.destination);
        coinOsc.start(coinTime);
        coinOsc.stop(coinTime + 0.07);
      }

      // 3. Victory Brass Fanfare Chords (Slot Machine Winner Payout)
      const chords = [
        { time: 0.0, notes: [523.25, 659.25, 783.99], dur: 0.16 }, // C Major
        { time: 0.20, notes: [587.33, 739.99, 880.00], dur: 0.16 }, // D Major
        { time: 0.40, notes: [659.25, 830.61, 987.77], dur: 0.18 }, // E Major
        { time: 0.64, notes: [783.99, 987.77, 1174.66], dur: 0.22 }, // G Major
        { time: 0.90, notes: [1046.50, 1318.51, 1567.98, 2093.00], dur: 0.70 } // High Big C Major Victory!
      ];

      chords.forEach((chord) => {
        chord.notes.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          const t = now + chord.time;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + chord.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + chord.dur);
        });
      });
    } catch (e) {}
  }

  playSiren() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.3);
      osc.frequency.linearRampToValueAtTime(300, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    try {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  playHammerHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Safe scheduling timestamp with 3ms lookahead to guarantee no dropped audio nodes
      const now = this.ctx.currentTime + 0.003;
      const pitchVariance = 0.94 + Math.random() * 0.12;

      // 1. Steel Anvil Metallic Ring (Inharmonic bell/metal overtones with resonant decay)
      const metalFrequencies = [820, 1260, 1880, 2940];
      const metalGains = [0.32, 0.24, 0.16, 0.10];
      const ringDuration = 0.35;

      metalFrequencies.forEach((baseFreq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // High metallic chime
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * pitchVariance, now);
        osc.frequency.exponentialRampToValueAtTime((baseFreq * 0.96) * pitchVariance, now + ringDuration);

        gain.gain.setValueAtTime(metalGains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + ringDuration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + ringDuration);
      });

      // 2. Heavy Iron Core Impact (Thump & Body)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(260 * pitchVariance, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
      bodyGain.gain.setValueAtTime(0.40, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.14);

      // 3. Sharp Metal Clink / Transient Contact (Using pre-allocated noise buffer)
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(2200 * pitchVariance, now);
        noiseFilter.Q.setValueAtTime(3.0, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.38, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.04);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playExplosionCollapse() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.003;

      // 1. Deep Seismic Earth-shattering Sub Boom
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(150, now);
      sub.frequency.exponentialRampToValueAtTime(25, now + 1.4);
      subGain.gain.setValueAtTime(0.55, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 1.4);

      // 2. Structural Shatter / Distortion Rumble (Filtered Noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.8);
      const rumbleBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = rumbleBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = rumbleBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.8);

      // 3. High Shatter Chimes
      [580, 880, 1420, 2100].forEach((freq, idx) => {
        const ping = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        ping.type = 'triangle';
        ping.frequency.setValueAtTime(freq, now + idx * 0.05);
        ping.frequency.exponentialRampToValueAtTime(freq * 0.5, now + idx * 0.05 + 0.3);
        pingGain.gain.setValueAtTime(0.2, now + idx * 0.05);
        pingGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
        ping.connect(pingGain);
        pingGain.connect(this.ctx.destination);
        ping.start(now + idx * 0.05);
        ping.stop(now + idx * 0.05 + 0.3);
      });
    } catch (e) {}
  }

  playRebuildRewind() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + 0.003;

      // 1. Sci-Fi Reverse Gravity Rewind Sweep
      const sweep = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(80, now);
      sweep.frequency.exponentialRampToValueAtTime(950, now + 0.7);
      sweepGain.gain.setValueAtTime(0.05, now);
      sweepGain.gain.linearRampToValueAtTime(0.4, now + 0.6);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      sweep.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.75);

      // 2. Harmonic Magnetic Lock Chords (C-Major Lock Snap)
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25];
      chord.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + 0.68);
        g.gain.setValueAtTime(0.18, now + 0.68);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + 0.68);
        osc.stop(now + 1.0);
      });
    } catch (e) {}
  }
}

export const soundFx = new SoundEngine();
