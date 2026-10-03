/**
 * animations.js — Subtle GSAP Animation Layer
 * Lifetime Missed Salah & Qaza Calculator
 *
 * Philosophy: gentle, purposeful motion that guides attention without
 * distracting from the content. All durations are short (200–600ms),
 * easings are natural, and nothing loops or bounces aggressively.
 */

(function () {
  'use strict';

  // Guard: GSAP must be loaded
  if (typeof gsap === 'undefined') {
    console.warn('[animations] GSAP not found — skipping animations.');
    return;
  }

  // -------------------------------------------------------------------------
  // 1. PAGE LOAD — header & stepper gentle fade-in from slight y-offset
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const header     = document.querySelector('.app-header');
    const stepper    = document.getElementById('stepperNav');
    const wizardCard = document.getElementById('wizardCard');

    const els = [header, stepper, wizardCard].filter(Boolean);
    gsap.set(els, { opacity: 0, y: -10 });

    gsap.timeline({ delay: 0.05 })
      .to(header,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
      .to(stepper,    { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.3')
      .to(wizardCard, { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.25',)
      // Reveal the active step view after the card appears
      .call(() => {
        const activeStep = document.querySelector('.step-view.active');
        if (activeStep) gsap.set(activeStep, { opacity: 1, x: 0 });
      });
  });

  // -------------------------------------------------------------------------
  // 2. STEP TRANSITIONS — direction-aware slide + fade
  //    Called from app.js via window.SalahAnimations.animateStepTransition()
  // -------------------------------------------------------------------------
  function animateStepTransition(incomingView, outgoingView, direction) {
    const xOut = direction === 'forward' ? -22 : 22;
    const xIn  = direction === 'forward' ?  22 : -22;

    const tl = gsap.timeline();

    if (outgoingView) {
      tl.to(outgoingView, {
        opacity: 0,
        x: xOut,
        duration: 0.2,
        ease: 'power1.in',
        onComplete: () => {
          outgoingView.classList.remove('active');
          gsap.set(outgoingView, { clearProps: 'all' });
        }
      });
    }

    if (incomingView) {
      gsap.set(incomingView, { opacity: 0, x: xIn });
      incomingView.classList.add('active');
      tl.to(incomingView, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, outgoingView ? '-=0.06' : 0);
    }

    return tl;
  }

  // -------------------------------------------------------------------------
  // 3. PROGRESS BAR — smooth tween instead of instant CSS width jump
  // -------------------------------------------------------------------------
  function animateProgressBar(fillEl, targetPct) {
    if (!fillEl) return;
    gsap.to(fillEl, {
      width: `${targetPct}%`,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  // -------------------------------------------------------------------------
  // 4. RESULTS DASHBOARD REVEAL — staggered section entrance
  // -------------------------------------------------------------------------
  function animateDashboardReveal() {
    const selectors = [
      '.results-action-bar',
      '.hero-results-card',
      '.visual-ratio-container',
      '.dashboard-tables-grid',
      '.audit-section',
      '.planner-section',
      '.callout-app-download'
    ];
    const sections = selectors.map(s => document.querySelector(s)).filter(Boolean);

    gsap.set(sections, { opacity: 0, y: 16 });
    gsap.to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.48,
      ease: 'power2.out',
      stagger: 0.07,
      delay: 0.05
    });

    // Metric cards pop in with gentle scale
    const metricCards = document.querySelectorAll('.metric-card');
    gsap.set(metricCards, { opacity: 0, scale: 0.93 });
    gsap.to(metricCards, {
      opacity: 1,
      scale: 1,
      duration: 0.38,
      ease: 'back.out(1.5)',
      stagger: 0.06,
      delay: 0.22
    });

    // Ratio bar segments animate width from 0
    const segments = document.querySelectorAll('.segment-slice');
    segments.forEach(seg => {
      const target = seg.style.width;
      seg.style.width = '0%';
      gsap.to(seg, {
        width: target,
        duration: 0.75,
        ease: 'power2.out',
        delay: 0.35
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. AUDIT ACCORDION — fade + subtle vertical shift
  // -------------------------------------------------------------------------
  function animateAuditOpen(contentEl) {
    if (!contentEl) return;
    gsap.fromTo(contentEl,
      { opacity: 0, y: -5 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }

  function animateAuditClose(contentEl, onDone) {
    if (!contentEl) { if (onDone) onDone(); return; }
    gsap.to(contentEl, {
      opacity: 0,
      y: -5,
      duration: 0.18,
      ease: 'power1.in',
      onComplete: onDone
    });
  }

  // -------------------------------------------------------------------------
  // 6. CHIP / CHOICE CARD MICRO-PRESS — gentle scale pulse
  // -------------------------------------------------------------------------
  function animateChipPress(el) {
    if (!el) return;
    gsap.fromTo(el,
      { scale: 0.95 },
      { scale: 1, duration: 0.28, ease: 'back.out(2.8)' }
    );
  }

  // -------------------------------------------------------------------------
  // 7. TOAST — slide up / fade out
  // -------------------------------------------------------------------------
  function animateToastIn(toastEl) {
    if (!toastEl) return;
    gsap.fromTo(toastEl,
      { opacity: 0, y: 10, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: 'power2.out' }
    );
  }

  function animateToastOut(toastEl) {
    if (!toastEl) return;
    gsap.to(toastEl, {
      opacity: 0,
      y: 8,
      scale: 0.97,
      duration: 0.2,
      ease: 'power1.in'
    });
  }

  // -------------------------------------------------------------------------
  // 8. BUTTON PRESS micro-animation (attached once at DOMContentLoaded)
  // -------------------------------------------------------------------------
  function attachButtonMicroAnimations() {
    document.querySelectorAll('.btn-wizard, .btn-action').forEach(btn => {
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.97, duration: 0.1, ease: 'power1.in', overwrite: 'auto' });
      });
      const reset = () => {
        gsap.to(btn, { scale: 1, duration: 0.2, ease: 'back.out(2)', overwrite: 'auto' });
      };
      btn.addEventListener('mouseup', reset);
      btn.addEventListener('mouseleave', reset);
    });

    // Gender choice cards
    document.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', () => animateChipPress(card));
    });

    // Chip buttons & pace cards
    document.querySelectorAll('.chip-btn, .pace-card').forEach(el => {
      el.addEventListener('click', () => animateChipPress(el));
    });
  }

  // -------------------------------------------------------------------------
  // 9. STEPPER DOTS re-render — scale in stagger
  // -------------------------------------------------------------------------
  function animateStepperDots() {
    const dots = document.querySelectorAll('#stepperDotsContainer .step-dot');
    if (!dots.length) return;
    gsap.fromTo(dots,
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2)', stagger: 0.03 }
    );
  }

  // -------------------------------------------------------------------------
  // Expose public API
  // -------------------------------------------------------------------------
  window.SalahAnimations = {
    animateStepTransition,
    animateProgressBar,
    animateDashboardReveal,
    animateAuditOpen,
    animateAuditClose,
    animateChipPress,
    animateToastIn,
    animateToastOut,
    attachButtonMicroAnimations,
    animateStepperDots
  };

  // Auto-attach button micro-animations on ready
  document.addEventListener('DOMContentLoaded', attachButtonMicroAnimations);

})();
