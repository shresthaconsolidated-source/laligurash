/* The room, photographed — and flown.

   Same three methods as scene.js and film.js (setProgress, render, resize), so
   site.js cannot tell which world it got and the page above is unchanged.

   Why this one exists: the products were photographed properly, on real tables, in
   real light. Nothing rendered was ever going to beat that. So the page is built out
   of those photographs — full-bleed plates for the acts about the brand, and the
   product itself, cut out of its own photograph, flying through the acts about the
   range.

   The one idea worth understanding here: there are no slides and no steps. Scroll
   position is a single continuous number, and EVERY position, scale, angle and
   opacity on screen is a smooth function of it. Nothing is keyed to a frame or a
   section boundary, so there is nothing that can snap. */

import { drawFlame, catchCurve, wobble } from './flame.js?v=3';

const STILL = new URLSearchParams(location.search).has('still');
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const lerp = (a, b, t) => a + (b - a) * t;

/* Cubic in-out for anything the eye follows, quintic smoothstep for anything that
   fades. The difference is small on paper and obvious on screen: a fade with a
   cubic ease still shows its start and end. */
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => (t = clamp01(t), t * t * t * (t * (t * 6 - 15) + 10));

/* The act heights in site.css ARE the script, so the two must agree. Three of them are
   fixed; the collection is not, because it has to give every product the same stretch
   of scroll. Seven products at 68vh was the original 480vh - eleven products get 748vh
   instead of squeezing four extra candles into the same distance, which read as a
   stampede. The number is pushed into CSS as --collection so neither side can drift. */
const PER_PRODUCT = 68;
const FIXED = [120, 150, 150];

/* Where each candle flies in from and out to, in fractions of the viewport, with the
   bow of its arc and how far it turns on the way. Hand-set rather than generated:
   the point is that no two entrances are the same and none of them crosses the
   headline, which a random scatter cannot promise. The rule that makes it read as
   one continuous relay rather than seven separate entrances: each row's `out` is on
   the OPPOSITE edge from the next row's `in`. Two candles crossing the same edge at
   the same moment looks like a collision. */
const FLIGHT = [
  { in: [1.24, 0.90], out: [-0.26, 0.20], bow: 0.26, spin: 0.26 },
  { in: [1.26, 0.16], out: [-0.28, 0.82], bow: -0.24, spin: -0.22 },
  { in: [1.22, 0.62], out: [0.50, -0.34], bow: 0.22, spin: 0.19 },
  { in: [0.56, 1.36], out: [-0.28, 0.30], bow: 0.28, spin: -0.27 },
  { in: [1.26, 0.74], out: [-0.26, 0.14], bow: -0.25, spin: 0.23 },
  { in: [1.20, 0.28], out: [0.58, 1.36], bow: 0.20, spin: -0.20 },
  { in: [-0.26, 0.66], out: [1.28, 0.22], bow: -0.27, spin: 0.25 },
  { in: [-0.24, 0.36], out: [1.28, 0.78], bow: -0.23, spin: -0.24 },
  { in: [0.40, -0.36], out: [-0.28, 0.58], bow: 0.25, spin: 0.21 },
  { in: [0.72, 1.34], out: [1.26, 0.40], bow: -0.26, spin: -0.19 },
  { in: [0.62, -0.34], out: [0.34, 1.36], bow: 0.24, spin: 0.22 },
];

/* Three more candles drifting far behind everything, at a fifth of the brightness
   and out of focus. They are what stops the dark two-thirds of the screen reading
   as an empty rectangle between products. */
const DRIFT = [
  { cut: 3, x: 0.14, y: 0.30, k: 0.30, rate: 0.62, a: 0.20, blur: 7 },
  { cut: 5, x: 0.86, y: 0.74, k: 0.24, rate: -0.44, a: 0.16, blur: 9 },
  { cut: 1, x: 0.34, y: 0.86, k: 0.20, rate: 0.88, a: 0.13, blur: 11 },
];

/* Where the wicks are, as fractions of each photograph: x, the foot of the flame, and how
   tall the photographed flame stood. `unlit` means img/unlit-<shape>.png exists - the same
   photograph with its flames painted out, so the page can light them itself. Frosted, the shot glass,
   the daisy, the open lidded jar and the back clear jar were photographed unlit already.
   */
