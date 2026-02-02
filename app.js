document.addEventListener('DOMContentLoaded', () => {
  // ... your existing scroll, header, menu, FAQ, smooth scroll code

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

      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, company, phone, email, service })
        });

        let data;
        try {
          data = await response.json();
        } catch {
          data = { message: 'Server returned invalid JSON' };
        }

        if (!response.ok) {
          throw new Error(data.message || 'Form submission failed');
        }

        // Success: redirect
        window.location.href = 'thankyou.html';

      } catch (error) {
        console.error('Form submission error:', error);
        alert(error.message || 'There was an error submitting your form. Contact tkrmanisha4s@gmail.com');
        btn.textContent = originalBtnText;
        btn.disabled = false;
      }
    });
  }
});
