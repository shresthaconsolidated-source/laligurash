/* Glue: content -> world -> scroll. The page's only job is to tell the camera how
   far down the document we are; everything cinematic happens in scene.js. */
/* This template is built out of photographs. There is no fallback to a live room:
   a WebGL approximation of a candle next to a real one of the same candle only ever
   makes the real one look better. */
const q = new URLSearchParams(location.search);
const STILL = q.has('still');                       // screenshot mode, see site.py shot
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = s => document.querySelector(s);
const loader = $('#loader'), count = $('#count'), bar = $('#loadbar');
const canvas = $('#world');

const setText = (el, v) => { if (el) el.textContent = v; };
setText($('#yr'), new Date().getFullYear());

/* ── loading ──────────────────────────────────────────────────────────────
   The count is honest: it moves when a real step finishes, not on a timer. */
let shown = 0;
function progressTo(target) {
  target = Math.round(target);
  const step = () => {
    if (shown >= target) return;
    shown += 1;
    setText(count, shown);
    if (bar) bar.style.width = shown + '%';
    requestAnimationFrame(step);
  };
  step();
}

function fail(msg) {
  console.warn('[site]', msg);
  document.body.classList.add('no-3d');
  if (loader) loader.style.display = 'none';
  if (canvas) canvas.style.display = 'none';
  // The type is still on the page and still readable. That is the whole point of
  // keeping real DOM text rather than baking it into the scene.
  document.querySelectorAll('.fade-in, .eyebrow, .hero__sub, .nav')
    .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

(async function boot() {
  progressTo(18);

  let content;
  try {
    content = await (await fetch('content.json', { cache: 'no-cache' })).json();
  } catch (e) { return fail('content.json did not load: ' + e.message); }
  progressTo(38);

  let world;
  try {
    world = await (await import('./plates.js?v=7')).createWorld(canvas, content,
      { lit: STILL || reduced || q.has('lit'), wait: parseFloat(q.get('wait')) });
  } catch (e) { return fail('the room failed to start: ' + e.message); }
  if (!world) return fail('no drawing context');
  if (q.has('debug')) window.__world = world;
  progressTo(72);

  const cards = (content.cards || []).slice(0, 11);   // matches FLIGHT in plates.js
  setText($('#ptot'), String(cards.length).padStart(2, '0'));

  /* First frame costs the most - shaders compile here, not on the first scroll. */
  world.render(0);
  progressTo(100);

  addEventListener('resize', () => world.resize(), { passive: true });

  /* ── sound ────────────────────────────────────────────────────────────── */
  /* Off until asked for. The button says what it will do, and a remembered "on" waits
     for the first click or key, because browsers stay silent until then. */
  let sound = null;
  const soundBtn = $('#sound');
  if (!STILL && soundBtn) {
    try {
      sound = (await import('./sound.js?v=3')).createSound();
      if (q.has('debug')) window.__sound = sound;
      const show = on => {
        soundBtn.classList.toggle('on', on);
        soundBtn.setAttribute('aria-pressed', String(on));
        soundBtn.querySelector('b').textContent = on ? 'Sound on' : 'Sound off';
      };
      soundBtn.hidden = false;
      soundBtn.addEventListener('click', () => show(sound.set(!sound.on)));
      if (sound.wanted) {
        const wake = e => {
          if (e.target.closest && e.target.closest('#sound')) return;
          show(sound.set(true));
          removeEventListener('pointerdown', wake); removeEventListener('keydown', wake);
        };
        addEventListener('pointerdown', wake); addEventListener('keydown', wake);
      }
    } catch (e) { console.warn('[site] no sound:', e.message); sound = null; }
  }

  /* ── scent ────────────────────────────────────────────────────────────── */
  /* Four buttons over the room and the four scent cards on the reading page are the
     same control: whichever is pressed, all of them show the choice. */
  let scent = null;
  const picker = $('#picker');
  try {
    const { createScent, SCENTS } = await import('./scent.js?v=3');
    scent = createScent({ reduced });
    const pads = [...document.querySelectorAll('[data-scent]')];
    scent.onChange(key => {
      world.setTint(key ? SCENTS[key].light : null);
      pads.forEach(b => {
        const on = b.dataset.scent === key;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      if (picker) picker.classList.toggle('chosen', !!key);
    });
    pads.forEach(b => {
      b.addEventListener('click', () => { scent.set(b.dataset.scent); if (sound) sound.scent(); });
      if (b.tagName !== 'BUTTON') b.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
      });
    });
    if (picker && !STILL) picker.hidden = false;
    if (q.get('scent')) scent.set(q.get('scent'));
  } catch (e) { console.warn('[site] no scent:', e.message); scent = null; }

  /* ── the match ────────────────────────────────────────────────────────── */
  /* The room starts dark and the visitor holds the light. The hint goes the moment
     the first wick catches, whoever lit it. */
  const hintEl = $('#lighthint');
  if (!STILL && !reduced && !q.has('lit')) {
    try {
      const { createMatch } = await import('./match.js?v=4');
      const match = createMatch({
        onMove: (x, y, on, reach) => world.setMatch(x, y, on, reach),
        onStrike: () => sound && sound.strike(),
      });
      let first = true;
      world.onIgnite = (x, y) => {
        match.sparks(x, y);
        if (sound) sound.ignite();
        if (first && hintEl) { first = false; hintEl.classList.remove('on'); }
      };
      if (hintEl) {
        if (matchMedia('(pointer: coarse)').matches) hintEl.textContent = 'Tap a wick to light it';
        setTimeout(() => first && hintEl.classList.add('on'), 1900);
      }
    } catch (e) { console.warn('[site] no match:', e.message); }
  }

  /* ── scroll -> camera ─────────────────────────────────────────────────── */
  let scroll = 0, target = 0;
  // The camera flies over the four acts only; the reading page under #more does not stretch the flight.
  const maxScroll = () => Math.max(1, (document.getElementById('more')?.offsetTop ?? document.documentElement.scrollHeight) - innerHeight);

  let lenis = null;
  if (!STILL && !reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1 });
    lenis.on('scroll', ({ scroll: s }) => { target = s / maxScroll(); });
  } else {
    addEventListener('scroll', () => { target = scrollY / maxScroll(); }, { passive: true });
  }

  if (STILL) {
    // Freeze at one moment and show only the act that belongs to it, so the
    // camera and the words in the photograph agree with each other.
    const p = parseFloat(q.get('p') || '0');
    const act = q.get('act');
    if (act) {
      document.querySelectorAll('.act').forEach(s => {
        if (!s.classList.contains('act--' + act)) s.style.display = 'none';
        else s.style.height = '100svh';
      });
    }
    target = scroll = p;
    world.setProgress(p);
    document.querySelectorAll('.fade-in, .eyebrow, .hero__sub, .nav')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ── the collection card follows whichever candle the camera is on ────── */
  let lastFocus = -1;
  const pname = $('#pname'), pmeta = $('#pmeta'), pnow = $('#pnow');
  function syncCard(i) {
    if (i === lastFocus || !cards[i]) return;
    lastFocus = i;
    setText(pnow, String(i + 1).padStart(2, '0'));
    const swap = () => {
      setText(pname, cards[i].name || '');
      setText(pmeta, cards[i].meta || '');
      [pname, pmeta].forEach(el => el && (el.style.opacity = '1', el.style.transform = 'none'));
    };
    if (STILL || reduced) return swap();
    [pname, pmeta].forEach(el => {
      if (!el) return;
      el.style.transition = 'opacity .28s ease, transform .28s ease';
      el.style.opacity = '0'; el.style.transform = 'translateY(12px)';
    });
    setTimeout(swap, 280);
  }
  syncCard(world.setProgress(STILL ? scroll : 0));

  /* ── the stats count up once, when they come into view ────────────────── */
  document.querySelectorAll('.stat b[data-count]').forEach(el => {
    const raw = el.dataset.count, n = parseFloat(raw);
    el.textContent = raw;                       // never show a zero, whatever happens next
    if (STILL || reduced || !isFinite(n)) return;
    let ran = false;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || ran) return;
      ran = true; io.disconnect();
      const t1 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t1) / 1100);
        el.textContent = String(Math.round(n * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick); else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    io.observe(el);
  });

  /* ── intro, then the loop ─────────────────────────────────────────────── */
  function reveal() {
    if (loader) {
      loader.style.transition = 'opacity .9s ease, transform 1.1s cubic-bezier(.16,1,.3,1)';
      loader.style.transform = 'translateY(-100%)';
      loader.style.opacity = '0';
      setTimeout(() => (loader.style.display = 'none'), 1150);
    }
    ['.nav', '.eyebrow', '.hero__sub'].forEach((sel, i) => {
      const el = $(sel);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 1s ease';
        el.style.opacity = '1';
      }, 260 + i * 180);
    });
  }
  if (STILL) { if (loader) loader.style.display = 'none'; }
  else setTimeout(reveal, 520);

  let raf = 0, t0 = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (lenis) lenis.raf(now);
    // Ease the camera behind the scrollbar even without Lenis; a 1:1 camera
    // is what makes a scroll-driven scene feel cheap.
    target = Math.min(1, target);
    scroll += (target - scroll) * (STILL ? 1 : 0.10);
    syncCard(world.setProgress(scroll));
    world.render((now - t0) / 1000);
    if (sound) sound.update(world.burning());
    // the picker and its air belong to the room; the reading page has its own cards
    if (scent) {
      const more = document.getElementById('more');
      const k = more ? Math.max(0, Math.min(1, (more.getBoundingClientRect().top - innerHeight * 0.35) / (innerHeight * 0.4))) : 1;
      scent.setVisible(k);
      if (picker) { picker.style.opacity = k; picker.style.pointerEvents = k < 0.3 ? 'none' : ''; }
    }
  }
  raf = requestAnimationFrame(frame);

  // A hidden tab should not be rendering a 3D room on a six gigabyte card.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { t0 = performance.now() - 1000; raf = requestAnimationFrame(frame); }
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }));
})();

