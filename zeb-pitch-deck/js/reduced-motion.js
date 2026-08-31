/*
 * reduced-motion.js — Handles OS prefers-reduced-motion accessibility
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleMotionPreference = (e) => {
    if (e.matches) {
      document.documentElement.classList.add('no-motion');
    } else {
      document.documentElement.classList.remove('no-motion');
    }
  };

  handleMotionPreference(motionQuery);
  motionQuery.addEventListener('change', handleMotionPreference);
});
