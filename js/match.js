/* The cursor is a lit match.

   It is its own canvas, fixed over everything and deaf to the pointer, so the page
   underneath behaves exactly as it did. The match is struck the first time the pointer
   moves - a flare and a spit of sparks - and from then on it follows the hand with a
   little lag, tilts into its own motion, and its flame trails behind it.

   Where a hand needs to do something precise - a link, a button, a form, the reading
   page - the match is put away and the ordinary cursor comes back. A match is a lovely
   way to light a candle and a poor way to click a text box.

   On a touchscreen there is no hover, so there is no match to hold: a tap is a strike,
   and it lights whatever it lands on. */

import { drawFlame, catchCurve } from './flame.js?v=3';

const UI = 'a, button, input, select, textarea, label, summary, [role="button"], .more';

export function createMatch({ onMove, onStrike = () => {} }) {
  const cv = document.createElement('canvas');
  cv.className = 'match';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const root = document.documentElement;

  let dpr = 1, W = 0, H = 0;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  size();
  addEventListener('resize', size, { passive: true });

  // where the hand is, and where the match is - which follows it, a touch behind
  const hand = { x: W / 2, y: H / 2 };
  const m = { x: W / 2, y: H / 2, vx: 0, tilt: 0, lean: 0 };
  let seen = false, overUI = false, inside = false;
  let show = 0;                    // 0 put away .. 1 in the hand
  let struck = -1, awaySince = 0;  // when it was struck; when it was last put away
  let touchUntil = 0;              // a tap keeps its little light for a moment
  const sparks = [];
  const now = () => performance.now() / 1000;

  function burst(x, y, n, kind) {
    for (let i = 0; i < n; i++) {
      const a = kind === 'strike' ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
      const v = kind === 'strike' ? 90 + Math.random() * 260 : 30 + Math.random() * 90;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, kind,
        life: 0, max: kind === 'strike' ? 0.25 + Math.random() * 0.35 : 0.8 + Math.random() * 1.1,
        r: kind === 'strike' ? 0.8 + Math.random() * 1.1 : 0.9 + Math.random() * 1.4,
        seed: Math.random() * 10 });
    }
  }

  function strike() {
    struck = now();
    burst(hand.x, hand.y - 2, 16, 'strike');
    onStrike();
  }

  const live = () => seen && inside && !overUI;

  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    hand.x = e.clientX; hand.y = e.clientY;
    inside = true;
    overUI = !!(e.target.closest && e.target.closest(UI));
    if (!seen) { seen = true; m.x = hand.x; m.y = hand.y; }
    // a match put away for a while has gone out; bring it back and it is struck again
    if (live() && (struck < 0 || (show < 0.02 && now() - awaySince > 4))) strike();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { inside = false; });
  addEventListener('blur', () => { inside = false; });

  // a finger: every touch is a strike, and it reaches further than a match head
  addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    if (e.target.closest && e.target.closest(UI)) return;
    hand.x = e.clientX; hand.y = e.clientY;
    touchUntil = now() + 0.6;
    burst(hand.x, hand.y, 8, 'strike');
    onStrike();
  }, { passive: true });
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'touch' || now() > touchUntil) return;
    hand.x = e.clientX; hand.y = e.clientY; touchUntil = now() + 0.35;
  }, { passive: true });

  let last = performance.now();
  function frame(ms) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ms - last) / 1000); last = ms;
    const t = ms / 1000, touching = now() < touchUntil;

    const want = live() ? 1 : 0;
    const was = show;
    show += (want - show) * Math.min(1, dt * (want ? 14 : 18));
    if (was >= 0.02 && show < 0.02) awaySince = now();
    root.classList.toggle('match-on', want === 1);

    // the match trails the hand very slightly - weight, not lag
    const px = m.x;
    m.x += (hand.x - m.x) * Math.min(1, dt * 30);
    m.y += (hand.y - m.y) * Math.min(1, dt * 30);
    m.vx += ((m.x - px) / Math.max(dt, 1e-3) - m.vx) * Math.min(1, dt * 10);
    m.tilt += (Math.max(-0.35, Math.min(0.35, m.vx * 0.0006)) - m.tilt) * Math.min(1, dt * 8);
    m.lean += (Math.max(-0.6, Math.min(0.6, -m.vx / 1500)) - m.lean) * Math.min(1, dt * 9);

    const on = show > 0.5 || touching;
    onMove(touching ? hand.x : m.x, touching ? hand.y : m.y, on, touching ? 1.8 : 1);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (show > 0.01) drawMatch(t);
    if (touching) {
      const k = Math.min(1, (touchUntil - now()) / 0.3);
      ctx.save();
      ctx.globalAlpha = k;
      drawFlame(ctx, hand.x, hand.y - 30, 26, t, 3.3, 1, 0);
      ctx.restore();
    }
    drawSparks(dt);
  }
  requestAnimationFrame(frame);

  function drawMatch(t) {
    const s = struck < 0 ? 0 : now() - struck;
    ctx.save();
    ctx.globalAlpha = show;

    // the stick, head at the hotspot, leaning back into the hand
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(-0.49 + m.tilt);
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
    let g = ctx.createLinearGradient(-2.5, 0, 2.5, 0);
    g.addColorStop(0, '#8d643a'); g.addColorStop(0.45, '#dcb680'); g.addColorStop(1, '#9f7244');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(-2.4, 3, 4.8, 70, 1.4); ctx.fill();
    ctx.shadowColor = 'transparent';
    // charred where the flame has been at it
    g = ctx.createLinearGradient(0, 3, 0, 17);
    g.addColorStop(0, 'rgba(22,14,9,1)'); g.addColorStop(1, 'rgba(22,14,9,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-2.5, 3, 5, 14);
    // the head, burnt black with a live red core
    g = ctx.createRadialGradient(-1, -1.5, 0.5, 0, 0, 6.5);
    g.addColorStop(0, '#5b2418'); g.addColorStop(0.6, '#2a120c'); g.addColorStop(1, '#140a07');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, 4.4, 6.2, 0, 0, Math.PI * 2); ctx.fill();
    g = ctx.createRadialGradient(0, -1, 0, 0, -1, 5);
    g.addColorStop(0, 'rgba(255,110,40,0.75)'); g.addColorStop(1, 'rgba(255,70,20,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, 4.4, 6.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // the strike: a white flash, then a flame that flares and settles
    if (s < 0.5) {
      const f = Math.exp(-s * 9);
      g = ctx.createRadialGradient(m.x, m.y - 4, 0, m.x, m.y - 4, 70);
      g.addColorStop(0, `rgba(255,236,200,${(0.7 * f).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,170,90,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.fillRect(m.x - 70, m.y - 74, 140, 140);
      ctx.globalCompositeOperation = 'source-over';
    }
    const k = Math.min(1.8, catchCurve(s) + 0.7 * Math.exp(-s * 5));
    // a match flame sits off the head, not on top of it, and runs taller the faster it moves
    const speed = Math.min(1, Math.abs(m.vx) / 1800);
    drawFlame(ctx, m.x + 1, m.y + 3, 34 * (1 - 0.25 * speed), t, 7.7, k, m.lean);
    ctx.restore();
  }

  function drawSparks(dt) {
    if (!sparks.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.life += dt;
      if (p.life >= p.max) { sparks.splice(i, 1); continue; }
      if (p.kind === 'strike') { p.vy += 520 * dt; p.vx *= 1 - dt * 2; }
      else { p.vy -= 30 * dt; p.vx += Math.sin(p.life * 7 + p.seed) * 40 * dt; p.vx *= 1 - dt * 1.5; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = (1 - p.life / p.max) * (p.kind === 'strike' ? 1 : 0.6 + 0.4 * Math.sin(p.life * 23 + p.seed));
      const r = p.r * 4;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(255,238,200,${a.toFixed(3)})`);
      g.addColorStop(0.25, `rgba(255,170,80,${(a * 0.6).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,110,40,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  return {
    // a candle catching throws a few embers up off its wick
    sparks: (x, y) => burst(x, y, 10, 'ember'),
  };
}