/* ── the reading page: reveals, spotlight cards, quote ───────────────────── */
(() => {
  // Headlines arrive word by word out of a blur.
  document.querySelectorAll('.words').forEach(h => {
    h.innerHTML = h.textContent.trim().split(/\s+/)
      .map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.25 });
  document.querySelectorAll('.reveal, .words').forEach(el => io.observe(el));

  // The hero's scroll hint has done its job once the reading page begins.
  const hint = document.querySelector('.hero__scroll'), more = document.getElementById('more');
  addEventListener('scroll', () => { if (hint && more) hint.style.opacity = scrollY > innerHeight * 0.4 ? '0' : ''; }, { passive: true });

  // A soft light follows the pointer across each card.
  document.querySelectorAll('.spot').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--x', `${e.clientX - r.left}px`);
    c.style.setProperty('--y', `${e.clientY - r.top}px`);
  }));

  // The quote goes to WhatsApp already written, so nobody has to type it twice.
  const f = document.getElementById('quoteform');
  if (f) f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f), lines = [`Namaste, I would like a quote for: ${d.get('what')}.`];
    if (d.get('count')) lines.push(`Pieces: ${d.get('count')}`);
    if (d.get('date')) lines.push(`Needed by: ${d.get('date')}`);
    if (d.get('name')) lines.push(`Name: ${d.get('name')}`);
    open(`https://wa.me/9779851312671?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
})();
