/*
 * animations.js — GSAP 3.15 + ScrollTrigger + Lenis Smooth Scroll
 * Fail-safe, high-performance animations with guaranteed element visibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize Lenis Smooth Scroll
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }

  // Smooth scroll for anchor navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main-content') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Close mobile drawer if open
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav && mobileNav.classList.contains('is-open')) {
          mobileNav.classList.remove('is-open');
        }

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
        } else {
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      }
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.header__toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // 2. Safe & Guaranteed GSAP Scroll Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    try {
      gsap.registerPlugin(ScrollTrigger);

      // --- Hero Staggered Reveal ---
      gsap.fromTo('.hero__eyebrow, .hero h1, .hero__subtitle, .hero__ctas', 
        { opacity: 0, y: 24 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.12, 
          duration: 0.8, 
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        }
      );

      // --- Capability Matrix Rows ---
      if (document.querySelector('.matrix__table')) {
        gsap.fromTo('.matrix__table tbody tr',
          { opacity: 0, y: 15 },
          {
            scrollTrigger: {
              trigger: '.matrix__table',
              start: 'top 85%',
              once: true
            },
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'opacity,transform'
          }
        );
      }

      // --- Signal Comparison Cards ---
      if (document.querySelector('.comparison')) {
        gsap.fromTo('.comparison .card',
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: '.comparison',
              start: 'top 85%',
              once: true
            },
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'opacity,transform'
          }
        );
      }

      // --- Outcome Flow Diagram ---
      if (document.querySelector('.outcome')) {
        gsap.fromTo('.outcome__input, .outcome__arrow, .outcome__result',
          { opacity: 0, scale: 0.95 },
          {
            scrollTrigger: {
              trigger: '.outcome',
              start: 'top 85%',
              once: true
            },
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.3)',
            clearProps: 'opacity,transform'
          }
        );
      }

      // --- Guarantee Counter & Cards ---
      if (document.querySelector('.guarantee')) {
        const statElement = document.querySelector('.guarantee__stat');
        
        ScrollTrigger.create({
          trigger: '.guarantee',
          start: 'top 85%',
          once: true,
          onEnter: () => {
            if (statElement) {
              const counter = { val: 0 };
              gsap.to(counter, {
                val: 100,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                  statElement.textContent = Math.floor(counter.val) + '%';
                }
              });
            }
          }
        });

        gsap.fromTo('.guarantee .card',
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: '.guarantee .grid-2up',
              start: 'top 85%',
              once: true
            },
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'opacity,transform'
          }
        );
      }

      // --- Solution Cards (4-up parallel) ---
      if (document.querySelector('.solutions')) {
        gsap.fromTo('.solutions .card--solution',
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: '.solutions .grid-4up',
              start: 'top 88%',
              once: true
            },
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'opacity,transform'
          }
        );

        // Google Cloud Hub Cards
        if (document.querySelector('.gcp-hub')) {
          gsap.fromTo('.gcp-grid .card--feature',
            { opacity: 0, y: 20 },
            {
              scrollTrigger: {
                trigger: '.gcp-grid',
                start: 'top 88%',
                once: true
              },
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'opacity,transform'
            }
          );
        }
      }

      // Refresh ScrollTrigger after assets load
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });

    } catch (e) {
      console.warn('GSAP animation error:', e);
      // Fallback: force all elements visible
      document.querySelectorAll('.card, .outcome__input, .outcome__result, .matrix__table tr').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  // Safety fallback: Ensure everything is 100% visible after 1.2s regardless of JS state
  setTimeout(() => {
    document.querySelectorAll('.card, .card--solution, .card--feature, .outcome__input, .outcome__result').forEach(el => {
      el.style.opacity = '1';
    });
  }, 1200);
});
