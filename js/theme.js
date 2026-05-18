function getStoredTheme() {
  return localStorage.getItem('mhj_theme');
}

function setStoredTheme(theme) {
  localStorage.setItem('mhj_theme', theme);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.body.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('light', theme === 'light');
  setStoredTheme(theme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  });
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    });
  });
}

function hidePageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  loader.classList.add('page-loader-hidden');
  setTimeout(() => loader.remove(), 400);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  hidePageLoader();
  if (window.AOS) {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-quart',
      offset: 40,         
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: false
    });
  }
});
