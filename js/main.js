/* =========================
   GLOBAL MOBILE FIXES
========================= */

@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }

  .site-shell {
    overflow: hidden;
  }
}

/* =========================
   NAVBAR EXTRA FIXES
========================= */

@media (max-width: 768px) {
  .site-header {
    backdrop-filter: blur(10px);
  }

  .site-nav {
    padding: 12px 18px;
  }

  .brand-main {
    font-size: 1.4rem;
  }

  .brand-sub {
    font-size: 0.6rem;
  }

  .nav-menu {
    border-top: 1px solid rgba(255, 215, 120, 0.08);
  }
}

/* =========================
   HERO FINAL MOBILE POLISH
========================= */

@media (max-width: 768px) {
  .hero {
    padding-top: 7.8rem;
  }

  .hero-grid {
    gap: 1.8rem;
  }

  .hero-lead {
    max-width: 100%;
  }

  .hero-visual {
    margin-top: 0.5rem;
  }
}

/* =========================
   SECTION SPACING CONTROL
========================= */

@media (max-width: 768px) {
  .section {
    padding: 4.2rem 0;
  }

  .section-head {
    margin-bottom: 1.6rem;
  }

  .section-lead {
    margin-top: 0.7rem;
  }
}

/* =========================
   PANELS MOBILE BEHAVIOR
========================= */

@media (max-width: 768px) {
  .ecosystem-panel {
    transform: none !important;
  }

  .ecosystem-panel:hover {
    transform: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 10px 20px rgba(0, 0, 0, 0.18);
  }

  .panel-icon {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 6px 14px rgba(0, 0, 0, 0.16);
  }
}

/* =========================
   BUTTON STACKING
========================= */

@media (max-width: 768px) {
  .hero-actions {
    gap: 0.8rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.85rem 1.2rem;
  }
}

/* =========================
   TRANSITION STRIP MOBILE
========================= */

@media (max-width: 768px) {
  .transition-line {
    border-radius: 20px;
  }

  .transition-line p {
    line-height: 1.2;
  }
}

/* =========================
   SMALL MOBILE (<=520px)
========================= */

@media (max-width: 520px) {
  .site-nav {
    padding: 10px 14px;
  }

  .hero {
    padding-top: 7.2rem;
  }

  .section {
    padding: 3.6rem 0;
  }

  .section-head h2 {
    font-size: clamp(1.8rem, 8vw, 2.4rem);
  }

  .transition-line {
    padding: 1.7rem 0.7rem 1.6rem;
  }

  .panel-title {
    font-size: 0.95rem;
  }

  .panel-line {
    font-size: 0.88rem;
  }
}

/* =========================
   PERFORMANCE GUARD
========================= */

@media (max-width: 768px) {
  #global-particles-canvas {
    opacity: 0.6;
  }

  #global-ambient-layer {
    opacity: 0.7;
  }
}
