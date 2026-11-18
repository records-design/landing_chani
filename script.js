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

// Chani animada: aparece girando y con los botones de personajes se transforma
(() => {
  const card = document.getElementById('magicCard');
  if (!card) return;
  const faces = [...card.querySelectorAll('.magic__face')];
  const avatars = [...document.querySelectorAll('.avatar[data-face]')];
  const cap = document.getElementById('magicCaption');
  const watch = document.getElementById('watchTale');
  const modal = document.getElementById('videoModal');
  const frame = modal && modal.querySelector('.video-modal__frame');
  let n = 0, busy = false;
  const sparkle = () => { card.classList.remove('is-sparkling'); void card.offsetWidth; card.classList.add('is-sparkling'); };
  const setFace = k => {
    if (busy || k === n) return; busy = true;
    card.classList.remove('is-waiting', 'is-entering', 'is-spinning'); void card.offsetWidth;
    card.classList.add('is-spinning'); sparkle();
    avatars.forEach((a, m) => a.setAttribute('aria-pressed', m === k));
    setTimeout(() => {
      faces[n].classList.remove('is-active');
      n = k;
      faces[n].classList.add('is-active');
      card.parentElement.dataset.who = (faces[n].className.match(/magic__face--(\w+)/) || [])[1] || '';
      if (cap) { cap.textContent = faces[n].dataset.say; cap.classList.remove('is-pop'); void cap.offsetWidth; cap.classList.add('is-pop'); }
      if (watch) watch.hidden = !faces[n].dataset.video;
    }, 350);
    setTimeout(() => { card.classList.remove('is-spinning'); busy = false; }, 720);
  };
  avatars.forEach(a => a.addEventListener('click', () => setFace(Number(a.dataset.face))));
  card.addEventListener('click', () => setFace((n + 1) % faces.length));
  // "Mirá el cuento" abre el video del personaje en una ventana grande
  if (watch && modal) {
    const close = () => { frame.innerHTML = ''; if (modal.open) modal.close(); };
    watch.addEventListener('click', () => {
      const f = faces[n];
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${f.dataset.video}?autoplay=1&rel=0" title="${f.dataset.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      modal.showModal();
    });
    modal.querySelector('.video-modal__close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.addEventListener('close', () => { frame.innerHTML = ''; });
  }
  // entrada girando la primera vez que se ve
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.classList.add('is-waiting');
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      card.classList.remove('is-waiting');
      card.classList.add('is-entering');
      setTimeout(() => { sparkle(); card.classList.remove('is-entering'); }, 1500);
    }, { threshold: .5 });
    io.observe(card);
  }
})();

document.getElementById('year').textContent = new Date().getFullYear();
