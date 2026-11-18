// Nav: fondo al hacer scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú mobile/tablet
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Aparición suave al scrollear
const targets = document.querySelectorAll('.title, .subtitle, .song, .vcard:not(.carousel__item), .prime__text, .prime__video, .about__text, .about__imgs, .platform');
targets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));
} else {
  targets.forEach(el => el.classList.add('is-visible'));
}

// Videos de YouTube: se cargan recién al hacer clic
document.querySelectorAll('.yt').forEach(btn => btn.addEventListener('click', () => {
  if (btn.querySelector('iframe')) return;
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.id}?autoplay=1&rel=0`;
  f.title = btn.getAttribute('aria-label') || 'Video de El Mundo de Chani';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  btn.appendChild(f);
}));

// Carrusel de cuentos con flechas
document.querySelectorAll('[data-carousel]').forEach(c => {
  const track = c.querySelector('.carousel__track');
  const prev = c.querySelector('[data-dir="-1"]');
  const next = c.querySelector('[data-dir="1"]');
  const update = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  [prev, next].forEach(b => b.addEventListener('click', () => {
    track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.9, behavior: 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});

document.getElementById('year').textContent = new Date().getFullYear();
