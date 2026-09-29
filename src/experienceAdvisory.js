// ==========================================================================
// EXPERIENCE ADVISORY TOAST NOTIFICATION
// Centered alert for Laptop & Full Volume - Dismissible on ANY click
// ==========================================================================

import { soundFx } from './sound.js';

export function initExperienceAdvisory() {
  const toast = document.getElementById('experienceToast');
  const backdrop = document.getElementById('experienceBackdrop');
  if (!toast) return;

  const reopenBtn = document.getElementById('reopenAdvisoryBtn');

  // Check if forced via URL parameter (?advisory=1 or ?intro=1)
  const urlParams = new URLSearchParams(window.location.search);
  const forceShow = urlParams.has('advisory') || urlParams.has('intro');

  const hasSeen = sessionStorage.getItem('useless_toast_dismissed');

  if (hasSeen && !forceShow) {
    toast.remove();
    if (backdrop) backdrop.remove();
    return;
  }

  let isDismissed = false;

  function dismissToast(playSound = true) {
    if (isDismissed) return;
    isDismissed = true;

    // Clean up event listeners
    window.removeEventListener('pointerdown', handleGlobalDismiss, true);
    window.removeEventListener('keydown', handleGlobalKey);

    if (playSound) {
      try {
        soundFx.init();
        soundFx.playDuckSqueak();
      } catch (e) {}
    }

    sessionStorage.setItem('useless_toast_dismissed', 'true');
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    if (backdrop) {
      backdrop.classList.remove('backdrop-visible');
      backdrop.classList.add('backdrop-hiding');
    }

    setTimeout(() => {
      toast.remove();
      if (backdrop) backdrop.remove();
    }, 350);
  }

  function handleGlobalDismiss(e) {
    // If the click is on the footer button to reopen, don't dismiss
    if (e.target && e.target.closest('#reopenAdvisoryBtn')) return;
    dismissToast(true);
  }

  function handleGlobalKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      dismissToast(true);
    }
  }

  // Reveal toast and backdrop after a short intro delay
  setTimeout(() => {
    toast.classList.add('toast-visible');
    if (backdrop) backdrop.classList.add('backdrop-visible');

    // Attach "click anywhere to dismiss" listeners with slight buffer
    setTimeout(() => {
      window.addEventListener('pointerdown', handleGlobalDismiss, true);
      window.addEventListener('keydown', handleGlobalKey);
    }, 120);
  }, 350);

  // Fallback explicit listeners for buttons
  const gotItBtn = document.getElementById('toastGotItBtn');
  const closeBtn = document.getElementById('toastCloseBtn');
  if (gotItBtn) gotItBtn.addEventListener('click', () => dismissToast(true));
  if (closeBtn) closeBtn.addEventListener('click', () => dismissToast(false));
  if (backdrop) backdrop.addEventListener('click', () => dismissToast(true));

  // Footer reopen button listener
  if (reopenBtn) {
    reopenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('useless_toast_dismissed');
      window.location.search = '?advisory=1';
    });
  }
}
