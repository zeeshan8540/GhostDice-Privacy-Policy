/**
 * Ghost Dice - Privacy Policy Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark)
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const htmlEl = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('ghostdice-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      htmlEl.removeAttribute('data-theme');
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    }
  }

  // Initial application
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (!prefersDark) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('ghostdice-theme', newTheme);
    });
  }

  // 2. Reading Progress Bar
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });

  // 3. Table of Contents Active Link Highlight via IntersectionObserver
  const sections = document.querySelectorAll('.policy-card');
  const tocLinks = document.querySelectorAll('.toc-link');

  if ('IntersectionObserver' in window && sections.length > 0 && tocLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach((section) => observer.observe(section));
  }

  // 4. Copy Email to Clipboard Functionality
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const toast = document.getElementById('toast');
  const emailAddress = 'support.ghostdice@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailAddress;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual feedback
        if (copyText) copyText.textContent = 'Copied!';
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3500);
        }

        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy Email';
        }, 2500);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }
});
