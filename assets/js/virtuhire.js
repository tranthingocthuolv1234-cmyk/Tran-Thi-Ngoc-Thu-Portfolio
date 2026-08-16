const caseSections = [...document.querySelectorAll('[data-case-section]')];
const caseLinks = [...document.querySelectorAll('.case-toc a')];
const caseContents = document.querySelector('.case-toc details');

if (caseContents && matchMedia('(max-width: 900px)').matches) {
  caseContents.removeAttribute('open');
}

if ('IntersectionObserver' in window && caseSections.length && caseLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    const current = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;
    caseLinks.forEach(link => {
      link.toggleAttribute('aria-current', link.hash === `#${current.target.id}`);
    });
  }, { rootMargin: '-18% 0px -68%', threshold: [0, .12, .35] });

  caseSections.forEach(section => sectionObserver.observe(section));
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
let lightboxTrigger = null;

document.querySelectorAll('[data-lightbox-src]').forEach(button => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || typeof lightbox.showModal !== 'function') return;
    lightboxTrigger = button;
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxAlt || '';
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => {
  if (!lightboxImage) return;
  lightboxImage.removeAttribute('src');
  lightboxImage.alt = 'Expanded project artifact';
  lightboxTrigger?.focus();
  lightboxTrigger = null;
});
