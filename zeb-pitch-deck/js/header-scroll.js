/*
 * header-scroll.js — Throttled Sticky Header Condense on Scroll
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const header = document.querySelector('.header');
  if (!header) return;

  let isCondensed = false;
  let ticking = false;

  const updateHeader = () => {
    const shouldBeCondensed = window.scrollY > 80;
    if (shouldBeCondensed && !isCondensed) {
      header.classList.add('header--condensed');
      isCondensed = true;
    } else if (!shouldBeCondensed && isCondensed) {
      header.classList.remove('header--condensed');
      isCondensed = false;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial check on load
  updateHeader();
});
