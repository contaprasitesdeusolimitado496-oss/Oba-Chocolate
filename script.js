const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let scheduled = false;

function updateParallax() {
  scheduled = false;
  const viewportCenter = window.innerHeight / 2;
  parallaxItems.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - viewportCenter) * Number(element.dataset.parallax);
    element.style.transform = `translate3d(0, ${Math.max(-22, Math.min(22, offset))}px, 0)`;
  });
}

if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateParallax); }
  }, { passive: true });
  updateParallax();
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}
