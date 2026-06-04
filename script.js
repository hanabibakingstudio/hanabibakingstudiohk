(function () {
  'use strict';

  /* ---- Elements ---- */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const revealElements = document.querySelectorAll('.reveal');
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  /* ---- Sticky header on scroll ---- */
  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Mobile navigation ---- */
  function closeNav() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
      closeLightbox();
    }
  });

  /* ---- Scroll reveal ---- */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- Gallery ---- */
  const galleryPhotos = [
    { src: 'images/WhatsApp Image 2026-02-20 at 13.57.45.jpeg', alt: '花日烘焙教室環境', layout: 'wide' },
    { src: 'images/473450014_122187322058121376_8935688263480538054_n.jpg', alt: '蒙布朗挞作品' },
    { src: 'images/614465732_122245522652121376_9209495243498612201_n.jpg', alt: '日式曲奇作品' },
    { src: 'images/539768575_17928945165095876_258846342378631907_n.jpeg', alt: '造型和菓子作品' },
    { src: 'images/WhatsApp Image 2026-02-20 at 13.57.46.jpeg', alt: '包班烘焙體驗', layout: 'tall' },
    { src: 'images/612957039_17943627963095876_2997527513867512475_n.jpg', alt: '精緻甜點作品' },
    { src: 'images/WhatsApp Image 2026-02-20 at 11.59.40.jpeg', alt: '親子烘焙課堂' },
    { src: 'images/614153320_122245522658121376_3535374438610039123_n.jpg', alt: '季節限定作品' },
    { src: 'images/541583983_17928945156095876_765742182840252207_n.jpeg', alt: '學員作品展示' },
    { src: 'images/WhatsApp Image 2026-02-20 at 11.59.41 (3).jpeg', alt: '烘焙課堂花絮' },
    { src: 'images/539655375_17928945147095876_3466349840000070262_n.jpeg', alt: '花日出品' },
    { src: 'images/WhatsApp Image 2026-02-12 at 22.05.53.jpeg', alt: '手作甜點特寫' },
    { src: 'images/540419634_17928945174095876_5707950828174050525_n.jpeg', alt: '和風甜點' },
    { src: 'images/WhatsApp Image 2026-02-20 at 11.59.42 (2).jpeg', alt: '學員烘焙成果' },
    { src: 'images/540682350_17928945138095876_1236087106653545205_n.jpeg', alt: '創意造型烘焙' },
    { src: 'images/studio-cover.jpg', alt: 'Hanabi Baking Studio', layout: 'wide' }
  ];

  function buildGallery() {
    if (!galleryGrid) return;

    galleryPhotos.forEach(function (photo) {
      const item = document.createElement('div');
      item.className = 'gallery__item';
      if (photo.layout === 'wide') item.classList.add('gallery__item--wide');
      if (photo.layout === 'tall') item.classList.add('gallery__item--tall');

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = 'lazy';

      item.appendChild(img);
      galleryGrid.appendChild(item);
    });

    bindGalleryLightbox();
  }

  buildGallery();

  /* ---- Gallery lightbox ---- */
  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightboxImage.src = '';
    }, 350);
  }

  function bindGalleryLightbox() {
    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.addEventListener('click', function () {
        const img = item.querySelector('img');
        if (img && img.src) {
          openLightbox(img.src, img.alt);
        }
      });
    });
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  /* ---- Smooth anchor offset for fixed header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- Image fallback for missing assets ---- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';

      const alt = img.alt || 'Hanabi Baking Studio';
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
        '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" style="stop-color:#F2E6E4"/>' +
        '<stop offset="100%" style="stop-color:#E8DDD5"/>' +
        '</linearGradient></defs>' +
        '<rect fill="url(#g)" width="800" height="600"/>' +
        '<text x="400" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#C4A265" letter-spacing="4">花日</text>' +
        '<text x="400" y="330" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#9A8E86" letter-spacing="2">Hanabi Baking Studio</text>' +
        '</svg>';

      img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
      img.alt = alt;
    });
  });
})();
