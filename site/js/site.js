/* Laligurash — handcrafted candles from Nepal — motion layer
   Everything here is progressive: if a script fails the page is still readable. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?still=1 -> final state, no intro, no cursor. This is how screenshots are taken;
  // headless Chrome's virtual clock will not reliably finish a timeline.
  const STILL = /[?&]still/.test(location.search);
  gsap.registerPlugin(ScrollTrigger);

  /* ── smooth scroll ─────────────────────────────────── */
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: !reduced });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0, duration: 1.4 }); }
    }));

  /* ── text splitting (hand-rolled, no plugin) ───────── */
  // Splits into words and characters WITHOUT flattening the markup - an <em> inside
  // the headline has to survive, and a word must never break across two lines.
  const splitChars = el => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'word';
            [...tok].forEach(ch => {
              const c = document.createElement('span');
              c.className = 'char'; c.textContent = ch;
              w.appendChild(c);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return el.querySelectorAll('.char');
  };
  const splitLines = el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    const spans = [...el.querySelectorAll('.w')];
    const rows = []; let top = null, row = null;
    spans.forEach(s => {
      const t = Math.round(s.getBoundingClientRect().top);
      if (t !== top) { row = []; rows.push(row); top = t; }
      row.push(s.textContent);
    });
    el.innerHTML = rows.map(r => `<span class="line"><span>${r.join(' ')}</span></span>`).join('');
    return el.querySelectorAll('.line > span');
  };

  /* ── loader, then the hero reveal ──────────────────── */
  const loader = document.getElementById('loader');
  const count = document.getElementById('count');
  const bar = document.getElementById('loadbar');
  const heroChars = splitChars(document.querySelector('.hero__title'));
  gsap.set(heroChars, { yPercent: 118, rotate: 4 });

  if (STILL) {
    lenis.destroy();
    loader.style.display = 'none';
    document.getElementById('cursor').style.display = 'none';
    gsap.set(heroChars, { yPercent: 0, rotate: 0 });
    gsap.set('.reveal-up', { opacity: 1, y: 0 });
  }

  const n = { v: 0 };
  const boot = gsap.timeline({ paused: STILL, onComplete: intro });
  boot.to(n, {
    v: 100, duration: reduced ? 0.2 : 1.6, ease: 'power2.inOut',
    onUpdate: () => { count.textContent = Math.round(n.v); bar.style.width = n.v + '%'; }
  });

  function intro() {
    const tl = gsap.timeline();
    tl.to(loader, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' })
      .set(loader, { display: 'none' })
      .to(heroChars, {
        yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: 0.016
      }, '-=0.65')
      .to('.hero .reveal-up, .hero .btn', {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09
      }, '-=0.8')
      .from('.nav > *', { y: -30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, '-=0.9');
    document.body.dispatchEvent(new Event('site:ready'));
  }

  /* ── generic reveals ───────────────────────────────── */
  document.querySelectorAll('.reveal-up').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  document.querySelectorAll('.split-lines').forEach(el => {
    const lines = splitLines(el);
    gsap.from(lines, {
      yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  /* ── marquee, speed tied to scroll velocity ────────── */
  const track = document.getElementById('track');
  if (track) {
    const half = track.scrollWidth / 2;
    let x = 0, dir = 1, extra = 0;
    gsap.ticker.add(() => {
      x -= (0.6 + extra) * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0) skewX(${-extra * 1.1}deg)`;
      extra += (0 - extra) * 0.06;
    });
    ScrollTrigger.create({
      onUpdate: self => { dir = self.direction; extra = Math.min(Math.abs(self.getVelocity()) / 260, 7); }
    });
  }

  /* ── pinned horizontal rail ────────────────────────── */
  const rail = document.getElementById('rail');
  if (rail && !reduced) {
    const cards = rail.querySelectorAll('.card');
    document.getElementById('wtot').textContent = String(cards.length).padStart(2, '0');
    const dist = () => rail.scrollWidth - window.innerWidth + 40;
    gsap.to(rail, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.work', start: 'top top', end: () => '+=' + dist() * 1.15,
        pin: '.work__pin', scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: self => {
          const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          document.getElementById('wnow').textContent = String(i).padStart(2, '0');
        }
      }
    });
    cards.forEach(c => {
      const img = c.querySelector('img');
      if (img) gsap.to(img, {
        xPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist() * 1.15, scrub: true }
      });
    });
  }

  /* ── parallax media ────────────────────────────────── */
  document.querySelectorAll('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -9 }, {
      yPercent: 9, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ── counting numbers ──────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const dp = (el.dataset.count.split('.')[1] || '').length;
    const o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => { el.firstChild.nodeValue = o.v.toFixed(dp); }
    });
  });

  /* ── cursor + magnetic buttons ─────────────────────── */
  const cur = document.getElementById('cursor');
  const lab = cur.querySelector('.cursor__label');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, tgt = { ...pos };
  addEventListener('pointermove', e => { tgt.x = e.clientX; tgt.y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    pos.x += (tgt.x - pos.x) * 0.18; pos.y += (tgt.y - pos.y) * 0.18;
    cur.style.transform = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('pointerenter', () => { cur.classList.add('is-big'); lab.textContent = el.dataset.cursor; });
    el.addEventListener('pointerleave', () => { cur.classList.remove('is-big'); lab.textContent = ''; });
  });
  document.querySelectorAll('.magnetic').forEach(el => {
    const str = 0.32;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * str,
        y: (e.clientY - r.top - r.height / 2) * str,
        duration: 0.6, ease: 'power3.out'
      });
    });
    el.addEventListener('pointerleave', () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.35)' }));
  });

  /* ── scroll progress ───────────────────────────────── */
  gsap.to('#progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
  addEventListener('load', () => {
    ScrollTrigger.refresh();
    if (!STILL) return;
    // Still mode: drop every scroll trigger (including the pin, which otherwise
    // leaves a blank spacer in a screenshot) and force each animation to its end.
    ScrollTrigger.getAll().forEach(t => t.kill(true));   // true = remove pin spacers
    gsap.set('.reveal-up', { opacity: 1, y: 0 });
    gsap.set('.line > span', { yPercent: 0 });
    gsap.set('[data-parallax]', { yPercent: 0 });
    if (rail) gsap.set(rail, { x: 0 });
    document.querySelectorAll('[data-count]').forEach(el => {
      el.firstChild.nodeValue = el.dataset.count;
    });
    // ?only=<id> shows that one section alone, at the top of the page. Headless
    // Chrome captures from scroll 0 whatever the scroll position says, so the only
    // reliable way to photograph a section is to make it the first thing on the page.
    const only = new URLSearchParams(location.search).get('only');
    if (only) {
      document.querySelectorAll('main > section').forEach(sec => {
        if (sec.id !== only) sec.style.display = 'none';
      });
      ScrollTrigger.refresh();
      scrollTo(0, 0);
    }
  });
})();
