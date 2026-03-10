/* ============================================================
   TRAILHEAD WEBCRAFT — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Nav: add .scrolled class on scroll ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // --- Mobile Nav Toggle ---
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileClose = document.querySelector('.nav-mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active nav link highlight ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.color = 'var(--trail-amber)';
    }
  });

  // --- Scroll-triggered fade-up for cards/sections ---
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply to cards and key elements
  document.querySelectorAll('.problem-card, .service-card, .credential-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    observer.observe(el);
  });

  // --- Web3Forms contact form handler ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Show success message
          form.innerHTML = `
            <div style="text-align:center; padding: 3rem 1.5rem;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">✓</div>
              <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--summit-green); margin-bottom: 0.75rem;">Message Received</h3>
              <p style="color: var(--bark); line-height: 1.7;">You'll hear from me within one business day. No pitch deck. Just a straight conversation about where your business stands.</p>
            </div>
          `;
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        // Show error
        const errorDiv = document.createElement('p');
        errorDiv.style.cssText = 'color: var(--ember); font-size: 0.88rem; margin-top: 0.75rem;';
        errorDiv.textContent = 'Something went wrong. Please email directly at zach@trailheadwebcraft.com';
        form.appendChild(errorDiv);
      }
    });
  }

});
