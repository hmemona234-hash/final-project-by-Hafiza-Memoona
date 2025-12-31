/* First.js — behavior for Bano Qabil site 


/* Helper */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

document.addEventListener('DOMContentLoaded', () => {
  /* 1) Hamburger toggle (mobile nav) */
  const hamburger = $('#hamburger');
  const navList = document.querySelector('.nav-list');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('show');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close nav when clicking a link (mobile)
    navList.addEventListener('click', (ev) => {
      if (ev.target && ev.target.matches('a')) {
        // small delay for anchor scroll then close nav
        navList.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* 2) Submenu toggles (for mobile / keyboard) */
  $$('.has-sub .sub-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const li = e.currentTarget.closest('.has-sub');
      const sub = li.querySelector('.sub-list');
      const isOpen = sub.classList.toggle('show');
      e.currentTarget.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* 3) Lazy-load images in gallery (supports data-src attributes) */
  const lazyImages = $$('.gallery-item');
  if ('IntersectionObserver' in window && lazyImages.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src') || img.getAttribute('src');
          if (src && img.src !== src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.addEventListener('error', () => {
              img.style.opacity = 0.5;
            });
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '120px 0px' });

    lazyImages.forEach(img => io.observe(img));
  } else {
    // fallback: set src immediately
    lazyImages.forEach(img => {
      const src = img.getAttribute('data-src') || img.getAttribute('src');
      if (src) img.src = src;
    });
  }

  /* 4) Lightbox for gallery */
  const galleryGrid = $('#galleryGrid');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxClose = $('#lightboxClose');
  const lightboxCaption = $('#lightboxCaption');

  if (galleryGrid && lightbox) {
    galleryGrid.addEventListener('click', (ev) => {
      const img = ev.target.closest('img');
      if (!img) return;
      lightboxImg.src = img.src || img.getAttribute('data-src') || '';
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = img.alt || '';
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden','false');
    });

    // close
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox(){
      lightbox.classList.add('hidden');
      lightbox.setAttribute('aria-hidden','true');
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }
  }

  /* 5) Accordion for FAQ */
  $$('.accordion-btn').forEach(btn => {
    const panel = btn.nextElementSibling;
    btn.addEventListener('click', () => {
      const isOpen = panel.style.display === 'block';
      // close all panels (optional: allow multiple open if you prefer)
      $$('.accordion-panel').forEach(p => p.style.display = 'none');
      if (!isOpen) panel.style.display = 'block';
    });
  });

  /* 6) Admission form - simple client-side validation & status */
  const admissionForm = $('#admissionForm');
  const formStatus = $('#formStatus');
  const clearBtn = $('#clearForm');

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = '';
      const form = e.currentTarget;
      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const phone = form.querySelector('input[name="phone"]');
      const course = form.querySelector('select[name="course"]');

      // basic checks
      if (!name.value.trim()) return showStatus('Please enter full name.', true, name);
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) return showStatus('Please enter a valid email.', true, email);
      if (!phone.value.trim()) return showStatus('Please enter phone number.', true, phone);
      if (!course.value) return showStatus('Please select a course.', true, course);

      // simulate submit success (replace with real POST if server available)
      showStatus('Application sent — thank you! We will email you within 48–72 hours.', false);
      form.reset();
    });

    clearBtn && clearBtn.addEventListener('click', () => {
      admissionForm.reset();
      formStatus.textContent = '';
    });
  }

  function showStatus(msg, isError=false, focusEl=null) {
    if (formStatus) {
      formStatus.textContent = msg;
      formStatus.style.color = isError ? '#7f1d1d' : '#064e3b';
    }
    if (focusEl) focusEl.focus();
  }

  /* 7) Small utilities: set current year, smooth scrolling for anchors */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  

  /* 8) Accessibility: close dropdowns on Esc */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close mobile nav
      navList && navList.classList.remove('show');
      hamburger && hamburger.setAttribute('aria-expanded','false');
      // close sublists
      $$('.sub-list').forEach(s => s.classList.remove('show'));
      // close lightbox
      if (lightbox && !lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
        lightbox.setAttribute('aria-hidden','true');
      }
    }
  });

});