const WICKS = {
  matka:     { unlit: true,  at: [[0.235, 0.24, 0.20], [0.746, 0.28, 0.20]] },
  clearjar:  { unlit: true,  at: [[0.472, 0.29, 0.25], [0.80, 0.05, 0.22]] },
  daisy:     { unlit: false, at: [[0.392, 0.372, 0.075]] },
  jarlid:    { unlit: false, at: [[0.58, 0.35, 0.13]] },
  diyo:      { unlit: true,  at: [[0.52, 0.34, 0.28]] },
  lotus:     { unlit: true,  at: [[0.507, 0.26, 0.16]] },
  peony:     { unlit: true,  at: [[0.50, 0.19, 0.18]] },
  potfloral: { unlit: true,  at: [[0.228, 0.20, 0.13], [0.739, 0.20, 0.13]] },
  succulent: { unlit: true,  at: [[0.27, 0.105, 0.07], [0.21, 0.63, 0.08]] },
  frosted:   { unlit: false, at: [[0.246, 0.20, 0.14], [0.74, 0.20, 0.14]] },
  shotglass: { unlit: false, at: [[0.657, 0.11, 0.09]] },
};
const HERO_WICKS = [[0.29, 0.465, 0.074], [0.711, 0.484, 0.074]];

/* How long a parked candle waits for the match before it lights itself, and the gap
   between its wicks when it does. Long enough to be found, short enough that someone
   scrolling on a phone never sees a dark collection. */
const NEXT_WICK = 0.45;
const HERO_WAIT = 12;

const nowS = () => performance.now() / 1000;

