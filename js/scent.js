/* The scent picker, and what each scent puts into the air.

   Choosing a scent does two things. The light in the room leans toward its colour - the
   candlelight itself, through world.setTint, and a soft wash over the whole picture - and
   something drifts through the dark in front of the candles:

   - Rose:       petals, tumbling as they fall
   - Lemongrass: long thin blades, turning slowly on the air, and a few bright motes
   - Sandalwood: incense smoke curling up from below, and warm dust in the light
   - Lavender:   small buds falling in sprigs

   All of it is drawn, not photographed: a petal is two curves and a gradient. Things
   nearer the eye are bigger, faster and softer, so the air has depth. Choosing the same
   scent again goes back to plain candlelight. */

const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

export const SCENTS = {
  rose:       { name: 'Rose',       dot: '#D98A8A', light: [255, 138, 132], wash: 'rgba(235,110,120,.55)', count: 18 },
  lemongrass: { name: 'Lemongrass', dot: '#B9C26A', light: [230, 214, 96],  wash: 'rgba(190,205,90,.45)',  count: 22 },
  sandalwood: { name: 'Sandalwood', dot: '#C69A6B', light: [255, 124, 44],  wash: 'rgba(214,120,50,.62)',   count: 30 },
  lavender:   { name: 'Lavender',   dot: '#A392C2', light: [196, 156, 255], wash: 'rgba(150,120,220,.5)',  count: 22 },
};

