(function () {
  // Set glitch image URL on each .glitch wrapper (for pseudo-element backgrounds)
  document.querySelectorAll('.glitch img').forEach((img) => {
    const wrap = img.closest('.glitch');
    if (wrap && img.src) {
      wrap.style.setProperty('--glitch-img', 'url(' + (img.currentSrc || img.src) + ')');
    }
  });

  const revealSections = document.querySelectorAll('.scroll-reveal');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { rootMargin: '-10% 0px -15% 0px', threshold: 0 });
  revealSections.forEach((section) => sectionObserver.observe(section));

  // Floating gallery: max 3 on screen, reveal only after banner, hide all when back at banner
  const floatItems = document.querySelectorAll('.gallery-float-item');
  if (!floatItems.length) return;

  function updateFloatReveal() {
    const scrollY = window.scrollY;
    const contentStart = window.innerHeight; // past banner = content starts here
    const atBanner = scrollY < contentStart - 80; // hide all when back in banner area

    floatItems.forEach((el) => {
      const revealOffset = parseInt(el.dataset.revealAt, 10) || 0;
      const hideOffset = el.dataset.hideAt != null ? parseInt(el.dataset.hideAt, 10) : null;
      const revealAt = contentStart + revealOffset;
      const hideAt = hideOffset != null ? contentStart + hideOffset : null;
      const inRevealRange = scrollY >= revealAt && (hideAt == null || scrollY <= hideAt);
      const visible = !atBanner && inRevealRange;
      el.classList.toggle('revealed', visible);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateFloatReveal();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateFloatReveal();
})();