export async function createWorld(canvas, content, opts = {}) {
  // lit: everything starts burning and there is no match (reduced motion, stills)
  const LIT = !!opts.lit;
  // how long a parked candle waits; ?wait=60 holds it dark long enough to test by hand
  const WAIT = opts.wait > 0 ? opts.wait : 2.4;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const cards = (content.cards || []).slice(0, FLIGHT.length);
  const N = cards.length;

  const ACTS = [FIXED[0], FIXED[1], Math.round(PER_PRODUCT * N), FIXED[2]];
  document.documentElement.style.setProperty('--collection', ACTS[2] + 'vh');
  const TOTAL = ACTS.reduce((a, b) => a + b, 0);
  const EDGE = ACTS.reduce((a, v) => (a.push(a[a.length - 1] + v / TOTAL), a), [0]);
  const bg = (content.colors && content.colors.bg) || '#0b0a09';

  /* ── images ───────────────────────────────────────────────────────────── */
  const img = {};
  const want = src => img[src] || (img[src] = Object.assign(new Image(),
    { decoding: 'async', src }));
  const plate = n => want(`img/plate-${n}.jpg`);
  const lit = i => want(`img/cut-${cards[i].shape}.png?v=2`);
  const cut = i => WICKS[cards[i].shape]?.unlit ? want(`img/unlit-${cards[i].shape}.png?v=3`) : lit(i);
  const HERO = 'hero-unlit';

  /* One record per wick: `at` is the moment it caught, null while it is dark. */
  const light = () => ({ at: LIT ? -100 : null, seed: Math.random() * 60 });
  const wicks = cards.map(c => (WICKS[c.shape]?.at || []).map(light));
  const heroWicks = HERO_WICKS.map(light);
  // how alight a wick is: the flare of catching, then 1
  const flameOf = w => w.at === null ? 0 : catchCurve(nowS() - w.at);
  // how far the light it throws has spread into the room - slower than the flame
  const warmOf = w => w.at === null ? 0 : smooth((nowS() - w.at) / 1.8);
  const litOf = i => wicks[i] && wicks[i].length
    ? wicks[i].reduce((a, w) => a + warmOf(w), 0) / wicks[i].length : 1;

  let api = null;
  let match = { x: 0, y: 0, on: false, reach: 1 };
  let targets = [];      // every wick drawn this frame, and where it landed on screen
  const vel = cards.map(() => ({ x: null, lean: 0 }));
  let dt = 1 / 60, parked = -1, parkedAt = 0, heroSince = nowS();
  // the colour of the light: plain candlelight, or leaning toward whichever scent is chosen
  const FLAME_RGB = [255, 160, 74];
  const tint = FLAME_RGB.slice();
  let tintTo = FLAME_RGB.slice();
  const rgba = (k, a) => `rgba(${Math.round(tint[0] * k)},${Math.round(tint[1] * k)},${Math.round(tint[2] * k)},${a})`;

  function ignite(w, x, y) {
    if (w.at !== null) return;
    w.at = nowS();
    if (api && api.onIgnite) api.onIgnite(x / dpr, y / dpr);
  }

  /* A dark wick still glows a little at its tip, like one just blown out. It is the only
     clue on the page of where to put the match. */
  function ember(x, y, h, t, seed, a) {
    const r = Math.max(3 * dpr, h * 0.09);
    const pulse = 0.6 + 0.4 * Math.sin(t * 2.1 + seed);
    const g = ctx.createRadialGradient(x, y - h * 0.02, 0, x, y - h * 0.02, r);
    g.addColorStop(0, `rgba(255,120,48,${(0.75 * a * pulse).toFixed(3)})`);
    g.addColorStop(0.35, `rgba(220,70,20,${(0.28 * a * pulse).toFixed(3)})`);
    g.addColorStop(1, 'rgba(200,60,20,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  function flameAt(w, x, y, h, t, a, lean) {
    targets.push({ w, x, y, h, a });
    const k = flameOf(w);
    ctx.save();
    ctx.globalAlpha = a;
    if (k > 0) drawFlame(ctx, x, y, h, t, w.seed, k, lean);
    else if (!LIT) ember(x, y, h, t, w.seed, a);
    ctx.restore();
  }

  // The first screen has to be a photograph, not a black rectangle, so the hero
  // plate is waited for; the rest arrive while he is reading the headline.
  await new Promise(res => {
    const im = plate(HERO);
    if (im.complete && im.naturalWidth) return res();
    im.onload = res; im.onerror = res;
  });
  ['story', 'bed', 'close'].forEach(plate);
  cards.forEach((_, i) => cut(i));

  let dpr = 1, W = 0, H = 0;
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = Math.round(innerWidth * dpr);
    H = canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.imageSmoothingQuality = 'high';
    draw(clock);
  }

  /* ── backdrop ─────────────────────────────────────────────────────────── */
  /* Cover-fit with a scale and an offset. A backdrop that letterboxes is finished;
     a backdrop that never moves is a screenshot. */
  function cover(im, scale, dy, alpha) {
    if (!im || !im.complete || !im.naturalWidth || alpha <= 0.004) return null;
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight) * scale;
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    const x = (W - w) / 2, y = (H - h) / 2 + dy;
    ctx.globalAlpha = alpha;
    ctx.drawImage(im, x, y, w, h);
    ctx.globalAlpha = 1;
    return { x, y, w, h, a: alpha };
  }

  /* Each plate owns a stretch of the page and dissolves into the next across a
     window either side of the boundary, so the change is never a cut and never
     lands on the same scroll position twice. */
  const PLATES = [
    { name: HERO, a: EDGE[0], b: EDGE[1] },
    { name: 'story', a: EDGE[1], b: EDGE[2] },
    { name: 'bed', a: EDGE[2], b: EDGE[3] },
    { name: 'close', a: EDGE[3], b: EDGE[4] },
  ];
  const XFADE = 0.035;

  let heroRect = null;
  function backdrop(p) {
    heroRect = null;
    for (let i = 0; i < PLATES.length; i++) {
      const s = PLATES[i];
      const inA = smooth((p - (s.a - XFADE)) / (XFADE * 2));
      const outA = 1 - smooth((p - (s.b - XFADE)) / (XFADE * 2));
      const a = (i === 0 ? 1 : inA) * (i === PLATES.length - 1 ? 1 : outA);
      if (a <= 0.004) continue;
      // a slow push across each plate's own stretch: 1.11 down to 1.02, never static
      const k = clamp01((p - s.a) / (s.b - s.a));
      const r = cover(plate(s.name), 1.11 - 0.09 * ease(k), H * (0.035 - 0.07 * k), a);
      if (i === 0) heroRect = r;
    }
  }

  /* ── the flight ───────────────────────────────────────────────────────── */
  /* Position on a quadratic bezier, so a candle arrives on a curve rather than
     sliding down a ruled line. The control point is the midpoint pushed sideways,
     square to the direction of travel — which is the whole difference between
     something flying and something being dragged. */
  function arc(from, to, bow, t) {
    const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2;
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const cx = mx - dy * bow, cy = my + dx * bow;
    const n = 1 - t;
    return [n * n * from[0] + 2 * n * t * cx + t * t * to[0],
            n * n * from[1] + 2 * n * t * cy + t * t * to[1]];
  }

  const SETTLE = () => innerWidth < 760 ? [0.50, 0.44] : [0.665, 0.50];

  function product(i, d, t) {
    const im = cut(i);
    if (!im.complete || !im.naturalWidth) return;

    const away = Math.min(1, Math.abs(d));
    // It must stay SOLID for most of the journey. Fading the moment it leaves the
    // centre is what turned the flight into a blink: the candle was already a ghost
    // by the time it had crossed a third of the screen. Now it dissolves only as it
    // reaches the edge, and the one arriving holds on longer than the one leaving,
    // so the eye is handed forward rather than left behind.
    const gate = d < 0 ? 0.56 : 0.44;
    const alpha = 1 - smooth((away - gate) / (1 - gate));
    if (alpha <= 0.004) return;

    const f = FLIGHT[i % FLIGHT.length];
    const end = d < 0 ? f.in : f.out;
    const tt = ease(away);
    const [fx, fy] = arc(SETTLE(), end, d < 0 ? f.bow : -f.bow, tt);

    // it shrinks as it leaves, and turns a little — a candle that flies across the
    // screen perfectly upright reads as a sprite, not an object
    const k = lerp(1, 0.74, tt);
    const ang = f.spin * (d < 0 ? -tt : tt);

    // and it is never quite still: a slow float, out of phase per product, so seven
    // parked candles are not seven frozen ones
    const bob = Math.sin(t * 0.55 + i * 1.7) * 0.007 * (1 - away);
    const sway = Math.cos(t * 0.41 + i * 2.3) * 0.004 * (1 - away);

    const box = innerWidth < 760
      ? [W * 0.78, H * 0.42] : [W * 0.50, H * 0.60];
    const s = Math.min(box[0] / im.naturalWidth, box[1] / im.naturalHeight) * k;
    const w = im.naturalWidth * s, h = im.naturalHeight * s;

    const px = W * (fx + sway), py = H * (fy + bob);
    const L = litOf(i);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(px, py);
    ctx.rotate(ang);
    // a candle nobody has lit sits in the dark, and comes up as its own flame takes
    if (L < 0.995) ctx.filter = `brightness(${(0.52 + 0.48 * L).toFixed(3)})`;
    // the glow a lit candle throws onto the air around it, which a flat cut-out
    // pasted on a dark page does not have and badly misses
    ctx.shadowColor = rgba(1, (0.42 * (0.2 + 0.8 * L)).toFixed(3));
    ctx.shadowBlur = h * 0.17;
    ctx.drawImage(im, -w / 2, -h / 2, w, h);
    ctx.restore();

    // A flame burns upright whatever the candle is doing, and trails behind it when it
    // moves - so it is drawn on its own, after the candle, not inside its rotation.
    const v = vel[i];
    const vx = v.x === null ? 0 : (px - v.x) / Math.max(dt, 1e-3);
    v.x = px;
    v.lean += (Math.max(-0.5, Math.min(0.5, -vx / (W * 1.1))) - v.lean) * Math.min(1, dt * 7);
    const wk = WICKS[cards[i].shape];
    if (!wk) return;
    const cs = Math.cos(ang), sn = Math.sin(ang);
    wk.at.forEach(([wx, wy, wh], k) => {
      const lx = (wx - 0.5) * w, ly = (wy - 0.5) * h;
      flameAt(wicks[i][k], px + lx * cs - ly * sn, py + lx * sn + ly * cs, wh * h * 0.92, t, alpha, v.lean);
    });
  }

  function drifters(p, t) {
    if (innerWidth < 760) return;             // a phone has no room for scenery
    for (const d of DRIFT) {
      const im = lit(d.cut % N);
      if (!im.complete || !im.naturalWidth) continue;
      const h = Math.min(W * 0.26, H * 0.34) * d.k;
      const w = im.naturalWidth / im.naturalHeight * h;
      // they answer the scroll at their own rate, which is what makes the depth
      const y = ((d.y + p * d.rate + Math.sin(t * 0.18 + d.x * 9) * 0.02) % 1.6 + 1.6) % 1.6 - 0.3;
      ctx.save();
      ctx.globalAlpha = d.a;
      ctx.filter = `blur(${d.blur * dpr}px)`;
      ctx.translate(W * d.x, H * y);
      ctx.rotate(Math.sin(t * 0.12 + d.x * 5) * 0.09);
      ctx.drawImage(im, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
    ctx.filter = 'none';
  }

  /* A warm pool of light under whichever candle is on screen. It is the cheapest
     way to tell the eye this is a lit room and not a dark page with pictures on it. */
  function pool(p, t) {
    const f = Math.max(0, Math.min(N - 1, Math.round(collection(p))));
    const a = smooth((p - EDGE[2] + 0.04) / 0.06) * (1 - smooth((p - EDGE[3] + 0.02) / 0.06))
      * (0.3 + 0.7 * litOf(f));
    if (a <= 0.004) return;
    const [sx, sy] = SETTLE();
    const r = Math.min(W, H) * (0.58 + Math.sin(t * 0.7) * 0.012);
    const g = ctx.createRadialGradient(W * sx, H * sy, 0, W * sx, H * sy, r);
    g.addColorStop(0, rgba(1, (0.15 * a).toFixed(4)));
    g.addColorStop(0.55, rgba(0.88, (0.05 * a).toFixed(4)));
    g.addColorStop(1, rgba(0.85, 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ── the hero: a dark room and two candles ─────────────────────────────── */
  /* The room starts in the dark. The darkness is one sheet over the photograph with
     holes cut in it - where the match is, and where each flame burns - and as the
     candles catch it lifts off the whole room, slower than the flames themselves, the
     way a room actually warms up. Drawn at half resolution: it is nothing but soft
     gradients, and it is the one full-screen layer on the page. */
  const sh = document.createElement('canvas'), sctx = sh.getContext('2d');
  function darkness(t) {
    if (!heroRect) return;
    const warm = heroWicks.reduce((a, w) => a + warmOf(w), 0) / heroWicks.length;
    const dark = 0.86 * (1 - warm) * heroRect.a;
    if (dark < 0.004) return;
    const sw = Math.ceil(W / 2), shh = Math.ceil(H / 2);
    if (sh.width !== sw || sh.height !== shh) { sh.width = sw; sh.height = shh; }
    sctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
    sctx.globalCompositeOperation = 'source-over';
    sctx.clearRect(0, 0, W, H);
    sctx.fillStyle = `rgba(6,4,3,${dark.toFixed(3)})`;
    sctx.fillRect(0, 0, W, H);
    sctx.globalCompositeOperation = 'destination-out';
    const m = Math.min(W, H);
    const hole = (x, y, r, a) => {
      const g = sctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${a.toFixed(3)})`);
      g.addColorStop(0.45, `rgba(0,0,0,${(a * 0.5).toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = g;
      sctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    if (match.on) hole(match.x, match.y - 10 * dpr, m * 0.24 * (1 + 0.03 * wobble(t * 2, 1)), 0.82);
    HERO_WICKS.forEach(([wx, wy, wh], k) => {
      const f = Math.min(1, flameOf(heroWicks[k]));
      if (f <= 0) return;
      const x = heroRect.x + wx * heroRect.w, y = heroRect.y + (wy - wh * 0.5) * heroRect.h;
      hole(x, y, m * (0.3 + 0.16 * f) * (1 + 0.025 * wobble(t * 3, k * 4)), 0.95 * f);
    });
    ctx.drawImage(sh, 0, 0, sw, shh, 0, 0, W, H);
  }

  function heroFlames(t) {
    if (!heroRect) return;
    HERO_WICKS.forEach(([wx, wy, wh], k) =>
      flameAt(heroWicks[k], heroRect.x + wx * heroRect.w, heroRect.y + wy * heroRect.h,
        wh * heroRect.h * 0.95, t, heroRect.a, 0));
  }

  /* The match warms whatever it is near, on every act - a candle page where the light
     you are holding lights nothing would give the game away. */
  function matchGlow() {
    if (!match.on) return;
    const r = Math.min(W, H) * 0.2, y = match.y - 10 * dpr;
    const g = ctx.createRadialGradient(match.x, y, 0, match.x, y, r);
    g.addColorStop(0, 'rgba(255,150,70,0.10)');
    g.addColorStop(1, 'rgba(255,120,50,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(match.x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  /* Touching a wick lights it. Measured to both the match head and the tip of its flame,
     and generous, because a wick is a few pixels wide and a hand is not that steady. */
  function strike() {
    if (LIT) return;
    if (match.on) {
      const tipY = match.y - 22 * dpr;
      for (const g of targets) {
        if (g.w.at !== null || g.a < 0.5) continue;
        const cy = g.y - g.h * 0.2;
        const reach = Math.max(30 * dpr, g.h * 0.55) * match.reach;
        const d = Math.min(Math.hypot(match.x - g.x, match.y - cy), Math.hypot(match.x - g.x, tipY - cy));
        if (d < reach) ignite(g.w, g.x, g.y - g.h * 0.3);
      }
    }
    // Nobody is made to find the match. A candle parked long enough lights itself, one
    // wick at a time; the hero does the same once the visitor is scrolling away.
    const u = collection(shown), f = Math.round(u);
    if (shown > EDGE[2] && shown < EDGE[3] && Math.abs(u - f) < 0.02 && f >= 0 && f < N) {
      if (parked !== f) { parked = f; parkedAt = nowS(); }
      else if (nowS() - parkedAt > WAIT) {
        const g = targets.find(g => g.w.at === null && wicks[f].includes(g.w));
        if (g) { ignite(g.w, g.x, g.y - g.h * 0.3); parkedAt = nowS() - WAIT + NEXT_WICK; }
      }
    } else parked = -1;
    const heroAway = shown > EDGE[1] * 0.35;
    if (heroAway || (!match.on && nowS() - heroSince > HERO_WAIT)) {
      const g = targets.find(g => g.w.at === null && heroWicks.includes(g.w));
      if (g) { ignite(g.w, g.x, g.y - g.h * 0.3); heroSince = nowS() - HERO_WAIT + 0.5; }
    }
  }

  // in CSS pixels, from match.js; reach > 1 for a finger, which is blunter than a match
  function setMatch(x, y, on, reach = 1) {
    match = { x: x * dpr, y: y * dpr, on: !!on, reach };
    // someone hunting for the wick with the match is not someone who needs help yet
    if (on) heroSince = Math.max(heroSince, nowS() - HERO_WAIT + 4);
  }

  /* ── state ────────────────────────────────────────────────────────────── */
  let target = 0, shown = 0, clock = 0, focus = 0;

  function setProgress(v) {
    target = clamp01(v);
    // site.js already eases the scroll; this second, gentler pass is what takes the
    // last stepping out of a trackpad that reports in jumps.
    const u = collection(target);
    focus = Math.max(0, Math.min(N - 1, Math.round(u)));
    return focus;
  }

  /* Where we are through the collection, as a float. The fractional part is shaped
     so a candle PARKS for most of its stretch and then flies to the next one over
     the last third — otherwise every product is permanently mid-flight and none of
     them is ever simply presented. */
  function collection(p) {
    const raw = (p - EDGE[2]) / ((EDGE[3] - EDGE[2]) / N);
    const i = Math.floor(raw), f = raw - i;
    return i + smooth((f - 0.60) / 0.40);
  }

  function draw(t) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    targets = [];
    backdrop(shown);
    drifters(shown, t);
    darkness(t);
    heroFlames(t);
    matchGlow();
    pool(shown, t);
    const u = collection(shown);
    // only the two candles either side of us can be on screen; drawing the far one
    // first keeps the arriving product in front of the leaving one
    for (let i = Math.floor(u) - 1; i <= Math.floor(u) + 2; i++) {
      if (i < 0 || i >= N) continue;
      product(i, u - i, t);
    }
    strike();
  }

  let last = performance.now();
  function render(t) {
    clock = t;
    const now = performance.now();
    // frame-rate independent damping, so a 60 Hz laptop and a 120 Hz monitor ease
    // over the same amount of TIME rather than the same number of frames
    dt = Math.min(0.05, (now - last) / 1000); last = now;
    // a new scent washes in over about a second, the way a smell does
    for (let c = 0; c < 3; c++) tint[c] += (tintTo[c] - tint[c]) * (STILL ? 1 : 1 - Math.pow(0.02, dt));
    // A still is a single moment, not a journey: if the canvas is still easing when
    // the shutter goes, the photograph shows a position nobody ever asked for.
    if (STILL) shown = target;
    else shown += (target - shown) * (1 - Math.pow(1e-7, dt));
    draw(t);
  }

  resize();
  // [r,g,b] to lean the light toward, or null for plain candlelight
  function setTint(rgb) { tintTo = rgb ? rgb.slice() : FLAME_RGB.slice(); }

  api = { render, setProgress, resize, setMatch, setTint, products: N, onIgnite: null,
    // how many wicks are burning, for the page and for testing
    burning: () => heroWicks.concat(...wicks).filter(w => w.at !== null).length,
    // every wick on screen this frame, in CSS pixels
    wickSpots: () => targets.map(g => ({ x: g.x / dpr, y: (g.y - g.h * 0.2) / dpr, lit: g.w.at !== null })) };
  return api;
}