export function createScent({ reduced = false }) {
  const cv = document.createElement('canvas');
  cv.className = 'scent-air';
  cv.setAttribute('aria-hidden', 'true');
  const wash = document.createElement('div');
  wash.className = 'scent-wash';
  wash.setAttribute('aria-hidden', 'true');
  document.body.prepend(wash, cv);
  const ctx = cv.getContext('2d');

  let dpr = 1, W = 0, H = 0;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  size();
  addEventListener('resize', size, { passive: true });

  let current = null;
  let parts = [];

  /* ── one particle of each kind ─────────────────────────────────────────── */
  function spawn(kind, scatter) {
    const z = rnd(0.45, 1.35);                         // depth: 1 is the candle's plane
    const p = { kind, z, life: 0, fade: 0, dead: false,
      x: rnd(-0.05, 1.05) * W, y: 0, rot: rnd(0, TAU), vr: rnd(-1, 1), flip: rnd(0, TAU), vf: rnd(1.2, 2.6),
      sway: rnd(0, TAU), hue: Math.random() };
    if (kind === 'sandalwood-smoke') {
      p.x = rnd(0.1, 0.9) * W; p.y = H + rnd(0, 0.3) * H;
      p.vy = -rnd(14, 26) * z; p.len = rnd(0.35, 0.6) * H; p.phase = rnd(0, TAU);
    } else if (kind.endsWith('mote')) {
      p.y = scatter ? rnd(0, H) : H + 10;
      p.vy = -rnd(4, 14) * z; p.r = rnd(0.6, 1.8) * z;
    } else {
      p.y = scatter ? rnd(-0.1, 1) * H : -rnd(20, 120);
      p.vy = rnd(16, 30) * z * (kind === 'lemongrass' ? 0.8 : 1);
      p.size = (kind === 'rose' ? rnd(20, 32) : kind === 'lemongrass' ? rnd(70, 120) : rnd(26, 40)) * z;
      p.v = kind === 'lemongrass' ? Math.floor(rnd(0, 3)) : Math.floor(rnd(0, 2));
    }
    return p;
  }

  function populate(key, scatter) {
    const s = SCENTS[key];
    const want = reduced ? 0 : s.count;
    const out = [];
    for (let i = 0; i < want; i++) {
      if (key === 'sandalwood') out.push(spawn(i < 8 ? 'sandalwood-smoke' : 'sandalwood-mote', scatter));
      else if (key === 'lemongrass' && i >= 14) out.push(spawn('lemongrass-mote', scatter));
      else if (key === 'lavender' && i >= 16) out.push(spawn('lavender-mote', scatter));
      else out.push(spawn(key, scatter));
    }
    return out;
  }

  /* ── drawing ───────────────────────────────────────────────────────────── */
  /* Each shape is drawn once, into a small sprite, sharp and blurred; every frame after
     that is only an image stamped at a size and an angle. Drawing forty lavender sprigs
     bud by bud, every frame, took the page down to 20 frames a second. */
  function petal(c, s, back) {
    // a rose petal: broad and rounded at the top, pinched to the base, cupped
    const g = c.createLinearGradient(0, -s, 0, s * 0.8);
    g.addColorStop(0, back ? 'rgba(170,52,70,1)' : 'rgba(240,128,140,1)');
    g.addColorStop(0.7, back ? 'rgba(140,36,56,1)' : 'rgba(214,82,100,1)');
    g.addColorStop(1, 'rgba(120,30,48,1)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, s * 0.8);
    c.bezierCurveTo(-s * 0.95, s * 0.2, -s * 0.9, -s * 0.85, -s * 0.2, -s * 0.9);
    c.quadraticCurveTo(0, -s * 0.72, s * 0.2, -s * 0.9);
    c.bezierCurveTo(s * 0.9, -s * 0.85, s * 0.95, s * 0.2, 0, s * 0.8);
    c.fill();
    // the candle catching its edge
    c.strokeStyle = 'rgba(255,205,175,0.45)';
    c.lineWidth = s * 0.04;
    c.stroke();
  }

  function blade(c, s, bendSign) {
    // lemongrass: long, narrow, a slight bend, a pale midrib
    const bend = bendSign * s * 0.1, w = s * 0.085;
    const g = c.createLinearGradient(0, -s / 2, 0, s / 2);
    g.addColorStop(0, 'rgba(214,218,120,1)');
    g.addColorStop(0.5, 'rgba(150,172,70,1)');
    g.addColorStop(1, 'rgba(100,124,50,1)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, -s / 2);
    c.quadraticCurveTo(bend + w, 0, w * 0.6, s / 2);
    c.lineTo(-w * 0.6, s / 2);
    c.quadraticCurveTo(bend - w, 0, 0, -s / 2);
    c.fill();
    c.strokeStyle = 'rgba(238,242,180,0.55)';
    c.lineWidth = s * 0.008;
    c.beginPath(); c.moveTo(0, -s / 2 + 2); c.quadraticCurveTo(bend, 0, 0, s / 2 - 1); c.stroke();
  }

  function sprig(c, s, v) {
    // lavender: a short spike of buds, each a tiny two-tone ellipse
    c.strokeStyle = 'rgba(110,124,80,0.9)';
    c.lineWidth = s * 0.045;
    c.beginPath(); c.moveTo(0, s * 0.75); c.quadraticCurveTo(v * s * 0.06, 0, 0, -s * 0.6); c.stroke();
    const n = 7;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), y = s * 0.5 - k * s * 1.05, r = s * (0.16 - 0.07 * k);
      for (const side of [-1, 1]) {
        c.fillStyle = (i + (side > 0) + v) % 2 ? 'rgba(160,126,218,1)' : 'rgba(122,88,184,1)';
        c.beginPath();
        c.ellipse(side * r * 0.7 + v * k * s * 0.03, y, r * 0.75, r * 1.15, side * 0.4, 0, TAU);
        c.fill();
      }
    }
  }

  function glow(c, s, col) {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s);
    g.addColorStop(0, `rgba(${col},1)`);
    g.addColorStop(0.3, `rgba(${col},0.45)`);
    g.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = g;
    c.fillRect(-s, -s, s * 2, s * 2);
  }

  // base size each shape is drawn at; the sprite is BOX times that, square
  const BASE = 64, BOX = 2.3;
  function bake(fn, arg, blur) {
    const side = Math.ceil(BASE * BOX);
    const a = document.createElement('canvas');
    a.width = a.height = side;
    const c = a.getContext('2d');
    c.translate(side / 2, side / 2);
    fn(c, BASE, arg);
    if (!blur) return a;
    const b = document.createElement('canvas');
    b.width = b.height = side;
    const d = b.getContext('2d');
    d.filter = `blur(${blur}px)`;
    d.drawImage(a, 0, 0);
    return b;
  }
  const both = (fn, arg) => [bake(fn, arg, 0), bake(fn, arg, 3.5)];
  const SPRITES = {
    rose: [both(petal, false), both(petal, true)],
    lemongrass: [both(blade, -1), both(blade, 0), both(blade, 1)],
    lavender: [both(sprig, -1), both(sprig, 1)],
  };
  const MOTES = {
    'sandalwood-mote': bake(glow, '255,196,130', 0),
    'lemongrass-mote': bake(glow, '236,240,150', 0),
    'lavender-mote': bake(glow, '205,180,255', 0),
  };

  function smoke(p, t) {
    // a thread of incense smoke: one soft stroke that widens and wanders as it rises
    const n = 22;
    ctx.lineCap = 'round';
    for (let i = 0; i < n - 1; i++) {
      const k0 = i / n, k1 = (i + 1) / n;
      const at = k => [p.x + Math.sin(k * 5.2 + t * 0.6 + p.phase) * (8 + k * 46) * p.z
        + Math.sin(k * 11 + t * 1.3 + p.phase) * k * 10, p.y - k * p.len];
      const [x0, y0] = at(k0), [x1, y1] = at(k1);
      if (y1 > H + 20 || y0 < -20) continue;
      const a = Math.sin(Math.PI * k0) * 0.4 * p.fade;
      ctx.strokeStyle = `rgba(236,212,182,${a.toFixed(3)})`;
      ctx.lineWidth = (1.6 + k0 * 16) * p.z;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    if (p.y - p.len < -40) p.dead = true;
  }

  function mote(p) {
    const im = MOTES[p.kind], r = p.r * 4;
    ctx.globalAlpha = (0.5 + 0.5 * Math.sin(p.life * 3 + p.sway)) * 0.7 * p.fade;
    // the sprite's glow radius is BASE, in a box BASE*BOX wide
    const k = r / BASE, side = BASE * BOX * k;
    ctx.drawImage(im, p.x - side / 2, p.y - side / 2, side, side);
  }

  /* ── the loop ─────────────────────────────────────────────────────────── */
  let last = performance.now(), visible = 1;
  function frame(ms) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ms - last) / 1000); last = ms;
    const t = ms / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!parts.length) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    cv.style.opacity = visible;

    // back to front, so a near petal passes in front of a far one
    parts.sort((a, b) => a.z - b.z);
    for (const p of parts) {
      p.life += dt;
      const leaving = p.kind.split('-')[0] !== current;
      p.fade = Math.max(0, Math.min(1, p.fade + (leaving ? -dt * 1.4 : dt * 0.8)));
      if (leaving && p.fade <= 0) { p.dead = true; continue; }

      if (p.kind === 'sandalwood-smoke') { p.y += p.vy * dt; ctx.globalAlpha = 1; smoke(p, t); if (p.dead && !leaving) Object.assign(p, spawn(p.kind, false), { fade: 0 }); continue; }

      p.sway += dt * rnd(0.6, 1.1);
      p.x += (Math.sin(p.sway) * 18 * p.z + (p.kind === 'lemongrass' ? 10 : 4)) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt * (p.kind === 'lemongrass' ? 0.5 : 1);
      p.flip += p.vf * dt;

      const off = p.kind.endsWith('mote') ? p.y < -10 : p.y > H + 60;
      if (off || p.x > W + 80) {
        if (!leaving) { const q = spawn(p.kind, false); q.fade = 0; Object.assign(p, q); }
        continue;
      }

      if (p.kind.endsWith('mote')) { mote(p); continue; }

      // nearer is softer: past the candle's plane the eye cannot focus on it
      const soft = p.z > 1.12 ? 1 : 0;
      ctx.globalAlpha = p.fade * (soft ? 0.75 : p.z < 0.6 ? 0.6 : 0.95);
      const fx = Math.cos(p.flip);
      // a petal shows its darker back as it turns over; blades and sprigs keep a bend each
      const set = SPRITES[p.kind][p.kind === 'rose' ? (fx < 0 ? 1 : 0) : p.v];
      const side = BASE * BOX * (p.size / BASE);
      const c = Math.cos(p.rot), sn = Math.sin(p.rot), sx = p.kind === 'lavender' ? 0.8 + 0.2 * Math.abs(fx) : Math.max(0.12, Math.abs(fx));
      ctx.setTransform(dpr * c * sx, dpr * sn * sx, -dpr * sn, dpr * c, dpr * p.x, dpr * p.y);
      ctx.drawImage(set[soft], -side / 2, -side / 2, side, side);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    parts = parts.filter(p => !p.dead);
  }
  requestAnimationFrame(frame);

  /* ── choosing ─────────────────────────────────────────────────────────── */
  const listeners = [];
  function set(key) {
    if (key === current || !SCENTS[key]) key = null;
    current = key;
    if (key) {
      wash.style.setProperty('--wash', SCENTS[key].wash);
      wash.classList.add('on');
      // the first ones arrive already in the air, so the change reads at once
      parts.push(...populate(key, true).map(p => { p.fade = 0; return p; }));
    } else wash.classList.remove('on');
    listeners.forEach(f => f(key));
    return key;
  }

  return {
    set,
    get current() { return current; },
    onChange: f => listeners.push(f),
    // how much of the air shows: the reading page has a solid floor over it anyway
    setVisible: v => { visible = v; },
  };
}
