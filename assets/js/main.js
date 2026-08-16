document.documentElement.classList.add('js');

const root = document.documentElement;
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-panel');
const themeButton = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.primary-nav a')];
const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);

const preferredTheme = localStorage.getItem('theme') ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function setTheme(theme) {
  const dark = theme === 'dark';
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeButton.lastElementChild.textContent = dark ? 'Light mode' : 'Dark mode';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1c2327' : '#ffffff';
}

setTheme(preferredTheme);
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  localStorage.setItem('theme', theme);
});

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.lastElementChild.textContent = open ? '−' : '+';
});

navLinks.forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.lastElementChild.textContent = '+';
}));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !menu.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.lastElementChild.textContent = '+';
  menuButton.focus();
});

const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${visible.target.id}`));
}, { rootMargin: '-20% 0px -55%', threshold: [0, .15, .4] });

sections.forEach(section => observer.observe(section));

const revealItems = document.querySelectorAll(
  '.about-layout > .primary-section-title, .about-introduction, .education, .tools-panel, .projects-heading, .project-feature, .section-heading, .primary-heading, .featured-achievement, .certifications, .contact-grid > *'
);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { rootMargin: '0px 0px -8%', threshold: .05 });

revealItems.forEach(item => {
  item.classList.add('reveal');
  revealObserver.observe(item);
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
