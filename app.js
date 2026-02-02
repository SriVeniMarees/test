// DOM Content Loaded to ensure elements exist before attaching listeners
document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Animations (Intersection Observer) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll('.service-card, .step-card, .section-title, .hero-content, .trust-grid, .testimonial-card, .feature-text, .feature-media');

  animatedElements.forEach(el => {
    el.classList.add('fade-in'); // Add initial class via JS to ensure graceful degradation
    observer.observe(el);
  });

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = 'none';
      // If we are at top, but glassmorphism still applies based on CSS, we rely on that. 
      // But typically we want a transparent-ish look at top if over hero? 
      // Current CSS sets a background color. Let's keep it simple.
    }
  });


  // --- Mobile Menu Toggle ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const isActive = item.classList.contains('active');

      // Close all others (optional - for accordion style)
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const span = otherItem.querySelector('.faq-icon');
        if (span) span.textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        const span = button.querySelector('.faq-icon');
        if (span) span.textContent = '×'; // Change plus to X
      }
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        // Offset for fixed header
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Form Handling ---
  const form = document.querySelector('.lead-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalBtnText = btn.textContent;
      const name = document.getElementById('name').value;
      const company = document.getElementById('company').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const service = document.getElementById('service').value;

      // Update button state
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        // Send form data to serverless function
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            company,
            phone,
            email,
            service
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit form');
        }

        // Success! Redirect to thank you page
        window.location.href = 'thankyou.html';

      } catch (error) {
        console.error('Form submission error:', error);

        // Show error message to user
        alert(error.message || 'There was an error submitting your form. Please try again or contact us directly at tkrmanisha4s@gmail.com');

        // Reset button
        btn.textContent = originalBtnText;
        btn.disabled = false;
      }
    });
  }

});

// Add CSS for fade-in animations dynamically if not present
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
