// ==========================================================================
// Footer year
// ==========================================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================================================
// Mobile nav toggle
// ==========================================================================
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================================================
// Ruler: scroll-depth fill + active section highlighting
// ==========================================================================
const rulerFill = document.getElementById('rulerFill');
const rulerLinks = document.querySelectorAll('.ruler-list a');
const sections = Array.from(document.querySelectorAll('main .stratum[id]'));

function updateRulerFill() {
  if (!rulerFill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  rulerFill.style.height = Math.min(100, Math.max(0, percent)) + '%';
}

window.addEventListener('scroll', updateRulerFill, { passive: true });
window.addEventListener('resize', updateRulerFill);
updateRulerFill();

if ('IntersectionObserver' in window && sections.length && rulerLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        rulerLinks.forEach(link => {
          link.classList.toggle('is-active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));
}

// ==========================================================================
// Reveal-on-scroll (single quiet pattern, not per-card)
// ==========================================================================
const revealTargets = document.querySelectorAll('.stratum .wrap > *');
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// ==========================================================================
// Contact form — submits to Formspree without leaving the page
// ==========================================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (contactForm.action.includes('YOUR_FORM_ID')) {
      formStatus.textContent = 'This form needs a Formspree ID — sign up at formspree.io and update the form action in index.html.';
      formStatus.classList.add('is-error');
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    formStatus.classList.remove('is-error');
    formStatus.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent — thank you, I\'ll reply as soon as I can.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong sending that. Try again, or email me directly.';
        formStatus.classList.add('is-error');
      }
    } catch (error) {
      formStatus.textContent = 'Something went wrong sending that. Try again, or email me directly.';
      formStatus.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
    }
  });
}